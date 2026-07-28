import { type CSSProperties } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Prose } from "@/components/Prose";
import { CodeBlock } from "@/components/CodeBlock";

interface MarkdownContentProps {
  content: string;
  variant?: "resume" | "career";
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

export const MarkdownContent = ({ content, variant }: MarkdownContentProps) => (
  <Prose variant={variant}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  </Prose>
);
