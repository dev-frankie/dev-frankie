import type { ReactNode } from "react";
import styles from "./Prose.module.css";

interface ProseProps {
  children: ReactNode;
}

export const Prose = ({ children }: ProseProps) => (
  <article className={styles.prose}>{children}</article>
);
