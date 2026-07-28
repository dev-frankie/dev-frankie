import type { ReactNode } from "react";

// Terminal-window chrome around code blocks. Syntax colors come from the global
// `.hljs-*` rules (rehype-highlight) in globals.css; this only draws the window.
export const CodeBlock = ({ children }: { children?: ReactNode }) => (
  <div className="code-window">
    <span className="code-window__bar" aria-hidden="true">
      <span className="code-window__dot" />
      <span className="code-window__dot" />
      <span className="code-window__dot" />
    </span>
    <pre>{children}</pre>
  </div>
);
