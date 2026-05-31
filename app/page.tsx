import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getRecentPosts } from "@/lib/posts";
import styles from "./page.module.css";

export default function Home() {
  const recentPosts = getRecentPosts(5);

  return (
    <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>안동주 · Frankie</h1>
            <p className={styles.heroRole}>Frontend Lead @ Selectstar</p>
            <p className={styles.heroIntro}>
              AI 스타트업에서 프론트엔드·백엔드·CI/CD까지 10여 종의 제품을 개발·런칭했습니다.
              성능 최적화와 수치 기반 개선을 일상으로 만드는 개발자입니다.
            </p>
          </section>

          <section className={styles.section} aria-labelledby="recent-posts">
            <div className={styles.sectionHeader}>
              <h2 id="recent-posts" className={styles.sectionTitle}>
                Recent Posts
              </h2>
              <Link href="/blog" className={styles.sectionLink}>
                View all →
              </Link>
            </div>
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => <PostCard key={post.slug} post={post} />)
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
              <Link href="/work" className={styles.docLink}>
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
