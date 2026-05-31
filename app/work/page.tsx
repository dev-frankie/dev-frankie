import type { Metadata } from "next";
import { MarkdownContent } from "@/components/MarkdownContent";
import { readMarkdownFile } from "@/lib/markdown";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Work Experience",
  description: "안동주 경력기술서",
};

export default function WorkPage() {
  const content = readMarkdownFile("WorkExperience.md");

  return (
    <main className={styles.main}>
        <div className={styles.containerWide}>
          <h1 className={styles.pageTitle}>Work Experience</h1>
          <p className={styles.pageDescription}>경력기술서</p>
          <MarkdownContent content={content} />
        </div>
      </main>
  );
}
