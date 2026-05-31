import fs from "node:fs";
import path from "node:path";

export const readMarkdownFile = (filename: string): string => {
  const filePath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filename}`);
  }

  return fs.readFileSync(filePath, "utf8");
};

export const formatDate = (date: string): string => {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};
