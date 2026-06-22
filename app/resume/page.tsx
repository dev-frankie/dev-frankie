import type { Metadata } from "next";
import { MarkdownContent } from "@/components/MarkdownContent";
import { readMarkdownFile } from "@/lib/markdown";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Resume",
  description: "안동주 이력서",
};

export default function ResumePage() {
  const content = readMarkdownFile("RESUME.md");

  return (
    <main className={styles.main}>
        <div className={styles.containerResume}>
          <MarkdownContent content={content} variant="resume" />
        </div>
      </main>
  );
}
