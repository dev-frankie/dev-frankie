import Link from "next/link";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/work", label: "Work" },
] as const;

export const Header = () => (
  <header className={styles.header}>
    <Link href="/" className={styles.brand}>
      dev-frankie
    </Link>
    <nav className={styles.nav} aria-label="Main">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link key={href} href={href} className={styles.navLink}>
          {label}
        </Link>
      ))}
      <a
        href="https://github.com/dev-frankie"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.navLink}
      >
        GitHub
      </a>
    </nav>
  </header>
);
