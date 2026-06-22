andongjoo1@naver.com · +82 10-6303-2184 · [github.com/dev-frankie](https://github.com/dev-frankie)

# 안동주 (An Dongju)

**Frontend Engineer · Frontend Part Leader**

---

## ABOUT ME

복잡하고 모호한 요구사항을 단순한 문제로 추상화하고, 안정적인 코드로 구현하는 것을 강점으로 하는 4년차 프론트엔드 엔지니어입니다. React · TypeScript 기반으로 AI 스타트업에서 10여 종의 제품을 개발·런칭했습니다.

레거시 아키텍처를 점진적으로 전환하는 일에 강점이 있습니다. SSG → 동적 아키텍처, Recoil → Zustand, v2 → v3 전면 리팩토링과 FSD 도입 등 구조적 개선을 주도하며 복잡한 도메인을 단순한 화면 모델로 추상화해 왔습니다.

현재 셀렉트스타에서 프론트엔드 파트 리더로 팀원 관리 · 코드 리뷰 · 기술 전파와 타 직군 협업을 주도하고 있으며, Core Web Vitals 기반 성능 최적화와 테스트 · CI/CD 품질 자동화를 일상으로 만드는 것을 지향합니다.

## EXPERIENCE

2025.07 – 현재

### 셀렉트스타 · 프론트엔드 파트 리더

LLM 평가 · 데이터 라벨링 SaaS **DATUMO** 개발 — selectstar.ai

##### [1] 레거시 아키텍처 전환 및 인증 · 권한 체계 재설계

**기술 스택** Next.js 14→16 · TypeScript · Zustand · NextAuth · openapi-typescript &nbsp;&nbsp; **역할** 아키텍처 설계 · 전환 주도

- **배경** — 기존 플랫폼은 SSG로 빌드되어 인증 · 권한별 분기와 실시간 데이터에 대응하기 어려웠고, Recoil 상태가 비대해지고 API 타입을 수동 관리하면서 런타임 불일치와 유지보수 비용이 컸습니다.
- **해결**
  - SSG → 동적 아키텍처로 전환(API Routes 기반), NextAuth + Middleware로 서버 사이드 인증 · Role 기반 접근 제어 라우팅 구현
  - FSD(Feature-Sliced Design) 도입으로 계층 간 단방향 의존성 확립, Recoil → Zustand 마이그레이션(Flux 단방향 흐름)
  - openapi-typescript로 OpenAPI 스펙 기반 API 타입 자동 생성
- **결과** — 인증 · 권한 분기를 서버에서 일관 처리해 화면 분기 로직 제거, 신규 기능의 영향 범위를 feature 단위로 격리, 타입 불일치 런타임 에러 제거

##### [2] 실시간 모니터링 · Evaluation Run · Dashboard 개발

**기술 스택** SSE · TanStack Query · D3.js · 리스트 가상화 &nbsp;&nbsp; **역할** 핵심 기능 설계 · 구현

- **배경** — LLM 평가는 수 분~수십 분이 걸리는 비동기 작업이라 진행 상태를 실시간으로 파악하기 어려웠고, 결과가 수천~수만 행에 달해 목록 렌더링 시 성능 저하가 발생했습니다.
- **해결**
  - 상태 폴링(Polling)을 SSE로 전환해 평가 진행 상황을 실시간 스트리밍하고 불필요한 반복 요청 제거
  - Evaluation Run 워크플로우 UI(생성 → 진행 → 결과) 구현, D3.js 커스텀 시각화 + 리스트 가상화 + 코드 스플리팅으로 대용량 결과 렌더링 최적화
- **결과** — 평가 진행이 실시간 반영되고 폴링 대비 요청 수가 크게 감소, 수만 행 결과도 끊김 없이 탐색 가능

##### [3] 페이지 성능 최적화 (Core Web Vitals)

**기술 스택** Lighthouse CI · MCP · S3 · @next/bundle-analyzer &nbsp;&nbsp; **역할** 성능 진단 · 개선 주도

- **배경** — 초기 로딩 지연과 콘텐츠 이동(Layout Shift)으로 사용성이 저하됐고, 성능을 지속적으로 측정 · 감시할 체계가 없었습니다.
- **해결**
  - MCP를 활용해 Lighthouse 진단을 자동화하고 개선 우선순위 도출
  - 이미지 · 폰트 사이즈 예약과 스켈레톤으로 Layout Shift 방지, 정적 파일을 빌드 시 S3 업로드 + CDN 캐싱으로 분리
  - @next/bundle-analyzer + Lighthouse CI PR 리포트로 LCP · 번들 크기 Budget Gate 적용
- **결과** — Lighthouse 성능 점수 60 → 90+, CLS 0.2 → 0.05, LCP 단축, PR 단계에서 성능 회귀 자동 감지

##### [4] 프론트엔드 표준화 · 품질 자동화 및 파트 리딩

**기술 스택** Vitest · Playwright · MCP · shadcn/ui · Storybook · GitHub Actions · Sentry &nbsp;&nbsp; **역할** 파트 리딩, 품질 체계 구축

- **배경** — 파트 리더로서 팀이 지속 가능하게 개발하려면 공통 기반과 품질 자동화가 필요했고, 기능별 중복 구현과 회귀 테스트 부재가 비용을 키우고 있었습니다.
- **해결**
  - 파트원(3명) 업무 분배 · 코드 리뷰 · 기술 전파를 담당하고, PO · 디자이너 · 서버 · MLOps와 요구사항을 정의 · 조율
  - 공통 컴포넌트 라이브러리(shadcn/ui + Storybook), 다국어(한/영) 관리, GA 이벤트 트래킹 체계화
  - Vitest + Playwright 도입, MCP로 테스트 케이스(TC)를 정의 · 생성해 회귀 테스트 자동화, ESLint + Husky + GitHub Actions CI/CD, Sentry 도입
- **결과** — 신규 기능 개발 속도 향상, 핵심 플로우 회귀 테스트 자동화로 배포 안정성 강화, 팀 공통 컨벤션 · 온보딩 기준 정립

2022.03 – 2025.03

### 주식회사 딥브레인AI · 웹 개발

AI 휴먼 기반 영상 생성 SaaS 및 금융권 대형 SI 프로젝트 — 정규직 · 3년

#### AI Studios V3 — AI 영상 제작 플랫폼

v2 → v3 전면 리팩토링(Redux · RTK Query)으로 SSR · 디바운싱 · 코드 스플리팅을 적용해 FCP/LCP/TTI 평균 30%↓를 달성했습니다.

##### [1] 캔버스 웹 에디터 신규 개발

**기술 스택** Canvas · Fabric.js · Redux · FFmpeg &nbsp;&nbsp; **역할** 에디터 설계 · 구현

- **배경** — 텍스트로 생성하는 AI 이미지/비디오는 생성 시간이 비결정적이라 즉시 응답받을 수 없었고, 캔버스 내 다중 객체의 정렬 · 편집 상태 관리가 복잡했습니다.
- **해결**
  - Job ID 기반 폴링으로 생성 완료 시 캔버스에 자동 반영
  - 정렬 스냅 가이드를 전수 비교(O(N²)) → 정렬 좌표 탐색(O(log N + M))으로 개선, FFmpeg 비디오 트림 · 썸네일과 상태 복구, React Portal 기반 Floating 툴바(useResizeObserver)
- **결과** — 텍스트 입력만으로 미디어 생성 · 편집 흐름을 일원화하고, 대형 캔버스에서도 정렬 · 편집 반응성 확보

##### [2] 1,000만 건 데이터 통계 대시보드

**기술 스택** Next.js · Chart.js · MongoDB · Kubernetes &nbsp;&nbsp; **역할** 대시보드 · 집계 파이프라인 개발

- **배경** — 기관 · 팀 · 개인별 사용 현황을 실시간으로 파악하기 어려웠고, 1,000만 건 이상 데이터를 기간별 조회할 때 속도 저하가 심했습니다.
- **해결**
  - MongoDB 사전 집계 API와 Kubernetes Cron 일배치로 raw 데이터 정제 · 리포트 자동화
  - Chart.js 코드 스플리팅으로 초기 번들 축소
- **결과** — FCP 1.2s → 0.4s, LCP 4.5s → 2.2s, 운영팀 의사결정용 실시간 대시보드 제공

##### [3] 요금제 확장 · 구독 해지 방어 시스템

**기술 스택** Next.js · Stripe &nbsp;&nbsp; **역할** 결제 · 구독 도메인 설계 · 구현

- **배경** — 레거시 요금제와 신규 요금제를 병행하며 권한 로직이 혼재해 복잡도가 컸고, 구독 해지 사유를 수집 · 분석할 체계가 없었습니다.
- **해결**
  - 요금제별 접근 권한을 DB 필드로 모델링하고 권한 조회를 커스텀 훅으로 추상화, 업/다운그레이드 판단 매트릭스 설계
  - 해지 시 설문 + 크레딧/할인 리워드 퍼널과 해지 히스토리 페이지 구축, Stripe 연동
- **결과** — 중복 권한 코드를 대폭 제거해 유지보수성 향상, 월 신규 구독 200명+ 확보, 해지 데이터 기반 방어 전략 수립

##### [4] 글로벌 다국어 · 지역화

**기술 스택** next-i18next · Node.js &nbsp;&nbsp; **역할** 다국어 · 리전 대응

- **배경** — 다국적 사용자 대응을 위해 다국어가 필요했고, 국가별 로그인 · 결제 수단 등 특수 요구사항과 번역 관리 비효율이 있었습니다.
- **해결** — next-i18next 기반 10개국어 번역 + 언어별 반응형 UI, 중국 시장 위챗 로그인 · 알리페이 등 리전 커스터마이징, 번역 키 매핑 자동화 스크립트
- **결과** — 폐쇄적 시장(중국 등) 진입, 번역 작업 시간 단축 및 글로벌 사용자 경험 개선

#### 사내 통합 로그인 · 백오피스

##### [1] 자사 서비스 통합 로그인 NPM 패키지

**기술 스택** NextAuth · Node.js &nbsp;&nbsp; **역할** 인증 모듈 설계 · 배포

- **배경** — 서비스마다 로그인 방식이 달라 사용자 경험이 단절되고, 서비스별 중복 인증 구현으로 개발 효율이 떨어졌습니다.
- **해결** — NextAuth 기반 OAuth 로그인 모듈을 npm 패키지로 추상화 · 배포(설치만으로 적용), 소셜 로그인(Google · MS · Apple · Facebook · WeChat) 통합, SSO 구현
- **결과** — 신규 서비스 인증 구축 비용 절감, 서비스 간 재로그인 제거, 로그인 편의 개선으로 신규 유입 증가

##### [2] Account 통합 어드민 / 백오피스

**기술 스택** Next.js · Node.js · Redis &nbsp;&nbsp; **역할** 인증 서버 · 어드민 설계 · 개발

- **배경** — 인증을 처리하는 중앙 서버와 기업 · 부서 · 멤버 · AI 리소스를 관리하는 어드민 도구가 필요했습니다.
- **해결** — 회원 비즈니스 로직(Facade 패턴), Redis 기반 중복 로그인 방지, 탈퇴 후 30일 경과 계정 자동 삭제 배치, HOC 패턴 권한별 컴포넌트 계층화, 보이스 · 아바타 리소스 관리 페이지 구현
- **결과** — 데이터 관리 효율과 관리자 편의 향상, 사내 SSO 인증 서버 운영

#### B2B · 대형 SI 프로젝트

| 프로젝트 | 핵심 내용 |
|---|---|
| **KB증권 드림아바타 PoC** | 사진 · 음성 업로드 → 얼굴 바운딩 박스 지정 → AI 합성 서버 연동으로 말하는 AI 명함 생성 |
| **농협은행 AI 실시간 통역** | STT/TTS 10개국어 SDK 연동, ChatGPT 문맥 기반 번역으로 실시간 통역 구현 |
| **서울시 교육청 AI 디지털 교과서** | E-Book 뷰어 + 텍스트 프롬프터 + AI 질의응답 (2023 디지털 러닝페스티벌 참여) |
| **농협은행 AI 허브 & Kiosk** | Vision SDK(PoseNet) 정면 판별, 퍼사드 패턴, 폴라로이드 즉시 출력 (약 20억 규모) |
| **AI 학습 데이터 라벨링 · 검수 플랫폼** | NAS 배치 자동 라벨링 + 검수/보정 툴로 학습 이미지 13만 장 제작 (정부과제) |

## SKILL

| 구분 | 기술 |
|---|---|
| **Language** | TypeScript, JavaScript, Python |
| **Frontend** | React, Next.js, Zustand, Recoil, Redux, TanStack Query, RTK Query |
| **UI / 시각화** | shadcn/ui, Storybook, CSS Modules, Canvas · Fabric.js, D3.js |
| **Test / Quality** | Vitest, Playwright, ESLint, Husky, Lighthouse CI, Sentry |
| **Backend / Infra** | Node.js, Docker, Redis, AWS(S3 · SES), Jenkins, ArgoCD, GitHub Actions |
| **기타** | OpenAPI 타입 자동화, NextAuth, SSE, FSD 아키텍처, MCP |

## EDUCATION

| 기간 | 학교 | 전공 | 상태 |
|---|---|---|---|
| 2026.03 – | 고려대학교 융합데이터과학 대학원 | 융합데이터과학 | 재학 중 |
| 2016.03 – 2020.02 | 상명대학교 | 컴퓨터과학 | 졸업 |

## AWARDS & CERTIFICATES

| 기간 | 구분 | 내용 |
|---|---|---|
| 2021.12 | 수상 | 제3회 인공지능 스타트업 경진대회 — 가스 수요 예측 모델 부문 **특별상** |
| 2021.01 | 교육 | 네이버 부스트캠프 AI Tech (PyTorch 기반 모델링) |
| 2020.07 | 교육 | 삼성 청년 SW 아카데미 (Vue.js · Spring 프로젝트) |
| 2020.09 | 자격증 | ADsP (데이터분석 준전문가) |
| 2020.06 | 자격증 | SQLD (SQL 개발자) |
| 2019.09 | 자격증 | 정보처리기사 |
