import type { Metadata } from "next";
import { MarkdownContent } from "@/components/MarkdownContent";
import { readMarkdownFile } from "@/lib/markdown";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Career",
  description: "안동주 경력기술서",
};

export default function CareerPage() {
  const content = readMarkdownFile("WORKEXPERIENCE.md");

  return (
    <main className={styles.main}>
        <div className={styles.containerWide}>
          <h1 className={styles.pageTitle}>Career</h1>
          <p className={styles.pageDescription}>경력기술서</p>
          <MarkdownContent content={content} variant="career" />
        </div>
      </main>
  );
}
