/**
 * 본문 heading에 id를 붙이고 동시에 TOC 목록을 수집하는 rehype 플러그인.
 * rehype-slug + rehype-toc 조합을 쓰지 않는 이유는 한글 heading을 그대로
 * id로 쓰기 위해서다. (github-slugger는 한글도 통과시키지만, 여기선 의존성
 * 없이 규칙을 직접 통제한다.)
 */

export interface Heading {
  id: string;
  text: string;
  depth: number;
}

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

export const slugify = (text: string): string => {
  const slug = text
    .trim()
    .toLowerCase()
    // 문자·숫자·공백·하이픈만 남긴다 (한글 포함)
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "section";
};

const toText = (node: HastNode): string => {
  if (node.type === "text") {
    return node.value ?? "";
  }

  return (node.children ?? []).map(toText).join("");
};

const isHeading = (node: HastNode): node is HastNode & { tagName: string } =>
  node.type === "element" && /^h[1-6]$/.test(node.tagName ?? "");

interface Options {
  /** 순회하며 채워지는 배열 — 컴파일 후 TOC로 사용한다 */
  headings: Heading[];
  /** TOC에 담을 heading 레벨 */
  levels?: number[];
}

export const rehypeHeadingIds =
  ({ headings, levels = [2, 3, 4] }: Options) =>
  (tree: unknown) => {
    const used = new Map<string, number>();

    const visit = (node: HastNode) => {
      if (isHeading(node)) {
        const depth = Number(node.tagName[1]);
        const text = toText(node).trim();
        const base = slugify(text);
        const seen = used.get(base) ?? 0;
        const id = seen === 0 ? base : `${base}-${seen}`;

        used.set(base, seen + 1);
        node.properties = { ...node.properties, id };

        if (levels.includes(depth)) {
          headings.push({ id, text, depth });
        }

        return;
      }

      node.children?.forEach(visit);
    };

    visit(tree as HastNode);
  };
