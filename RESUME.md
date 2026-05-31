# 안동주

Frontend Engineer · Frontend Lead

---

## 연락처

| | |
|---|---|
| 이메일 | andongjoo1@naver.com |
| 전화 | +82 10-6303-2184 |
| GitHub | [dev-frankie](https://github.com/dev-frankie) |

---

## 소개

- TypeScript, React, Next.js, Redux/Recoil/Zustand, RTK-Query/TanStack Query, Vitest, Node.js, Docker 실무
- AI 분야 스타트업에서 프론트엔드를 주력으로 백엔드, CI/CD까지 폭넓은 분야를 경험하며, 10여 종의 제품을 개발·런칭
- 프론트엔드 성능 최적화에 강점
- 문제를 정의하고 수치로 가능한 개선을 일상으로 만드는 개발자
- AI 도메인에 대한 지식이 깊고 AI Assistant 활용에 강점

---

## 기술 스택

| 구분 | |
|---|---|
| Language | TypeScript, JavaScript, Python |
| Frontend | React, Next.js, Redux, Recoil, Zustand, RTK-Query, TanStack Query |
| Backend / Infra | Node.js, Docker, Redis, Jenkins, ArgoCD, GitHub Actions |
| Testing / Quality | Vitest, Playwright, ESLint, Husky, Lighthouse CI, Sentry |
| 기타 | Canvas/Fabric.js, D3.js, NextAuth, OpenAPI, SSE, FSD |

---

## 경력

### 셀렉트스타 · 프론트엔드 리드

`2025.07` – `현재` · 서울

#### Dtumo Eval — LLM 평가 플랫폼 프론트엔드 리드 (`2025.07` – `2026.02`)

**Tech Stack:** TypeScript, Next.js, Zustand, TanStack Query

LLM의 정량/정성 평가, Red Teaming, 실시간 모니터링을 제공하는 SaaS 플랫폼의 프론트엔드 아키텍처 리팩토링과 핵심 기능 개발을 전담

**아키텍처 리팩토링**

- SSG → 동적 아키텍처 전환: Next.js 14 → 16 업그레이드, API Routes 기반 전환, NextAuth + Middleware로 서버 사이드 인증·권한 기반 라우팅 구현
- FSD 패턴 도입: app / pages / widgets / features / entities / shared 계층 구조 재편, 계층 간 단방향 의존성 규칙 적용
- Polling → SSE 전환: 실시간 LLM 평가 모니터링 안정화, 불필요한 API 요청 감소
- Recoil → Zustand 마이그레이션: Flux 패턴 기반 단방향 데이터 흐름, Redux DevTools 연동
- 타입 안전성 강화: openapi-typescript + openapi-fetch 기반 OpenAPI 스펙 자동 타입 생성

**핵심 기능 개발**

- Red Teaming, 정량/정성 평가, 실시간 모니터링 등 LLM 성능 진단 기능 구현
- D3.js 기반 커스텀 시각화, 코드 스플리팅 + 가상화로 대용량 목록 렌더링 성능 개선
- React Hook Form + Zod 폼 검증 표준화, shadcn UI 라이브러리 + Storybook 문서화
- CSS 전역 변수 기반 Dark Mode 및 테마 시스템 구현

**개발 품질 체계화**

- Vitest(Unit) + Playwright(E2E) 테스트 도입
- ESLint + Husky + GitHub Actions CI/CD 파이프라인 구성
- @next/bundle-analyzer + Lighthouse CI 기반 PR 성능 리포트, LCP·번들 크기 Budget Gate 적용
- Sentry 도입, `.cursorrules` / `skills.md` 가이드 작성

---

### 주식회사 딥브레인AI · 웹 개발

`2022.03` – `2025.03` (3년) · 정규직 · 서울

#### AI Studios V3 개발 (`2023.08` – `2025.02`)

**Tech Stack:** TypeScript, Next.js, Redux/RTK Query, Canvas, Fabric.js

AI 가상인간 기반 개인화 영상 콘텐츠 제작 플랫폼

- v2 → v3 리팩토링 (Redux/RTK Query 도입), SSR·디바운싱·코드 스플리팅 등으로 FCP/LCP/TTI 평균 30% 이상 단축
- 캔버스 에디터: Job ID 기반 AI 미디어 폴링, Tree 기반 정렬 가이드 O(N²) → O(log N + M), FFmpeg 비디오 트림/썸네일, Portal 기반 Floating 툴바
- 1,000만 건 데이터 통계 대시보드: Chart.js 코드스플리팅 (FCP 1.2s → 0.4s, LCP 4.5s → 2.2s), MongoDB 사전 집계 API
- 카탈로그 페이지: Grid 반응형, Intersection Observer 무한 스크롤 + react-window 가상화
- 요금제 확장·구독 해지 방어 (Stripe, 설문+리워드) → 1개월 구독 200명 증가
- GA4/Amplitude/Baidu Analytics, Service Worker 푸시, AWS SMS, 이메일 자동화 A/B 테스트
- next-i18next 기반 10개국어 번역 자동화 및 지역화

#### 사내 백오피스 개발 및 로그인 통합 (`2022.11` – `2023.06`)

**Tech Stack:** TypeScript, Next.js, Node.js, Redis

- HOC 패턴 기반 권한별 컴포넌트 계층화, 기업/부서/멤버/AI 리소스 통합 관리 대시보드
- NextAuth.js 기반 통합 인증 NPM 패키지 배포, SSO 및 소셜 로그인 (Google, Facebook, Apple, WeChat)

#### B2B Project (`2022.03` – `2023.11`)

**Tech Stack:** TypeScript, JavaScript, Next.js, Node.js

- **KB증권 드림아바타 PoC:** AI 명함 서비스, SSE 기반 실시간 업데이트
- **농협은행 AI 실시간 통역:** STT/TTS SDK 10개국어, ChatGPT 기반 번역
- **서울시 교육청 AI 디지털 교과서:** E-Book 뷰어, 텍스트 프롬프터
- **농협은행 AI 허브 & Kiosk:** Vision SDK(PoseNet) 정면 판별, Redux + 퍼사드 패턴
- **AI 학습용 데이터 제작 플랫폼:** NAS 배치 자동화, 검수/보정 툴, 학습용 이미지 13만 장 제작

---

## 학력

| 기간 | 학교 | 전공 | 상태 |
|---|---|---|---|
| 2026.03 – | 고려대학교 융합데이터과학 대학원 | 융합데이터과학 | 재학 중 |
| 2016.03 – 2020.02 | 상명대학교 | 컴퓨터과학 | 졸업 |

**주요 수강:** 프로그래밍(C, Java, Python), 운영체제, 시스템 소프트웨어, 데이터베이스, 알고리즘, 자료구조, 컴퓨터구조, 컴퓨터네트워크

---

## 수상 · 교육 · 자격증

| 기간 | 구분 | 내용 |
|---|---|---|
| 2021.12 | 수상 | 제3회 인공지능 스타트업 경진대회 — 가스 수요 예측 모델 부문 특별상 |
| 2021.01 | 교육 | 네이버 부스트캠프 AI Tech (Vision, NLP, 추천시스템, 정형 데이터) |
| 2020.07 | 교육 | 삼성 청년 SW 아카데미 (Vue.js, Spring 프로젝트) |
| 2020.09 | 자격증 | ADsP (데이터분석 준전문가) |
| 2020.06 | 자격증 | SQLD (SQL 개발자) |
| 2019.09 | 자격증 | 정보처리기사 |

---

> 상세 프로젝트 및 성과는 [경력기술서](/work)를 참고해 주세요.
