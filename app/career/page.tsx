import type { Metadata } from "next";
import {
  CAREER_HIGHLIGHTS_HEADING,
  CareerHighlights,
} from "@/components/CareerHighlights";
import { renderMarkdownWithHeadings } from "@/components/MarkdownContent";
import { SectionNavLayout } from "@/components/SectionNavLayout";
import { createHeadingIdRegistry } from "@/lib/headings";
import { readMarkdownFile } from "@/lib/markdown";
import styles from "./career.module.css";

// 인포그래픽은 Profile 바로 뒤, SKILLS 앞에 끼워 넣는다
const HIGHLIGHTS_ANCHOR = "\n### 1.2.";

export const metadata: Metadata = {
  title: "Career",
  description: "안동주 경력기술서",
};

export default function CareerPage() {
  const content = readMarkdownFile("WORKEXPERIENCE.md");
  const splitAt = content.indexOf(HIGHLIGHTS_ANCHOR);
  const introSource = splitAt === -1 ? "" : content.slice(0, splitAt);
  const restSource = splitAt === -1 ? content : content.slice(splitAt);

  // 두 조각이 id 발급기 하나를 나눠 써야 문서 전체에서 id가 겹치지 않는다.
  // 인포그래픽 제목의 id는 마크다운 밖에 있으므로 미리 잡아 둔다
  const registry = createHeadingIdRegistry([CAREER_HIGHLIGHTS_HEADING.id]);
  const intro = introSource
    ? renderMarkdownWithHeadings(introSource, { variant: "career", registry })
    : null;
  const rest = renderMarkdownWithHeadings(restSource, {
    variant: "career",
    registry,
  });

  // 목차는 본문을 렌더한 같은 변환에서 모은 heading으로 만든다 (id가 항상 일치)
  const headings = [
    ...(intro?.headings ?? []),
    CAREER_HIGHLIGHTS_HEADING,
    ...rest.headings,
  ];

  return (
    <main className={styles.main} data-print-compact>
      <SectionNavLayout headings={headings} label="경력기술서 목차">
        <h1 className={styles.pageTitle}>Career</h1>
        <p className={styles.pageDescription}>경력기술서</p>
        {intro?.body}
        <CareerHighlights />
        {rest.body}
      </SectionNavLayout>
    </main>
  );
}
