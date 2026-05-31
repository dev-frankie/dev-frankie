import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const wrapPage = ({ title, body, current }) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} · 안동주</title>
  <link rel="stylesheet" href="./assets/resume.css" />
</head>
<body>
  <header class="site-header">
    <a class="site-header__brand" href="./README.md">dev-frankie</a>
    <nav class="site-nav" aria-label="문서">
      <a href="./RESUME.html"${current === "resume" ? ' aria-current="page"' : ""}>이력서</a>
      <a href="./WORKEXPERIENCE.html"${current === "work" ? ' aria-current="page"' : ""}>경력기술서</a>
      <a href="https://github.com/dev-frankie" target="_blank" rel="noopener noreferrer">GitHub</a>
    </nav>
  </header>
  <main class="doc-content">
${body}
  </main>
  <p class="print-hint doc-content" style="text-align: center; padding-bottom: 2rem;">
    인쇄/PDF 저장: 브라우저 메뉴 → 인쇄 → PDF로 저장
  </p>
</body>
</html>
`;

const mdToHtml = (inputPath) => {
  const result = spawnSync(
    "npx",
    ["--yes", "marked", "-i", inputPath],
    { cwd: root, encoding: "utf8" },
  );

  if (result.status !== 0) {
    console.error(result.stderr);
    process.exit(1);
  }

  return result.stdout.trim();
};

const workBody = mdToHtml("WORKEXPERIENCE.md");
const workHtml = wrapPage({
  title: "경력기술서",
  body: workBody,
  current: "work",
});

writeFileSync(join(root, "WORKEXPERIENCE.html"), workHtml, "utf8");
console.log("Built WORKEXPERIENCE.html");
