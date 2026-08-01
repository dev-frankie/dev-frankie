"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/headings";
import styles from "./Toc.module.css";

interface TocProps {
  headings: Heading[];
}

/** sticky 헤더 높이 + 여유 — 이 선을 지난 마지막 heading이 현재 위치 */
const ACTIVE_OFFSET = 96;

export const Toc = ({ headings }: TocProps) => {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    let frame = 0;

    const sync = () => {
      frame = 0;

      const current = headings.reduce((found, heading) => {
        const top = document
          .getElementById(heading.id)
          ?.getBoundingClientRect().top;

        return top !== undefined && top <= ACTIVE_OFFSET ? heading.id : found;
      }, headings[0].id);

      // 문서 끝에 닿으면 마지막 항목을 활성으로 — 짧은 마지막 절이 묻히는 문제 방지
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 4;

      setActiveId(atBottom ? headings[headings.length - 1].id : current);
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(sync);
      }
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  // 목차가 길어 자체 스크롤이 생겼을 때, 활성 항목을 목차 안에서만 보이게 옮긴다
  // (scrollIntoView는 페이지까지 스크롤시키므로 컨테이너 scrollTop을 직접 조정)
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`);

    if (!list || !item) {
      return;
    }

    const container = list.parentElement;

    if (!container || container.scrollHeight <= container.clientHeight) {
      return;
    }

    const itemTop = item.offsetTop - container.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    const margin = 48;

    if (itemTop < container.scrollTop + margin) {
      container.scrollTop = Math.max(0, itemTop - margin);
    } else if (itemBottom > container.scrollTop + container.clientHeight - margin) {
      container.scrollTop = itemBottom - container.clientHeight + margin;
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
