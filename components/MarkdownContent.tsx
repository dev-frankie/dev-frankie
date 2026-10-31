import { type CSSProperties, type ReactElement } from "react";
import ReactMarkdown, { type Components, type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Prose } from "@/components/Prose";
import { CodeBlock } from "@/components/CodeBlock";
import {
  type Heading,
  type HeadingIdRegistry,
  rehypeHeadingIds,
  rehypeHeadingNumbers,
} from "@/lib/headings";
import { rehypeBlockRoles } from "@/lib/rehype-blocks";

type Variant = "resume" | "career";
type PluggableList = NonNullable<Options["rehypePlugins"]>;

interface MarkdownContentProps {
  content: string;
  variant?: Variant;
}

// Demo media live at repo-root ./assets for the static docs:build pipeline,
// but Next.js only serves /public. Rewrite ./assets/* -> /assets/* at render time
// so the same markdown works in both the static HTML build and the Next route.
const components: Components = {
  img: ({ node, src, alt, style, ...rest }) => {
    void node; // exclude react-markdown's hast node from DOM props
    const resolved =
      typeof src === "string" && src.startsWith("./assets/")
        ? src.replace(/^\.\/assets\//, "/assets/")
        : src;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...rest}
        src={resolved}
        alt={alt ?? ""}
        style={{ maxWidth: "100%", height: "auto", ...(style as CSSProperties) }}
      />
    );
  },
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
};

const remarkPlugins: PluggableList = [remarkGfm];

// 경력기술서는 개요 번호와 문제/과정/성과 라벨을 따로 그린다. resume 렌더는 그대로 둔다
const variantPlugins: Record<Variant, PluggableList> = {
  resume: [],
  career: [rehypeHeadingNumbers, rehypeBlockRoles],
};

const rehypePluginsFor = (
  variant: Variant | undefined,
  extra: PluggableList = [],
): PluggableList => [
  rehypeRaw,
  ...extra,
  ...(variant ? variantPlugins[variant] : []),
  rehypeHighlight,
];

export const MarkdownContent = ({ content, variant }: MarkdownContentProps) => (
  <Prose variant={variant}>
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePluginsFor(variant)}
      components={components}
    >
      {content}
    </ReactMarkdown>
  </Prose>
);

interface HeadingIdOptions {
  variant?: Variant;
  /** 같은 문서의 다른 조각과 공유하는 id 발급기 */
  registry: HeadingIdRegistry;
  /** 목록에 담을 heading 레벨 (기본 h2~h4) */
  levels?: number[];
}

/**
 * MarkdownContent에 heading id를 opt-in으로 붙인 버전. 본문과 함께, 같은 변환에서 모은
 * heading 목록을 돌려준다. 목차를 따로 계산하면 id가 본문과 어긋날 수 있어서다.
 *
 * 목록이 렌더 시점에 바로 필요하므로 JSX로 미루지 않고 react-markdown의 동기 렌더
 * 함수(훅이 없는 순수 함수)를 직접 호출한다.
 */
export const renderMarkdownWithHeadings = (
  content: string,
  { variant, registry, levels }: HeadingIdOptions,
): { body: ReactElement; headings: Heading[] } => {
  const headings: Heading[] = [];
  const markdown = ReactMarkdown({
    children: content,
    remarkPlugins,
    rehypePlugins: rehypePluginsFor(variant, [
      [rehypeHeadingIds, { headings, registry, levels }],
    ]),
    components,
  });

  return { body: <Prose variant={variant}>{markdown}</Prose>, headings };
};
