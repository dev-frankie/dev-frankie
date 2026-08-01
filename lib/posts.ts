import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const CATEGORY_META_FILE = "_category.json";

export interface PostMeta {
  /** 파일 경로 기반 slug — 예: "frontend/performance/bundle-analysis" */
  slug: string;
  /** slug를 세그먼트로 나눈 값 */
  segments: string[];
  /** 글이 속한 디렉터리 세그먼트 (파일명 제외) */
  category: string[];
  /** 카테고리 세그먼트의 표시용 라벨 */
  categoryLabels: string[];
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface Post extends PostMeta {
  content: string;
}

/** content/posts 아래 디렉터리 하나 = 카테고리 하나 */
export interface CategoryNode {
  /** 디렉터리 이름 (URL 세그먼트) */
  name: string;
  /** 표시용 이름 — _category.json의 label, 없으면 디렉터리 이름 */
  label: string;
  /** 루트 기준 경로 — 예: "frontend/performance" */
  path: string;
  segments: string[];
  description: string;
  children: CategoryNode[];
  /** 이 카테고리에 바로 속한 글 수 */
  directCount: number;
  /** 하위 카테고리까지 포함한 글 수 */
  count: number;
}

interface CategoryMeta {
  label?: string;
  order?: number;
  description?: string;
}

const isMarkdown = (file: string) => /\.mdx?$/.test(file);

/** `.`/`_`로 시작하는 파일·디렉터리는 비공개로 취급 */
const isHidden = (name: string) => name.startsWith(".") || name.startsWith("_");

const readCategoryMeta = (segments: string[]): CategoryMeta => {
  const metaPath = path.join(POSTS_DIR, ...segments, CATEGORY_META_FILE);

  if (!fs.existsSync(metaPath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8")) as CategoryMeta;
  } catch {
    return {};
  }
};

const readDirEntries = (segments: string[]) => {
  const dir = path.join(POSTS_DIR, ...segments);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !isHidden(entry.name));
};

/**
 * MDX 파서는 HTML 주석(`<!-- -->`)을 만나면 `<!`에서 멈춰 빌드를 깬다.
 * 글쓴이 메모(이미지 체크리스트 등)로 자주 쓰이므로, 렌더 전에 걷어낸다.
 * 코드펜스 안의 `<!--`는 예제 코드일 수 있으니 건드리지 않는다.
 */
const stripHtmlComments = (markdown: string): string => {
  const kept: string[] = [];
  let inFence = false;
  let inComment = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      kept.push(line);
      continue;
    }

    if (inFence) {
      kept.push(line);
      continue;
    }

    if (inComment) {
      inComment = !line.includes("-->");
      continue;
    }

    if (line.includes("<!--")) {
      if (!line.includes("-->")) {
        inComment = true;
        continue;
      }

      const cleaned = line.replace(/<!--[\s\S]*?-->/g, "").trim();

      if (cleaned) {
        kept.push(cleaned);
      }

      continue;
    }

    kept.push(line);
  }

  return kept.join("\n");
};

const parsePost = (segments: string[], raw: string): Post => {
  const { data, content } = matter(raw);
  const category = segments.slice(0, -1);

  return {
    slug: segments.join("/"),
    segments,
    category,
    categoryLabels: category.map(
      (segment, index) =>
        readCategoryMeta(category.slice(0, index + 1)).label ?? segment,
    ),
    title: String(data.title ?? segments[segments.length - 1]),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content: stripHtmlComments(content),
  };
};

/** content/posts를 재귀 순회하며 글 파일의 세그먼트 목록을 모은다 */
const collectPostSegments = (segments: string[] = []): string[][] =>
  readDirEntries(segments).flatMap((entry) => {
    if (entry.isDirectory()) {
      return collectPostSegments([...segments, entry.name]);
    }

    if (!isMarkdown(entry.name)) {
      return [];
    }

    return [[...segments, entry.name.replace(/\.mdx?$/, "")]];
  });

export const getPostSlugs = (): string[] =>
  collectPostSegments().map((segments) => segments.join("/"));

/** slug가 POSTS_DIR 밖을 가리키지 못하도록 검사 */
const resolveInsidePostsDir = (segments: string[]): string | null => {
  const resolved = path.resolve(POSTS_DIR, ...segments);

  return resolved === POSTS_DIR ||
    resolved.startsWith(`${POSTS_DIR}${path.sep}`)
    ? resolved
    : null;
};

export const getPostBySegments = (segments: string[]): Post | null => {
  const base = resolveInsidePostsDir(segments);

  if (!base) {
    return null;
  }

  for (const ext of [".mdx", ".md"]) {
    if (fs.existsSync(`${base}${ext}`)) {
      return parsePost(segments, fs.readFileSync(`${base}${ext}`, "utf8"));
    }
  }

  return null;
};

export const getPostBySlug = (slug: string): Post | null =>
  getPostBySegments(slug.split("/").filter(Boolean));

const byDateDesc = (a: PostMeta, b: PostMeta) => (a.date < b.date ? 1 : -1);

const toMeta = (post: Post): PostMeta => {
  const meta = { ...post } as Partial<Post>;
  delete meta.content;

  return meta as PostMeta;
};

export const getAllPosts = (): PostMeta[] =>
  collectPostSegments()
    .map((segments) => getPostBySegments(segments))
    .filter((post): post is Post => post !== null)
    .map(toMeta)
    .sort(byDateDesc);

export const getRecentPosts = (limit = 5): PostMeta[] =>
  getAllPosts().slice(0, limit);

export const isCategory = (segments: string[]): boolean => {
  const resolved = resolveInsidePostsDir(segments);

  return (
    resolved !== null &&
    fs.existsSync(resolved) &&
    fs.statSync(resolved).isDirectory()
  );
};

/** 카테고리에 속한 글 — 기본값은 하위 카테고리까지 포함 */
export const getPostsInCategory = (
  segments: string[],
  { recursive = true }: { recursive?: boolean } = {},
): PostMeta[] =>
  getAllPosts().filter(({ category }) => {
    if (category.length < segments.length) {
      return false;
    }

    if (!recursive && category.length !== segments.length) {
      return false;
    }

    return segments.every((segment, index) => category[index] === segment);
  });

const compareCategories = (a: CategoryNode, b: CategoryNode) => {
  const orderA = readCategoryMeta(a.segments).order ?? Number.MAX_SAFE_INTEGER;
  const orderB = readCategoryMeta(b.segments).order ?? Number.MAX_SAFE_INTEGER;

  return orderA !== orderB
    ? orderA - orderB
    : a.label.localeCompare(b.label, "ko");
};

const buildCategoryNode = (segments: string[]): CategoryNode => {
  const meta = readCategoryMeta(segments);
  const entries = readDirEntries(segments);
  const children = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => buildCategoryNode([...segments, entry.name]))
    .sort(compareCategories);
  const directCount = entries.filter(
    (entry) => entry.isFile() && isMarkdown(entry.name),
  ).length;
  const name = segments[segments.length - 1];

  return {
    name,
    label: meta.label ?? name,
    path: segments.join("/"),
    segments,
    description: meta.description ?? "",
    children,
    directCount,
    count: directCount + children.reduce((sum, child) => sum + child.count, 0),
  };
};

export const getCategoryTree = (): CategoryNode[] =>
  readDirEntries([])
    .filter((entry) => entry.isDirectory())
    .map((entry) => buildCategoryNode([entry.name]))
    .sort(compareCategories);

/** 브레드크럼용 — 각 상위 카테고리의 라벨과 경로 */
export const getCategoryTrail = (
  segments: string[],
): Array<{ label: string; path: string }> =>
  segments.map((segment, index) => {
    const trail = segments.slice(0, index + 1);

    return {
      label: readCategoryMeta(trail).label ?? segment,
      path: trail.join("/"),
    };
  });
