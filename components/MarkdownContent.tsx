import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prose } from "@/components/Prose";

interface MarkdownContentProps {
  content: string;
  variant?: "resume";
}

export const MarkdownContent = ({ content, variant }: MarkdownContentProps) => (
  <Prose variant={variant}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </Prose>
);
