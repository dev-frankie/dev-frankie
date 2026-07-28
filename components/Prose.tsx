import type { ReactNode } from "react";
import styles from "./Prose.module.css";

interface ProseProps {
  children: ReactNode;
  variant?: "resume" | "career";
}

export const Prose = ({ children, variant }: ProseProps) => {
  const className = variant
    ? `${styles.prose} ${styles[variant]}`
    : styles.prose;

  return <article className={className}>{children}</article>;
};
