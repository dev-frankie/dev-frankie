import { type HastNode, toText } from "@/lib/headings";

const isBlank = (node: HastNode) =>
  node.type === "text" && (node.value ?? "").trim() === "";

const isElement = (node: HastNode, tagName: string) =>
  node.type === "element" && node.tagName === tagName;

/** 한 단어 라벨. 뒤에 괄호 설명이 붙을 수 있다 ("과정 (기여도: ...)") */
const LABEL = /^([^\s()]+)\s*(\(.+\))?$/u;

const markLabel = (paragraph: HastNode, strong: HastNode) => {
  const match = LABEL.exec(toText(strong).trim());

  if (!match) {
    paragraph.properties = { ...paragraph.properties, dataBlock: "subheading" };
    return;
  }

  paragraph.properties = { ...paragraph.properties, dataBlock: "label" };

  const [, label, note] = match;
  const plain =
    strong.children?.length === 1 && strong.children[0].type === "text";

  // 괄호 설명은 라벨 밖으로 떼어 작게 보여 준다. 서식이 섞인 라벨은 그대로 둔다
  if (note && plain) {
    strong.children = [{ type: "text", value: label }];
    paragraph.children = [
      strong,
      { type: "text", value: " " },
      {
        type: "element",
        tagName: "span",
        properties: { dataLabelNote: "" },
        children: [{ type: "text", value: note }],
      },
    ];
  }
};

/**
 * 최상위 단락에 역할(data-block)을 붙여 경력기술서 CSS가 본문과 다르게 그리게 한다.
 *
 * - label: 굵은 글씨 한 단어뿐인 단락 (**문제**, **과정**, **성과**)
 * - subheading: 굵은 글씨 여러 단어뿐인 단락 (사례 안의 기능 묶음 제목)
 * - media: 이미지만 있는 단락 (GIF 여러 장을 한 줄에 배치)
 *
 * 인용문이나 목록 안의 단락은 카드 제목이나 항목이라 건드리지 않는다.
 */
export const rehypeBlockRoles = () => (tree: unknown) => {
  for (const node of (tree as HastNode).children ?? []) {
    if (!isElement(node, "p")) {
      continue;
    }

    const content = (node.children ?? []).filter((child) => !isBlank(child));

    if (content.length === 1 && isElement(content[0], "strong")) {
      markLabel(node, content[0]);
    } else if (
      content.length > 0 &&
      content.every((child) => isElement(child, "img"))
    ) {
      node.properties = { ...node.properties, dataBlock: "media" };
    }
  }
};
