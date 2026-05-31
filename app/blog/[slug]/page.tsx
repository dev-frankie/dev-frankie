import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Prose } from "@/components/Prose";
import { formatDate } from "@/lib/markdown";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import styles from "../../page.module.css";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  getPostSlugs().map((slug) => ({ slug }));

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.description,
  };
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  return (
    <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.backLink}>
            ← Blog
          </Link>
          <header className={styles.postHeader}>
            <time className={styles.postMeta} dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            <h1 className={styles.postTitle}>{post.title}</h1>
            {post.description ? (
              <p className={styles.postDescription}>{post.description}</p>
            ) : null}
            {post.tags.length > 0 ? (
              <ul className={styles.postTags} aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </header>
          <Prose>{content}</Prose>
        </div>
      </main>
  );
}

export const dynamicParams = false;
