import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface Post extends PostMeta {
  content: string;
}

const parsePost = (slug: string, raw: string): Post => {
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content,
  };
};

export const getPostSlugs = (): string[] => {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => file.replace(/\.mdx?$/, ""));
};

export const getPostBySlug = (slug: string): Post | null => {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);

  if (fs.existsSync(mdxPath)) {
    return parsePost(slug, fs.readFileSync(mdxPath, "utf8"));
  }

  if (fs.existsSync(mdPath)) {
    return parsePost(slug, fs.readFileSync(mdPath, "utf8"));
  }

  return null;
};

export const getAllPosts = (): PostMeta[] =>
  getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .map(({ slug, title, date, description, tags }) => ({
      slug,
      title,
      date,
      description,
      tags,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getRecentPosts = (limit = 5): PostMeta[] =>
  getAllPosts().slice(0, limit);
