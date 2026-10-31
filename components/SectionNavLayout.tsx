"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type Heading, splitHeadingNumber } from "@/lib/headings";
import { keepInView, useActiveHeading } from "@/lib/scroll-spy";
// 블로그 좌측 카테고리 사이드바와 같은 모양이 되도록 트리 스타일을 그대로 가져다 쓴다
import tree from "./CategoryTree.module.css";
import styles from "./SectionNavLayout.module.css";

interface Section {
  id: string;
  depth: number;
  number: string | null;
  title: string;
  parent: Section | null;
  children: Section[];
}

/**
 * 이 깊이(h3)부터 트리 항목이다. 더 얕은 h2는 묶음 머리글로 늘 보이고,
 * h3 아래 항목(h4)은 현재 위치가 속한 h3에서만 펼친다.
 */
const COLLAPSE_FROM_DEPTH = 3;

const buildSections = (headings: readonly Heading[]) => {
  const roots: Section[] = [];
  const byId = new Map<string, Section>();
  const stack: Section[] = [];

  for (const heading of headings) {
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1] ?? null;
    const section: Section = {
      id: heading.id,
      depth: heading.depth,
      ...splitHeadingNumber(heading.text),
      parent,
      children: [],
    };

    (parent ? parent.children : roots).push(section);
    byId.set(section.id, section);
    stack.push(section);
  }

  return { roots, byId };
};

const classNames = (...names: Array<string | false | undefined>) =>
  names.filter(Boolean).join(" ");

// 블로그 트리의 ▸ 캐럿과 같은 크기의 삼각형. 글자 대신 SVG로 그린다
const Caret = ({ open }: { open: boolean }) => (
  <span className={open ? tree.caretOpen : tree.caret} aria-hidden="true">
    <svg className={styles.caretIcon} viewBox="0 0 10 10" focusable="false">
      <path d="M3.25 1.75 7.25 5l-4 3.25z" fill="currentColor" />
    </svg>
  </span>
);

interface SectionTreeProps {
  roots: Section[];
  activeId: string;
  activePath: ReadonlySet<string>;
  /** 현재 위치가 속한 묶음. 바뀌면 손으로 펼치거나 접은 상태를 버린다 */
  groupId: string;
  onNavigate: (id: string) => void;
}

const SectionTree = ({
  roots,
  activeId,
  activePath,
  groupId,
  onNavigate,
}: SectionTreeProps) => {
  const [manual, setManual] = useState<{
    groupId: string;
    open: Record<string, boolean>;
  }>({ groupId, open: {} });
  const overrides = manual.groupId === groupId ? manual.open : {};

  const linkState = (section: Section) => {
    const isCurrent = section.id === activeId;

    return { isCurrent, onPath: !isCurrent && activePath.has(section.id) };
  };

  const linkProps = (section: Section) => ({
    href: `#${section.id}`,
    "aria-current": section.id === activeId ? ("location" as const) : undefined,
    onClick: () => onNavigate(section.id),
  });

  const renderRow = (section: Section): ReactNode => {
    const hasChildren = section.children.length > 0;
    const open =
      hasChildren && (overrides[section.id] ?? activePath.has(section.id));
    const { isCurrent, onPath } = linkState(section);
    // 더 깊은 항목은 부모 항목이 번호를 보여 주므로 제목만 쓴다 (좁은 폭에서 제목 자리 확보)
    const number = section.depth <= COLLAPSE_FROM_DEPTH ? section.number : null;

    return (
      <li key={section.id} className={tree.item}>
        <div className={classNames(tree.row, styles.row)}>
          {hasChildren ? (
            <button
              type="button"
              className={classNames(tree.toggle, styles.toggle)}
              aria-expanded={open}
              aria-label={`${section.title} 하위 목차 ${open ? "접기" : "펼치기"}`}
              onClick={() =>
                setManual({
                  groupId,
                  open: { ...overrides, [section.id]: !open },
                })
              }
            >
              <Caret open={open} />
            </button>
          ) : (
            <span className={classNames(tree.togglePlaceholder, styles.toggle)} />
          )}
          <a
            {...linkProps(section)}
            className={classNames(
              tree.link,
              styles.link,
              isCurrent && tree.linkActive,
              onPath && tree.linkOnPath,
            )}
          >
            <span className={classNames(tree.label, styles.label)}>
              {number ? <span className={styles.number}>{number}</span> : null}
              <span className={styles.title}>{section.title}</span>
            </span>
          </a>
        </div>
        {open ? (
          <ul className={tree.list}>{section.children.map(renderRow)}</ul>
        ) : null}
      </li>
    );
  };

  // 큰 묶음(h2)은 블로그 사이드바의 머리글 자리에 작은 대문자로 두고,
  // 그 아래 항목(h3)부터 트리로 그린다. 들여쓰기가 한 단계 줄어 제목이 덜 잘린다
  return (
    <ul className={styles.groups}>
      {roots.map((section) => {
        if (section.depth >= COLLAPSE_FROM_DEPTH) {
          return (
            <li key={section.id} className={styles.group}>
              <ul className={tree.list}>{renderRow(section)}</ul>
            </li>
          );
        }

        const { isCurrent, onPath } = linkState(section);

        return (
          <li key={section.id} className={styles.group}>
            <a
              {...linkProps(section)}
              className={classNames(
                styles.groupLink,
                isCurrent && styles.groupLinkActive,
                onPath && styles.groupLinkOnPath,
              )}
            >
              {section.number ? (
                <span className={styles.number}>{section.number}</span>
              ) : null}
              <span>{section.title}</span>
            </a>
            {section.children.length > 0 ? (
              <ul className={tree.list}>{section.children.map(renderRow)}</ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

interface SectionNavLayoutProps {
  headings: Heading[];
  /** 목차 nav의 aria-label */
  label: string;
  children: ReactNode;
}

/**
 * 블로그 셸과 같은 2단 레이아웃. 왼쪽에 문서 목차(h2, h3와 현재 h3의 h4)를 붙여 두고
 * 스크롤 위치를 따라 현재 절을 표시한다. 좁은 화면에서는 본문 폭을 지키기 위해
 * 목차를 상단에 붙는 접이식 상자로 바꾼다.
 */
export const SectionNavLayout = ({
  headings,
  label,
  children,
}: SectionNavLayoutProps) => {
  const { roots, byId } = useMemo(() => buildSections(headings), [headings]);
  const { activeId, pin } = useActiveHeading(headings);
  const rootRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const active = byId.get(activeId);
  const activePath = useMemo(() => {
    const path = new Set<string>();

    for (let section = active; section; section = section.parent ?? undefined) {
      path.add(section.id);
    }

    return path;
  }, [active]);

  let group = active;

  while (group?.parent && group.depth > COLLAPSE_FROM_DEPTH) {
    group = group.parent;
  }

  const groupId = group?.id ?? "";

  // 사이트 헤더 높이를 CSS 변수로 넘긴다. 좁은 화면에서 목차 상자가 헤더 바로 아래에
  // 붙고, 앵커로 이동한 heading이 그 상자에 가리지 않게 하는 데 쓴다
  useEffect(() => {
    const root = rootRef.current;
    const header = document.querySelector<HTMLElement>("body > header");

    if (!root || !header) {
      return;
    }

    const update = () =>
      root.style.setProperty("--site-header-height", `${header.offsetHeight}px`);

    update();

    const observer = new ResizeObserver(update);

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  // 사이드바가 길어 자체 스크롤이 생기면 현재 항목을 사이드바 안에서 보이게 한다
  useEffect(() => {
    const sidebar = sidebarRef.current;
    const current = sidebar?.querySelector<HTMLElement>('[aria-current="location"]');

    if (sidebar && current) {
      keepInView(sidebar, current);
    }
  }, [activeId]);

  // 펼친 모바일 목차는 바깥을 누르면 닫는다
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const menu = menuRef.current;

      if (menu && !menu.contains(event.target as Node)) {
        menu.open = false;
      }
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  };

  const navigate = (id: string) => {
    pin(id);
    closeMenu();
  };

  const onMenuToggle = () => {
    const open = menuRef.current?.open ?? false;

    setMenuOpen(open);

    if (open) {
      // 펼치면 현재 항목이 보이는 위치로 목록을 옮겨 둔다
      window.requestAnimationFrame(() => {
        const panel = menuPanelRef.current;
        const current = panel?.querySelector<HTMLElement>('[aria-current="location"]');

        if (panel && current) {
          keepInView(panel, current);
        }
      });
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDetailsElement>) => {
    if (event.key === "Escape" && menuRef.current?.open) {
      closeMenu();
      menuRef.current.querySelector("summary")?.focus();
    }
  };

  const treeProps = { roots, activeId, activePath, groupId, onNavigate: navigate };

  return (
    <div ref={rootRef} className={styles.shell}>
      <aside ref={sidebarRef} className={styles.sidebar}>
        <nav className={classNames(tree.nav, styles.nav)} aria-label={label}>
          <SectionTree {...treeProps} />
        </nav>
      </aside>

      <details
        ref={menuRef}
        className={styles.menu}
        onToggle={onMenuToggle}
        onKeyDown={onMenuKeyDown}
      >
        <summary className={styles.menuSummary}>
          <span className={styles.menuLabel}>목차</span>
          <span className={styles.menuCurrent}>
            {active?.number ? (
              <span className={styles.number}>{active.number}</span>
            ) : null}
            {active?.title}
          </span>
          <svg
            className={styles.chevron}
            viewBox="0 0 12 12"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M2.5 4.5 6 8l3.5-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <div ref={menuPanelRef} className={styles.menuPanel}>
          <nav className={classNames(tree.nav, styles.nav)} aria-label={label}>
            <SectionTree {...treeProps} />
          </nav>
        </div>
      </details>

      <div className={styles.content}>
        <div className={styles.document}>{children}</div>
      </div>
    </div>
  );
};
