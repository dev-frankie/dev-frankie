"use client";

import { useEffect, useId, useState } from "react";
import styles from "./Mermaid.module.css";

interface MermaidProps {
  chart: string;
}

// mermaid는 번들이 크고 DOM에 의존하므로, 다이어그램이 있는 글에서만
// 클라이언트에서 동적으로 불러온다.
export const Mermaid = ({ chart }: MermaidProps) => {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        const isDark =
          document.documentElement.getAttribute("data-theme") === "dark";

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: isDark ? "dark" : "default",
          fontFamily: "inherit",
        });

        const { svg: rendered } = await mermaid.render(`mmd-${reactId}`, chart);

        if (!cancelled) {
          setSvg(rendered);
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    };

    render();

    // 테마 토글에 맞춰 다시 그린다
    const observer = new MutationObserver(render);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chart, reactId]);

  // 문법 오류거나 아직 로드 전이면 원본을 그대로 보여준다
  if (failed || !svg) {
    return (
      <pre className={failed ? styles.failed : styles.pending}>{chart}</pre>
    );
  }

  return (
    <figure
      className={styles.chart}
      role="img"
      aria-label="다이어그램"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
