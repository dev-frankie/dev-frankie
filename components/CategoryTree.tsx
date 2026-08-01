"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CategoryNode } from "@/lib/posts";
import styles from "./CategoryTree.module.css";

interface CategoryTreeProps {
  tree: CategoryNode[];
  totalCount: number;
}

/** "/blog/frontend/performance/some-post" → ["frontend","performance","some-post"] */
const toSegments = (pathname: string) =>
  pathname.replace(/^\/blog\/?/, "").split("/").filter(Boolean);

const isOnActivePath = (node: CategoryNode, active: string[]) =>
  node.segments.every((segment, index) => active[index] === segment);

const CategoryBranch = ({
  node,
  active,
  depth,
}: {
  node: CategoryNode;
  active: string[];
  depth: number;
}) => {
  const onPath = isOnActivePath(node, active);
  const [open, setOpen] = useState(onPath || depth === 0);
  const isCurrent = active.join("/") === node.path;
  const hasChildren = node.children.length > 0;

  return (
    <li className={styles.item}>
      <div className={styles.row} style={{ paddingLeft: `${depth * 0.75}rem` }}>
        {hasChildren ? (
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-label={`${node.label} 하위 카테고리 ${open ? "접기" : "펼치기"}`}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className={open ? styles.caretOpen : styles.caret}>▸</span>
          </button>
        ) : (
          <span className={styles.togglePlaceholder} />
        )}
        <Link
          href={`/blog/${node.path}`}
          className={`${styles.link} ${isCurrent ? styles.linkActive : ""} ${
            onPath && !isCurrent ? styles.linkOnPath : ""
          }`}
          aria-current={isCurrent ? "page" : undefined}
        >
          <span className={styles.label}>{node.label}</span>
          <span className={styles.count}>{node.count}</span>
        </Link>
      </div>
      {hasChildren && open ? (
        <ul className={styles.list}>
          {node.children.map((child) => (
            <CategoryBranch
              key={child.path}
              node={child}
              active={active}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export const CategoryTree = ({ tree, totalCount }: CategoryTreeProps) => {
  const pathname = usePathname();
  const active = toSegments(pathname);

  return (
    <nav className={styles.nav} aria-label="카테고리">
      <p className={styles.heading}>Category</p>
      <ul className={styles.list}>
        <li className={styles.item}>
          <div className={styles.row}>
            <span className={styles.togglePlaceholder} />
            <Link
              href="/blog"
              className={`${styles.link} ${
                active.length === 0 ? styles.linkActive : ""
              }`}
              aria-current={active.length === 0 ? "page" : undefined}
            >
              <span className={styles.label}>전체 글</span>
              <span className={styles.count}>{totalCount}</span>
            </Link>
          </div>
        </li>
        {tree.map((node) => (
          <CategoryBranch key={node.path} node={node} active={active} depth={0} />
        ))}
      </ul>
    </nav>
  );
};
