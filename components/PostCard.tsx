import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/markdown";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: PostMeta;
}

export const PostCard = ({ post }: PostCardProps) => (
  <article className={styles.card}>
    <time className={styles.date} dateTime={post.date}>
      {formatDate(post.date)}
    </time>
    <h2 className={styles.title}>
      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
    </h2>
    {post.description ? (
      <p className={styles.description}>{post.description}</p>
    ) : null}
    {post.tags.length > 0 ? (
      <ul className={styles.tags} aria-label="Tags">
        {post.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    ) : null}
  </article>
);
