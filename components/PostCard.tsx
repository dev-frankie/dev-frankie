import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: PostMeta;
}

export const PostCard = ({ post }: PostCardProps) => (
  <article className={styles.item}>
    <div className={styles.meta}>
      <time className={styles.date} dateTime={post.date}>
        {formatDate(post.date)}
      </time>
      {post.categoryLabels.length > 0 ? (
        <>
          <span className={styles.sep}>/</span>
          <Link
            href={`/blog/${post.category.join("/")}`}
            className={styles.category}
          >
            {post.categoryLabels.join(" · ")}
          </Link>
        </>
      ) : null}
    </div>
    <h2 className={styles.title}>
      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
    </h2>
    {post.description ? (
      <p className={styles.desc}>{post.description}</p>
    ) : null}
  </article>
);
