import { useCallback, useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/headings";

/** offset을 넘기지 않으면 heading의 scroll-margin-top에서 이만큼 아래까지를 현재 위치로 본다 */
const SLACK = 24;
/** 스크롤 이벤트가 이만큼 끊기면 클릭으로 시작한 스무스 스크롤이 끝난 것으로 본다 */
const SETTLE_MS = 160;

interface Options {
  /** 뷰포트 위에서 이 선(px)을 지난 마지막 heading이 현재 위치 */
  offset?: number;
}

/**
 * 스크롤 위치에 맞는 현재 heading(scroll spy).
 *
 * offset이 없으면 활성 기준선을 heading의 scroll-margin-top에서 읽는다. 앵커로 이동한
 * heading이 멈추는 자리와 기준선이 같은 CSS 값에서 나오므로, 화면 폭에 따라 고정
 * 헤더 높이가 달라져도 따로 맞출 필요가 없다.
 *
 * pin(id)는 목차 클릭 직후 스무스 스크롤이 지나가는 동안 중간 절들이 차례로 활성화되며
 * 목차가 깜빡이는 것을 막는다. 스크롤이 멈춘 뒤 사용자가 다시 스크롤하면 풀린다.
 */
export const useActiveHeading = (
  headings: readonly Heading[],
  { offset }: Options = {},
) => {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const pinned = useRef<{ id: string; settled: boolean } | null>(null);
  const settleTimer = useRef(0);

  const waitForSettle = useCallback(() => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      if (pinned.current) {
        pinned.current.settled = true;
      }
    }, SETTLE_MS);
  }, []);

  const pin = useCallback(
    (id: string) => {
      pinned.current = { id, settled: false };
      setActiveId(id);
      waitForSettle();
    },
    [waitForSettle],
  );

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    let frame = 0;

    const activationLine = () => {
      if (offset !== undefined) {
        return offset;
      }

      const first = document.getElementById(headings[0].id);
      const margin = first
        ? Number.parseFloat(getComputedStyle(first).scrollMarginTop) || 0
        : 0;

      return margin + SLACK;
    };

    const sync = () => {
      frame = 0;

      const line = activationLine();
      const current = headings.reduce((found, heading) => {
        const top = document
          .getElementById(heading.id)
          ?.getBoundingClientRect().top;

        return top !== undefined && top <= line ? heading.id : found;
      }, headings[0].id);

      // 문서 끝에 닿으면 마지막 항목을 활성으로 (짧은 마지막 절이 묻히는 문제 방지)
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 4;

      setActiveId(atBottom ? headings[headings.length - 1].id : current);
    };

    const onScroll = () => {
      const target = pinned.current;

      if (target && !target.settled) {
        waitForSettle();
        return;
      }

      pinned.current = null;

      if (frame === 0) {
        frame = window.requestAnimationFrame(sync);
      }
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings, offset, waitForSettle]);

  return { activeId, pin };
};

/** 가장 가까운 스크롤 컨테이너. 문서 자체(html, body)는 제외한다 */
export const findScrollParent = (element: HTMLElement): HTMLElement | null => {
  for (
    let node = element.parentElement;
    node && node !== document.body && node !== document.documentElement;
    node = node.parentElement
  ) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) {
      return node;
    }
  }

  return null;
};

/**
 * 목록이 길어 자체 스크롤이 생겼을 때 item이 container 안에서 보이도록 옮긴다.
 * scrollIntoView는 페이지까지 스크롤시키므로 container의 scrollTop만 조정한다.
 */
export const keepInView = (
  container: HTMLElement,
  item: HTMLElement,
  margin = 48,
) => {
  if (container.scrollHeight <= container.clientHeight) {
    return;
  }

  const itemTop =
    item.getBoundingClientRect().top -
    container.getBoundingClientRect().top -
    container.clientTop +
    container.scrollTop;
  const itemBottom = itemTop + item.offsetHeight;

  if (itemTop < container.scrollTop + margin) {
    container.scrollTop = Math.max(0, itemTop - margin);
  } else if (
    itemBottom >
    container.scrollTop + container.clientHeight - margin
  ) {
    container.scrollTop = itemBottom - container.clientHeight + margin;
  }
};
