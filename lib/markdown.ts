import fs from "node:fs";
import path from "node:path";

export const readMarkdownFile = (filename: string): string => {
  const filePath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filename}`);
  }

  return fs.readFileSync(filePath, "utf8");
};

// Re-export for existing imports; new client-safe usages should import from "@/lib/format".
export { formatDate } from "./format";
