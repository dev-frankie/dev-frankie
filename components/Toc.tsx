"use client";

import { useEffect, useRef } from "react";
import type { Heading } from "@/lib/headings";
import { findScrollParent, keepInView, useActiveHeading } from "@/lib/scroll-spy";
import styles from "./Toc.module.css";

interface TocProps {
  headings: Heading[];
}

/** sticky 헤더 높이 + 여유. 이 선을 지난 마지막 heading이 현재 위치 */
const ACTIVE_OFFSET = 96;

export const Toc = ({ headings }: TocProps) => {
  const { activeId } = useActiveHeading(headings, { offset: ACTIVE_OFFSET });
  const listRef = useRef<HTMLUListElement>(null);

  // 목차가 길어 자체 스크롤이 생겼을 때, 활성 항목을 목차 안에서만 보이게 옮긴다
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`);
    const container = list ? findScrollParent(list) : null;

    if (item && container) {
      keepInView(container, item);
    }
  }, [activeId]);

  if (headings.length === 0) {
    return null;
  }

  const minDepth = Math.min(...headings.map((heading) => heading.depth));

  return (
    <nav className={styles.toc} aria-label="목차">
      <p className={styles.heading}>On this page</p>
      <ul className={styles.list} ref={listRef}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              data-toc-id={heading.id}
              className={`${styles.link} ${
                activeId === heading.id ? styles.active : ""
              }`}
              style={{
                paddingLeft: `${0.75 + (heading.depth - minDepth) * 0.75}rem`,
              }}
              aria-current={activeId === heading.id ? "true" : undefined}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
