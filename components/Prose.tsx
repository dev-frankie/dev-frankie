import type { ReactNode } from "react";
import styles from "./Prose.module.css";

interface ProseProps {
  children: ReactNode;
  variant?: "resume";
}

export const Prose = ({ children, variant }: ProseProps) => (
  <article
    className={
      variant === "resume" ? `${styles.prose} ${styles.resume}` : styles.prose
    }
  >
    {children}
  </article>
);
