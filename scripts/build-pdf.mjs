// 웹 페이지를 그대로 PDF로 뽑는다.
// 원본은 RESUME.md / WORKEXPERIENCE.md 이고, 렌더링은 Next 앱(/resume, /career)이
// 담당하므로 화면과 PDF의 레이아웃이 항상 같다. (RESUME.html은 건드리지 않는다)
//
//   npm run docs:pdf                     # /resume  → RESUME.pdf
//   npm run docs:pdf -- /career CAREER.pdf
import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const route = process.argv[2] ?? "/resume";
const output = process.argv[3] ?? "RESUME.pdf";
const port = Number(process.env.PDF_PORT ?? 3123);
// dev 서버(.next)와 겹치지 않도록 별도 디렉터리에 빌드한다
const distDir = ".next-build";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((path) => existsSync(path));

if (!chrome) {
  console.error(
    "Chrome을 찾지 못했습니다. CHROME_PATH 환경변수로 경로를 지정하세요.",
  );
  process.exit(1);
}

const env = { ...process.env, NEXT_DIST_DIR: distDir };

console.log("Building...");

const build = spawnSync("npx", ["next", "build"], {
  cwd: root,
  env,
  stdio: ["ignore", "ignore", "inherit"],
});

if (build.status !== 0) {
  process.exit(1);
}

const server = spawn("npx", ["next", "start", "-p", String(port)], {
  cwd: root,
  env,
  stdio: ["ignore", "ignore", "inherit"],
});

const stop = () => {
  server.kill("SIGTERM");
};

process.on("exit", stop);
process.on("SIGINT", () => {
  stop();
  process.exit(130);
});

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://localhost:${port}${route}`);

      if (response.ok) {
        return;
      }
    } catch {
      /* 아직 안 떴다 */
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`서버가 뜨지 않았습니다: http://localhost:${port}${route}`);
};

await waitForServer();

const print = spawnSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=8000",
    `--print-to-pdf=${join(root, output)}`,
    `http://localhost:${port}${route}`,
  ],
  { encoding: "utf8" },
);

stop();

if (print.status !== 0) {
  console.error(print.stderr);
  process.exit(1);
}

console.log(`Built ${output} from ${route}`);
