import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Frankie의 기술 블로그",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Blog</h1>
          <p className={styles.pageDescription}>
            프론트엔드, 성능, DX, 프로젝트 회고를 기록합니다.
          </p>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          ) : (
            <p className={styles.empty}>아직 작성된 글이 없습니다.</p>
          )}
        </div>
      </main>
  );
}
