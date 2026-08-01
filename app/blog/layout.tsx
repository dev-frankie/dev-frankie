import type { ReactNode } from "react";
import { CategoryTree } from "@/components/CategoryTree";
import { getAllPosts, getCategoryTree } from "@/lib/posts";
import styles from "./blog.module.css";

export default function BlogLayout({ children }: { children: ReactNode }) {
  const tree = getCategoryTree();
  const totalCount = getAllPosts().length;

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <CategoryTree tree={tree} totalCount={totalCount} />
      </aside>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
