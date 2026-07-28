"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/PostCard";
import type { PostMeta } from "@/lib/posts";
import styles from "./BlogList.module.css";

interface BlogListProps {
  posts: PostMeta[];
}

export const BlogList = ({ posts }: BlogListProps) => {
  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  );
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? posts.filter((p) => p.tags.includes(active))
    : posts;

  return (
    <>
      {tags.length > 0 ? (
        <div className={styles.filters} role="group" aria-label="태그 필터">
          <button
            type="button"
            className={`${styles.chip} ${active === null ? styles.active : ""}`}
            aria-pressed={active === null}
            onClick={() => setActive(null)}
          >
            전체
            <span className={styles.count}>{posts.length}</span>
          </button>
          {tags.map((tag) => {
            const count = posts.filter((p) => p.tags.includes(tag)).length;
            return (
              <button
                key={tag}
                type="button"
                className={`${styles.chip} ${active === tag ? styles.active : ""}`}
                aria-pressed={active === tag}
                onClick={() => setActive(tag)}
              >
                {tag}
                <span className={styles.count}>{count}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div className={styles.list}>
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>해당 태그의 글이 아직 없습니다.</p>
      )}
    </>
  );
};
