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

export interface HastNode {
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
    // 문자, 숫자, 공백, 하이픈만 남긴다 (한글 포함)
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "section";
};

export const toText = (node: HastNode): string => {
  if (node.type === "text") {
    return node.value ?? "";
  }

  return (node.children ?? []).map(toText).join("");
};

const isHeading = (node: HastNode): node is HastNode & { tagName: string } =>
  node.type === "element" && /^h[1-6]$/.test(node.tagName ?? "");

/** slug를 받아 문서 안에서 겹치지 않는 id를 내준다 */
export interface HeadingIdRegistry {
  claim: (slug: string) => string;
}

/**
 * 한 문서를 여러 조각으로 나눠 렌더할 때는 조각들이 이 발급기 하나를 공유해야
 * 문서 전체에서 id가 겹치지 않는다. reserved에는 마크다운 밖에서 이미 쓰는 id를 넣는다.
 */
export const createHeadingIdRegistry = (
  reserved: Iterable<string> = [],
): HeadingIdRegistry => {
  const taken = new Set(reserved);
  const seen = new Map<string, number>();

  return {
    claim: (slug) => {
      let count = seen.get(slug) ?? 0;
      let id = count === 0 ? slug : `${slug}-${count}`;

      // "a", "a", "a 1"처럼 붙인 번호가 다른 heading의 slug와 겹치는 경우도 피한다
      while (taken.has(id)) {
        count += 1;
        id = `${slug}-${count}`;
      }

      seen.set(slug, count + 1);
      taken.add(id);

      return id;
    },
  };
};

interface Options {
  /** 순회하며 채워지는 배열. 컴파일 후 TOC로 사용한다 */
  headings: Heading[];
  /** TOC에 담을 heading 레벨 */
  levels?: number[];
  /** 여러 트리가 id를 나눠 쓸 때 넘긴다. 없으면 트리마다 새로 만든다 */
  registry?: HeadingIdRegistry;
}

export const rehypeHeadingIds =
  ({ headings, levels = [2, 3, 4], registry }: Options) =>
  (tree: unknown) => {
    const ids = registry ?? createHeadingIdRegistry();

    const visit = (node: HastNode) => {
      if (isHeading(node)) {
        const depth = Number(node.tagName[1]);
        const text = toText(node).trim();
        const id = ids.claim(slugify(text));

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

/**
 * 개요 번호. "1." 처럼 끝에 점이 있거나 "2.1.3" 처럼 점으로 이어진 숫자만 번호로 본다.
 * ("2024 회고" 같은 연도는 번호가 아니다)
 */
const OUTLINE_NUMBER = /^(\d+(?:\.\d+)+\.?|\d+\.)(\s+)/;

/** "2.1.3 제목" 을 번호와 제목으로 나눈다. 번호 끝의 점은 뗀다 */
export const splitHeadingNumber = (
  text: string,
): { number: string | null; title: string } => {
  const match = OUTLINE_NUMBER.exec(text);

  if (!match || match[0].length === text.length) {
    return { number: null, title: text };
  }

  return {
    number: match[1].replace(/\.$/, ""),
    title: text.slice(match[0].length),
  };
};

/**
 * heading 맨 앞의 개요 번호를 <span data-heading-number>로 감싸 CSS가 따로 그리게 한다.
 * 글자는 그대로 두므로 heading id와 목차 텍스트는 바뀌지 않는다.
 */
export const rehypeHeadingNumbers = () => (tree: unknown) => {
  const visit = (node: HastNode) => {
    if (isHeading(node)) {
      const [first, ...rest] = node.children ?? [];
      const match =
        first?.type === "text" ? OUTLINE_NUMBER.exec(first.value ?? "") : null;

      if (first && match) {
        node.children = [
          {
            type: "element",
            tagName: "span",
            properties: { dataHeadingNumber: "" },
            children: [{ type: "text", value: match[1] }],
          },
          { type: "text", value: (first.value ?? "").slice(match[1].length) },
          ...rest,
        ];
      }

      return;
    }

    node.children?.forEach(visit);
  };

  visit(tree as HastNode);
};
