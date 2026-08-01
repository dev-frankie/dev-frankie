import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { BlogList } from "@/components/BlogList";
import { CodeBlock } from "@/components/CodeBlock";
import { Prose } from "@/components/Prose";
import { Toc } from "@/components/Toc";
import { type Heading, rehypeHeadingIds } from "@/lib/headings";
import { formatDate } from "@/lib/format";
import {
  type CategoryNode,
  getCategoryTrail,
  getCategoryTree,
  getPostBySegments,
  getPostSlugs,
  getPostsInCategory,
  isCategory,
} from "@/lib/posts";
import styles from "../blog.module.css";

interface BlogSlugPageProps {
  params: Promise<{ slug: string[] }>;
}

const flattenCategories = (nodes: CategoryNode[]): CategoryNode[] =>
  nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);

/** 카테고리 디렉터리와 글 파일이 같은 [...slug] 라우트를 공유한다 */
export const generateStaticParams = () => [
  ...flattenCategories(getCategoryTree()).map((category) => ({
    slug: category.segments,
  })),
  ...getPostSlugs().map((slug) => ({ slug: slug.split("/") })),
];

const findCategory = (segments: string[]): CategoryNode | null =>
  flattenCategories(getCategoryTree()).find(
    (node) => node.path === segments.join("/"),
  ) ?? null;

export const generateMetadata = async ({
  params,
}: BlogSlugPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = getPostBySegments(slug);

  if (post) {
    return { title: post.title, description: post.description };
  }

  const category = findCategory(slug);

  if (category) {
    return {
      title: category.label,
      description: category.description || `${category.label} 카테고리의 글`,
    };
  }

  return { title: "Not found" };
};

const Breadcrumb = ({
  trail,
  current,
}: {
  trail: Array<{ label: string; path: string }>;
  current?: string;
}) => (
  <ol className={styles.breadcrumb}>
    <li>
      <Link href="/blog">Blog</Link>
    </li>
    {trail.map((crumb) => (
      <li key={crumb.path}>
        <span className={styles.breadcrumbSeparator}>/</span>{" "}
        <Link href={`/blog/${crumb.path}`}>{crumb.label}</Link>
      </li>
    ))}
    {current ? (
      <li>
        <span className={styles.breadcrumbSeparator}>/</span> {current}
      </li>
    ) : null}
  </ol>
);

const CategoryView = ({ category }: { category: CategoryNode }) => {
  const posts = getPostsInCategory(category.segments);
  const trail = getCategoryTrail(category.segments);

  return (
    <div className={styles.list}>
      <Breadcrumb trail={trail.slice(0, -1)} current={category.label} />
      <h1 className={styles.pageTitle}>{category.label}</h1>
      <p className={styles.pageDescription}>
        {category.description || `${posts.length}개의 글`}
      </p>
      {category.children.length > 0 ? (
        <ul className={styles.subCategories} aria-label="하위 카테고리">
          {category.children.map((child) => (
            <li key={child.path}>
              <Link href={`/blog/${child.path}`} className={styles.subCategory}>
                {child.label}
                <span className={styles.subCategoryCount}>{child.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {posts.length > 0 ? (
        <BlogList posts={posts} />
      ) : (
        <p className={styles.empty}>아직 이 카테고리에는 글이 없습니다.</p>
      )}
    </div>
  );
};

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;
  const post = getPostBySegments(slug);

  if (!post) {
    const category = isCategory(slug) ? findCategory(slug) : null;

    if (!category) {
      notFound();
    }

    return <CategoryView category={category} />;
  }

  // rehype 플러그인이 heading에 id를 달면서 이 배열을 채운다
  const headings: Heading[] = [];
  const { content } = await compileMDX({
    source: post.content,
    components: { pre: CodeBlock },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        // unified는 attacher(options) 형태로 호출하므로 튜플로 넘긴다
        rehypePlugins: [rehypeHighlight, [rehypeHeadingIds, { headings }]],
      },
    },
  });

  return (
    <div className={styles.postLayout}>
      <div className={styles.article}>
        <Breadcrumb trail={getCategoryTrail(post.category)} />
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
        {headings.length > 0 ? (
          <details className={styles.tocMobile}>
            <summary>목차</summary>
            <Toc headings={headings} />
          </details>
        ) : null}
        <Prose>{content}</Prose>
      </div>
      <div className={styles.tocColumn}>
        <Toc headings={headings} />
      </div>
    </div>
  );
}

export const dynamicParams = false;
