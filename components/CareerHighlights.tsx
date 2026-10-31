import type { Heading } from "@/lib/headings";
import styles from "./CareerHighlights.module.css";

/** 목차에 같은 절로 넣을 수 있게 제목과 id를 내보낸다 */
export const CAREER_HIGHLIGHTS_HEADING: Heading = {
  id: "career-highlights",
  text: "핵심 성과 한눈에 보기",
  depth: 3,
};

interface Reduction {
  label: string;
  note: string;
  before: string;
  after: string;
  // 개선 후 값 / 개선 전 값. 막대 길이를 같은 축척으로 그린다.
  ratio: number;
  delta: string;
}

interface Counter {
  label: string;
  /** 시작 값이 기록으로 남아 있을 때만 적는다 */
  from?: string;
  value: string;
  unit: string;
  note: string;
}

const REDUCTIONS: Reduction[] = [
  { label: "랜딩 LCP", note: "리다이렉트를 Proxy로 이동, 랩 측정", before: "3.2s", after: "2.0s", ratio: 2.0 / 3.2, delta: "−38%" },
  { label: "God Component 5종", note: "코드 줄 수", before: "6,509줄", after: "1,745줄", ratio: 1745 / 6509, delta: "−73%" },
  { label: "전역 상태", note: "Recoil에서 Zustand로", before: "atom 429개", after: "스토어 26개", ratio: 26 / 429, delta: "−94%" },
  { label: "클라이언트 번들", note: "gzip 압축 후, 파트 공동 과제", before: "100%", after: "85.6%", ratio: 0.856, delta: "−14.4%" },
  { label: "Red Teaming 태스크 화면 First Load JS", note: "barrel 재수출 제거로 44개 라우트에서 111KB 감소 (gzip)", before: "947KB", after: "836KB", ratio: 836 / 947, delta: "−11.7%" },
];

const COUNTERS: Counter[] = [
  { label: "테스트", from: "0", value: "약 4,100", unit: "케이스", note: "524파일, 커버리지 최저선 미달 시 merge 차단" },
  { label: "배포 전 자동 검사", from: "0", value: "19", unit: "개", note: "하나라도 실패하면 merge 차단" },
  { label: "AI 리뷰 하네스", value: "3", unit: "개 레포 적용", note: "작성은 Claude, 검토는 Codex로 분리" },
  { label: "QA 시나리오", value: "321", unit: "개", note: "시나리오 문서 정비" },
];

const SCALE: [string, string][] = [
  ["OpenAPI 자동 생성 엔드포인트", "300+"],
  ["자동 생성 스키마", "800+"],
  ["라우트 팩토리로 통일한 BFF 라우트", "316 / 364"],
  ["전수 해소한 잠재 타입 오류", "221건"],
  ["해소한 Dependabot 경고 누적", "139건"],
  ["번역 키 / 머지 충돌", "4,200 / 0"],
  ["feature 간 직접 import, 순환 의존", "0 / 0"],
  ["ADR", "13건"],
];

// 화살표는 글자(유니코드) 대신 SVG로 그린다
const Arrow = () => (
  <svg
    className={styles.arrow}
    viewBox="0 0 16 10"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M1 5h13M10 1.5 13.5 5 10 8.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CareerHighlights = () => (
  <section className={styles.root} aria-labelledby={CAREER_HIGHLIGHTS_HEADING.id}>
    <h3 id={CAREER_HIGHLIGHTS_HEADING.id} className={styles.title}>
      {CAREER_HIGHLIGHTS_HEADING.text}
    </h3>

    <div className={styles.block}>
      <p className={styles.eyebrow}>
        <span className={styles.tag}>
          Before <Arrow /> After
        </span>
        개선 전 값을 100%로 둔 실제 비율
      </p>
      <div className={styles.bars}>
        {REDUCTIONS.map((item) => (
          <div key={item.label} className={styles.barRow}>
            <div className={styles.barLabel}>
              <b>{item.label}</b>
              <small>{item.note}</small>
            </div>
            <div className={styles.barTrack}>
              <div className={`${styles.bar} ${styles.before}`}>{item.before}</div>
              <div
                className={`${styles.bar} ${item.ratio === 0 ? styles.zero : styles.after}`}
                style={item.ratio === 0 ? undefined : { width: `${(item.ratio * 100).toFixed(1)}%` }}
              >
                {item.after}
              </div>
            </div>
            <div className={styles.delta}>{item.delta}</div>
          </div>
        ))}
      </div>
    </div>

    <div className={styles.block}>
      <p className={styles.eyebrow}>
        <span className={styles.tag}>
          0 <Arrow /> N
        </span>
        없던 것을 만든 것들
      </p>
      <div className={styles.counters}>
        {COUNTERS.map((item) => (
          <div key={item.label} className={styles.counter}>
            <span className={styles.from}>
              {item.label}
              {item.from ? (
                <>
                  {" "}
                  {item.from}
                  <span className={styles.srOnly}>에서</span>
                </>
              ) : null}
              <Arrow />
            </span>
            <span className={styles.to}>
              {item.value}
              <small className={styles.unit}>{item.unit}</small>
            </span>
            <span className={styles.note}>{item.note}</span>
          </div>
        ))}
      </div>
    </div>

    <div className={styles.block}>
      <p className={styles.eyebrow}>
        <span className={styles.tag}>Scale</span>
        다뤄 온 규모
      </p>
      <dl className={styles.ledger}>
        {SCALE.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
