import { isValidElement, type ReactNode } from "react";
import { Mermaid } from "@/components/Mermaid";

// ```mermaid 펜스는 코드가 아니라 다이어그램이므로 따로 분기한다.
const languageOf = (node: ReactNode): string => {
  if (!isValidElement<{ className?: string }>(node)) {
    return "";
  }

  return node.props.className?.match(/language-([\w-]+)/)?.[1] ?? "";
};

const toText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(toText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return toText(node.props.children);
  }

  return "";
};

// Terminal-window chrome around code blocks. Syntax colors come from the global
// `.hljs-*` rules (rehype-highlight) in globals.css; this only draws the window.
export const CodeBlock = ({ children }: { children?: ReactNode }) => {
  if (languageOf(children) === "mermaid") {
    return <Mermaid chart={toText(children).trim()} />;
  }

  return (
    <div className="code-window">
      <span className="code-window__bar" aria-hidden="true">
        <span className="code-window__dot" />
        <span className="code-window__dot" />
        <span className="code-window__dot" />
      </span>
      <pre>{children}</pre>
    </div>
  );
};
