import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { SocialLinks } from "@/components/SocialLinks";
import { getRecentPosts } from "@/lib/posts";
import styles from "./page.module.css";

const hasAvatar = fs.existsSync(path.join(process.cwd(), "public", "avatar.jpg"));

export default function Home() {
  const recentPosts = getRecentPosts(5);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.hero}>
          {hasAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/avatar.jpg" alt="안동주" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatar} aria-hidden="true">
              안
            </div>
          )}
          <div className={styles.heroText}>
            <div className={styles.heroNameRow}>
              <h1 className={styles.heroTitle}>안동주 · Frankie</h1>
              <SocialLinks />
            </div>
            <p className={styles.heroIntro}>
              Selectstar 프론트엔드 리드 · 성능을 측정하고 수치로 개선을 증명하는
              개발자입니다.
            </p>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section} aria-labelledby="recent-posts">
          <div className={styles.sectionHeader}>
            <h2 id="recent-posts" className={styles.sectionTitle}>
              Posts
            </h2>
            <Link href="/blog" className={styles.sectionLink}>
              View all →
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className={styles.postList}>
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>아직 작성된 글이 없습니다.</p>
          )}
        </section>

        <section className={styles.section} aria-labelledby="documents">
          <h2 id="documents" className={styles.sectionTitle}>
            Documents
          </h2>
          <div className={styles.docLinks}>
            <Link href="/resume" className={styles.docLink}>
              이력서
            </Link>
            <Link href="/career" className={styles.docLink}>
              경력기술서
            </Link>
            <a
              href="https://github.com/dev-frankie"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docLink}
            >
              GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
