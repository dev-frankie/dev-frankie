+82 10-6303-2184 · andongjoo1@naver.com  
[github.com/dev-frankie](https://github.com/dev-frankie) · [linkedin.com/in/adj0715](https://www.linkedin.com/in/adj0715/)

# 안동주 (An Dongju)

**Frontend Engineer**

---

## ABOUT ME

복잡하고 모호한 요구사항을 단순한 문제로 추상화하고, 안정적인 코드로 구현하는 것을 강점으로 하는 4년차 프론트엔드 엔지니어입니다. React · TypeScript 기반으로 AI 스타트업에서 10여 종의 제품을 개발·런칭했습니다.

레거시 아키텍처를 점진적으로 전환하는 일에 강점이 있습니다. SSG → 동적 아키텍처, Recoil → Zustand, v2 → v3 전면 리팩토링과 FSD 도입 등 구조적 개선을 주도하며 복잡한 도메인을 단순한 화면 모델로 추상화해 왔습니다.

현재 셀렉트스타에서 프론트엔드 파트 리더로 팀원 관리 · 코드 리뷰 · 기술 전파와 타 직군 협업을 주도하고 있으며, Core Web Vitals 기반 성능 최적화와 테스트 · CI/CD 품질 자동화를 일상으로 만드는 것을 지향합니다. 특히 **작성자 ≠ 검증자 교차검증 하네스를 사내 NPM으로 자산화**하는 등 AI 개발 방법론을 팀의 지속 가능한 개발 방식으로 정착시키는 데 강점이 있습니다.

## 핵심 역량

| 영역               | 대표 성과 (측정값)                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI 개발 방법론** | 작성자(Claude) ≠ 검증자(Codex) 교차검증 하네스를 사내 NPM `@datumo/agent-harness`로 배포, drift-aware sync로 front · admin 2개 레포 규칙 · 스킬 통일                                                    |
| **성능 최적화**    | Task 진입 472 → 323ms(32%↓), 테이블 가상화 손익분기점 실측(초기 렌더는 1,000행부터·스크롤은 5,000행부터 유효 · 5,000행 2,904 → 100ms · 15.6 → 63fps · 합성 데이터), recharts 116KB(gzip) 초기 번들 분리, Core Web Vitals 측정 · Budget Gate  |
| **아키텍처**       | SSG → 동적 전환 + Company/Workspace/Application 3계층 권한, FSD 67개 슬라이스, Recoil → Zustand 전역 상태 429개 이관, Polling → SSE 실시간 협업                                                         |
| **타입 안전성**    | type-aware ESLint(projectService) 도입, `noUncheckedIndexedAccess` 타입 오류 221건 전수 해소, `as unknown as never` 이중 단언 53곳 근본 규명, OpenAPI → 타입·Zod 자동 생성으로 계약 drift 차단          |
| **품질 · DX**      | Vitest 630+ 케이스 + 커버리지 게이트(Functions 91% · Branches 79% CI 강제) + Playwright E2E, Sentry 중앙 계측(커스텀 fingerprint · 3계층 노이즈 필터), i18n(next-intl) 자동화(약 1,300키 · 번역 충돌 0) |

**Tech Stack** — TypeScript · React 18 · Next.js · Zustand · TanStack Query · RTK Query · openapi-typescript · Vitest · Playwright

## EXPERIENCE

2025.07 – 현재

### 셀렉트스타 · 프론트엔드 파트 리더

LLM 평가 · 데이터 라벨링 SaaS **DATUMO** 개발 — selectstar.ai · 누적 투자 434억 규모의 AI 학습 데이터 전문 기업

> 단일 평가 도구(Eval)에서 **Eval + Red Teaming + Console + Observability**를 아우르는 Datumo Platform으로의 확장을, **아키텍처 리팩토링과 핵심 기능 개발 양면에서** 파트 리더로 주도했습니다.

##### [1] 레거시 아키텍처 전환 및 인증 · 권한 체계 재설계

**기술 스택** Next.js 14→16 · TypeScript · Zustand · NextAuth · openapi-typescript &nbsp;&nbsp; **역할** 아키텍처 설계 · 전환 주도

- **문제** — 레거시가 SSG(정적 생성) 기반이라 서버 사이드 인증 검증·권한 라우팅이 **구조적으로 불가능**해, 단일 평가 도구를 Company/Workspace 다계층 권한 플랫폼으로 확장하는 데 근본 제약이 있었습니다. 전역 상태도 Recoil atom 429개로 흩어져 흐름 파악이 어렵고 DevTools 미지원으로 디버깅 비용이 컸으며, API 타입을 수기 관리하면서 런타임 불일치가 잦았습니다.
- **가정** — 정적 구조의 한계는 렌더링 방식이 아니라 *서버에서 요청을 가로챌 수 없다*는 데 있으니, API Routes 기반 동적 구조 + Middleware면 인증 가드가 성립할 것으로 봤습니다. 상태는 *중앙 스토어 + DevTools로 추적 가능성 확보*가 최우선이라 판단해, atom 분산 모델이 유지되는 Jotai가 아닌 Zustand를 택했습니다.
- **해결**
  - Next.js 14→16 업그레이드 후 SSG → API Routes 기반 동적 구조로 전환, NextAuth + Middleware(BFF)로 **Company / Workspace / Application 3계층 권한(+슈퍼어드민)** 라우팅 가드 구현
  - FSD(Feature-Sliced Design) **67개 슬라이스**(계층 간 단방향 의존 + 슬라이스별 번들 자동 추적) 도입, Recoil → Zustand 전역 상태 **429개**(atom 427 + atomFamily 2)를 selector 래핑으로 소비처 변경을 최소화하며 도메인별 점진 이관 — Flux 단방향 + Redux DevTools 타임트래블 디버깅 확보
  - openapi-typescript · openapi-fetch로 스펙 기반 타입 자동 생성 및 불일치 **컴파일 타임 감지**
- **성과** — 정적 구조에선 불가능했던 인증 기반 라우팅 가드를 실현(보안·확장성 확보), 신규 기능의 영향 범위를 feature 단위로 격리, 타입 불일치 런타임 에러 제거

##### [2] 실시간 협업 · Red Teaming · 대용량 테이블 등 핵심 기능

**기술 스택** SSE · TanStack Query · TanStack Table · shadcn/ui · ECharts/Recharts &nbsp;&nbsp; **역할** 핵심 기능 설계 · 구현

- **문제** — LLM 평가는 수 분–수십 분이 걸리는 비동기 작업이라 진행 상태를 실시간으로 파악하기 어려웠고, 여러 사용자가 같은 평가를 동시에 다룰 때의 편집 충돌과 수천–수만 행 결과의 렌더링 성능이 과제였습니다.
- **가정** — 폴링의 낭비는 _클라이언트가 서버에 계속 되묻는_ 구조에서 나오므로 서버 푸시(SSE)로 제거할 수 있고, 대용량 테이블은 무거운 그리드 라이브러리 대신 _화면에 필요한 만큼만 DOM에 유지_(headless + 가상화)하면 성능과 커스터마이징 자유도를 함께 얻을 것으로 봤습니다.
- **해결**
  - **실시간 협업** — 폴링 → SSE로 전환해 평가 진행을 실시간 스트리밍(불필요한 반복 요청 제거), viewerSessionId 기반 echo suppression + presence로 active users 표시와 편집 버전 충돌 감지·최신 반영을 갖춘 공동 편집 구현
  - **Red Teaming** — 공격셋 기반 자동 Red Teaming 플로우 + human-in-the-loop 채팅으로 평가 → 취약점 탐지 → 재현을 한 흐름으로 연결
  - **대용량 테이블** — 무거운 그리드 라이브러리 의존을 제거하고 Headless(TanStack Table) + shadcn/ui로 가상화 · 2중 헤더 · rowspan/colspan 테이블을 직접 구현, 상세는 가상화 + 동적 컬럼 적용
  - **대시보드** — D3 → ECharts/Recharts 전환 + 드래그앤드랍 그리드로 사용자가 위젯을 배치하는 커스텀 대시보드 제공
- **성과** — 실시간 반영 + 폴링 대비 요청 수 급감, 다중 사용자가 충돌 없이 협업. 가상화는 도입 후 합성 데이터로 손익분기점을 실측해 **초기 렌더는 1,000행부터, 스크롤은 5,000행부터** 유효함을 분리 확인(1,000행 초기 렌더 **677 → 90ms(7.5배)** / 5,000행 스크롤 **15.6 → 63fps** · long task **30 → 0건**), 현재 페이지 크기(100행)에서는 이득이 없고 스크롤 프레임만 내주는 트레이드오프임을 문서화

##### [3] 페이지 성능 최적화 (Core Web Vitals)

**기술 스택** Lighthouse CI · MCP · S3 · @next/bundle-analyzer &nbsp;&nbsp; **역할** 성능 진단 · 개선 주도

- **문제** — 초기 로딩 지연과 콘텐츠 이동(Layout Shift)으로 사용성이 저하됐고, 차트 라이브러리 recharts 116KB(gzip)가 대시보드를 열지도 않는 사용자에게까지 초기 공유 번들로 배달됐으며, 성능을 지속 측정·감시할 체계가 없었습니다.
- **가정** — 처음엔 *대시보드 컴포넌트를 `dynamic()`으로 지연하면 분리될 것*으로 가정했으나 리빌드 후 청크 콘텐츠 해시가 바이트 동일해 기각 — 진범은 barrel의 정적 재수출로 판단했습니다. 또한 "체감이 빨라졌다"는 주장이 아니라 *ms 단위 계측으로 증명*해야 한다고 봤습니다.
- **해결**
  - **Playwright + User Timing API로 4조합 × 4 Task × 5회(총 80샘플) 자동 측정**해 감이 아닌 수치로 최적 조합 도출
  - **barrel 재수출로 무력화된 코드 스플리팅을 청크 해시(build-manifest · loadable-manifest)로 실측 규명**하고, 위젯 내부 dynamic wrapper로 recharts 116KB(gzip)를 초기 공유 번들에서 분리(FSD 규칙 준수)
  - Task 상세의 7-테이블 조인 지연을 카드 지연 로드 + 호버 prefetch로 제거, 이미지·폰트 사이즈 예약과 스켈레톤으로 Layout Shift 방지, 정적 파일을 빌드 시 S3 업로드 + CDN 캐싱으로 분리
  - @next/bundle-analyzer + Lighthouse CI(3회 실행 중앙값 감사 + 무거운 dep 자동 감지)로 PR 단계 LCP·번들 크기 Budget Gate 적용, main 번들 baseline 대비 **PR별 gzip 증감 diff + Top 15 패키지 랭킹**을 스티키 코멘트로 자동 게시(perf:bundle-diff)
- **성과** — Task 진입 **472 → 323ms(32%↓)**(최악 케이스 llm-as-judge는 **623 → 148ms, 약 4배**), 최적화 대상 라우트(Task Results) Lighthouse 성능 **99점** · CLS **0** (2026-07 실측), PR 단계에서 성능 회귀 자동 차단

##### [4] 프론트엔드 표준화 · 품질 자동화 및 파트 리딩

**기술 스택** Vitest · Playwright · MCP · shadcn/ui · Storybook · GitHub Actions · Sentry &nbsp;&nbsp; **역할** 파트 리딩, 품질 체계 구축

- **문제** — 파트 리더로 합류했을 때 레거시(`llm-eval-front`)는 실행 가능한 테스트가 **0개**, 소스 lint만 해도 **56 errors / 710 warnings**, `eslint.ignoreDuringBuilds`로 오류가 있어도 배포되는 구조라 품질이 개인 숙련도·수동 QA에 전적으로 의존했습니다. AI 코드리뷰를 도입해도 작성자=검증자라 같은 맹점을 두 번 통과시키는 한계가 있었습니다.
- **가정** — 품질은 개인의 주의가 아니라 *merge를 막는 차단 게이트*로 시스템화해야 변경이 누적돼도 무너지지 않고, AI 리뷰의 맹점은 코드리뷰의 Reviewer≠Assignee 원리를 이식해 _작성자(모델) ≠ 검증자(다른 모델)_ 로 분리하면 교차검증이 성립한다고 봤습니다.
- **해결**
  - 파트원(3명) 업무 분배 · 코드 리뷰 · 기술 전파를 담당하고, PO 요구사항을 정의 · 조율
  - AI 코드리뷰 하네스를 사내 NPM 패키지 **`@datumo/agent-harness`** 로 배포 — **작성자(Claude) ≠ 검증자(Codex)** 교차검증 + 버전관리된 고정 프롬프트로 저자 편향 차단, 머신 게이트(typecheck · eslint · test · i18n) + drift-aware sync로 front · admin 두 레포 규칙 · 스킬 통일. **도입 첫날 하네스가 자기 코드의 결함 12건**(typecheck 크래시를 통과시키던 false GREEN 등)을 교차검증으로 규명
  - **타입 안전성 시스템화** — type-aware ESLint(`projectService`)로 타입 기반 룰을 error 승격, `noUncheckedIndexedAccess` 도입으로 발생한 타입 오류 **221건 전수 해소**(소스-가드 전략), `no-floating-promises` 방치 Promise 109건 정리, `as unknown as never` 이중 단언 53곳의 근본 원인(수기 3,200줄 API 타입 계층)을 규명해 OpenAPI → Zod 자동 생성으로 대치
  - Vitest + Playwright 도입, 순수 로직 TDD로 테스트를 **0 → 630+ 케이스(파일 68 → 95)** 백필하고 **커버리지 게이트로 CI 강제**(Functions 91% · Branches 79% · Statements 85%), ESLint + Husky + GitHub Actions로 lint · format · typecheck · test · build를 **merge 차단 게이트**로 실행
  - 공통 컴포넌트 라이브러리(shadcn/ui + Storybook), i18n(next-intl) 단방향 자동화(코드=원본 → `en` 자동 생성, `ja`·`ko`만 번역, 약 1,300키) — 컬럼 단위 소유권 설계로 **번역 머지 충돌 0건**, Sentry 관측성 고도화(QueryCache onError **중앙 계측** + 커스텀 fingerprint로 **API 단위 그룹핑** + 3계층 노이즈 필터 + 환경/릴리즈 마킹)
  - 5개 환경 배포 매트릭스와 고객사 대응 온프레미스 standalone Docker 이미지 구성으로 SaaS · 온프레미스 배포를 동시 지원
- **성과** — 실행 테스트 **0 → 630+ 케이스**, 소스 lint **56 errors → 0**, 오류가 있어도 배포되던 구조에서 _merge 전 자동 검증_ 체계로 전환. 사내 레포 성숙도 평가 **4.0 → 6.5/10**(테스트·CI·아키텍처 축 개선), 팀 공통 컨벤션·온보딩 기준 정립

  2022.03 – 2025.03

### 주식회사 딥브레인AI · 웹 개발

AI 휴먼 기반 영상 생성 SaaS 및 금융권 대형 SI 프로젝트 — 정규직 · 3년

#### AI Studios V3 — AI 영상 제작 플랫폼

v2 → v3 전면 리팩토링(Redux · RTK Query)으로 SSR · 디바운싱 · 코드 스플리팅을 적용해 FCP/LCP/TTI 평균 30%↓를 달성했습니다.

##### [1] 캔버스 웹 에디터 신규 개발

**기술 스택** Canvas · Fabric.js · Redux · FFmpeg &nbsp;&nbsp; **역할** 에디터 설계 · 구현

- **문제** — 텍스트로 생성하는 AI 이미지/비디오는 생성 시간이 비결정적이라 즉시 응답받을 수 없었고, 캔버스 내 다중 객체의 정렬 스냅 가이드를 매 드래그 프레임마다 전수 비교하면서 대규모 에셋에서 프레임 드랍이 발생했습니다.
- **가정** — 생성 지연은 Job ID 폴링으로 비동기 반영하면 UX를 막지 않고, 정렬 가이드의 병목은 *매 프레임 재계산*에 있으니 드래그 1회 계산 + 축별 후보 축소로 없앨 수 있다고 봤습니다.
- **해결**
  - Job ID 기반 폴링으로 생성 완료 시 캔버스에 자동 반영
  - 정렬 스냅 가이드를 **드래그 시작 시 1회 캐싱 + 축별 사전 필터링 + 가이드라인 DOM 렌더 분리**로 개선, FFmpeg 비디오 트림 · 썸네일과 상태 복구, React Portal 기반 Floating 툴바(useResizeObserver)
- **성과** — 텍스트 입력만으로 미디어 생성 · 편집 흐름을 일원화하고, 대형 캔버스에서도 프레임 드랍 없이 정렬 · 편집 반응성 확보

##### [2] 1,000만 건 데이터 통계 대시보드

**기술 스택** Next.js · Chart.js · MongoDB · Kubernetes &nbsp;&nbsp; **역할** 대시보드 · 집계 파이프라인 개발

- **문제** — 기관·팀·개인별 사용 현황을 실시간으로 파악하기 어려웠고, 1,000만 건 이상 데이터를 기간별로 조회할 때마다 집계가 3초 이상 걸려 사용성이 떨어졌습니다.
- **가정** — 조회 시점에 raw를 매번 집계하는 게 병목이므로 *사전 집계 + 배치*로 조회를 단순 read로 바꾸면 응답이 상수 시간에 가까워질 것으로 봤습니다.
- **해결**
  - MongoDB 사전 집계 API와 Kubernetes Cron 일배치로 raw 데이터 정제·리포트 자동화
  - Chart.js 코드 스플리팅으로 초기 번들 축소
- **성과** — FCP 1.2s → 0.4s(67%↓), LCP 4.5s → 2.2s(51%↓), 조회 응답 3s+ → 1s 미만, 운영팀 의사결정용 실시간 대시보드 제공

##### [3] 요금제 확장 · 구독 해지 방어 시스템

**기술 스택** Next.js · Stripe &nbsp;&nbsp; **역할** 결제 · 구독 도메인 설계 · 구현

- **문제** — 레거시 요금제와 신규 요금제를 병행하며 권한 로직이 혼재해 복잡도가 컸고, 구독 해지가 즉시 이탈로 이어지는데 사유를 수집·분석할 체계가 없었습니다.
- **가정** — 권한 분기가 코드에 흩어진 게 문제이므로 *권한을 데이터로 모델링*하고 훅으로 추상화하면 중복이 사라지고, 해지는 단일 확인창이 아니라 *단계별 방어 퍼널*로 붙잡을 여지가 있다고 봤습니다.
- **해결**
  - 요금제별 접근 권한을 DB 필드로 모델링하고 권한 조회를 커스텀 훅으로 추상화, 업/다운그레이드 판단 매트릭스 설계
  - 해지 시 **4단계 defense-in-depth**(유예 다운그레이드 → 할인 → 리워드 쿠폰 → 설문) 퍼널과 해지 히스토리 페이지 구축, Stripe 연동
- **성과** — 중복 권한 코드를 대폭 제거해 유지보수성 향상, 약 2개월간 신규 구독 **300명** 확보, 해지 데이터 기반 방어 전략 수립

##### [4] 글로벌 다국어 · 지역화

**기술 스택** next-i18next · Node.js &nbsp;&nbsp; **역할** 다국어 · 리전 대응

- **문제** — 다국적 사용자 대응을 위해 다국어가 필요했고, 국가별 로그인·결제 수단 등 특수 요구사항과 수기 번역 관리의 비효율이 있었습니다.
- **해결** — next-i18next 기반 10개국어 번역 + 언어별 반응형 UI, 중국 시장 위챗 로그인·알리페이 등 리전 커스터마이징, Google Sheet ↔ JSON 자동 동기화로 번역 키 매핑 자동화
- **성과** — 폐쇄적 시장(중국 등) 진입, 번역 작업 시간 단축 및 글로벌 사용자 경험 개선

##### [5] 그로스 · 마케팅 자동화

**기술 스택** GA4/GTM · Amplitude · Service Worker · AWS SES &nbsp;&nbsp; **역할** 트래킹 · 마케팅 자동화 구현

- **문제** — 유입·전환 데이터를 일관되게 수집·분석할 체계가 없었고, 이탈 사용자를 재유입시킬 자동화된 마케팅 채널이 부족했습니다.
- **해결** — GA4/GTM(Consent Mode) + Amplitude(Session Replay)로 이벤트 트래킹·퍼널 분석을 체계화, A/B 테스트, Service Worker 웹푸시, AWS SES 기반 드립 이메일(4개 세그먼트 × 10+ 시나리오) 자동화
- **성과** — 유입·전환을 데이터로 측정·개선하는 기반 확보, 이탈 사용자 재유입 채널 확립

#### 사내 통합 로그인 · 백오피스

##### [1] 자사 서비스 통합 로그인 NPM 패키지

**기술 스택** NextAuth · Node.js &nbsp;&nbsp; **역할** 인증 모듈 설계 · 배포

- **문제** — 서비스마다 로그인 방식이 달라 사용자 경험이 단절되고, 서비스별로 인증을 중복 구현하면서 개발 효율이 떨어졌습니다.
- **해결** — NextAuth 기반 OAuth 로그인 모듈을 npm 패키지 **`@deepbrain/next-auth-account`** 로 추상화 · 배포(설치만으로 적용), 6종 소셜 로그인(Google · MS · Apple · Facebook · **WeChat · Alipay — RSA-SHA256 커스텀 서명**) 통합, Redis 싱글턴 세션으로 서비스 간 seamless SSO 구현
- **성과** — 신규 서비스 인증 구축 비용 절감, 서비스 간 재로그인 제거, 로그인 편의 개선으로 신규 유입 증가

##### [2] Account 통합 어드민 / 백오피스

**기술 스택** Next.js · Node.js · Redis &nbsp;&nbsp; **역할** 인증 서버 · 어드민 설계 · 개발

- **문제** — 인증을 처리하는 중앙 서버와 기업 · 부서 · 멤버 · AI 리소스를 관리하는 어드민 도구가 필요했습니다.
- **해결** — 회원 비즈니스 로직(Facade 패턴), Redis 기반 중복 로그인 방지, 탈퇴 후 30일 경과 계정 자동 삭제 배치, HOC 패턴 권한별 컴포넌트 계층화, 보이스 · 아바타 리소스 관리 페이지 구현
- **성과** — 데이터 관리 효율과 관리자 편의 향상, 사내 SSO 인증 서버 운영

#### B2B · 대형 SI 프로젝트

| 프로젝트                                | 핵심 내용                                                                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **KB증권 드림아바타 PoC**               | 사진 · 음성 업로드 → 얼굴 바운딩 박스 지정 → 음성 클로닝(ElevenLabs) · Webhook 연동으로 말하는 AI 명함 생성                                                        |
| **농협은행 AI 실시간 통역**             | STT/TTS 10개국어 SDK 연동, ChatGPT 문맥 기반 번역으로 실시간 통역 구현, SDK 지연 로드로 **TTI 7.6s → 4.3s(43%↓)**                                                  |
| **서울시 교육청 AI 디지털 교과서**      | E-Book 뷰어 + 텍스트 프롬프터 + AI 질의응답 (2023 디지털 러닝페스티벌 참여)                                                                                        |
| **농협은행 AI 허브 & Kiosk**            | Vision SDK(PoseNet) 정면 판별, 퍼사드 패턴, 폴라로이드 즉시 출력 (약 20억 규모)                                                                                    |
| **AI 학습 데이터 라벨링 · 검수 플랫폼** | NAS 이미지 자동 라벨링(눈·코·입 좌표 · 성별 추출 API) + 검수/보정 툴 + 교차검증 · 관리자 승인 파이프라인으로 학습 이미지 **10만 장+** 제작 (약 20억 규모 정부과제) |

## SKILL

| 구분                | 기술                                                                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language**        | TypeScript, JavaScript, Python                                                                                                                                          |
| **Frontend**        | React, Next.js, Zustand, Recoil, Redux, TanStack Query, RTK Query                                                                                                       |
| **UI / 시각화**     | shadcn/ui, Storybook, CSS Modules, Canvas · Fabric.js, D3.js · ECharts · Chart.js                                                                                       |
| **Test / Quality**  | Vitest, Playwright, ESLint, Husky, Lighthouse CI, Sentry, Datadog RUM, OpenTelemetry                                                                                    |
| **Backend / Infra** | Node.js, Docker, Kubernetes, Redis, AWS(S3 · SES · ElastiCache), Jenkins, ArgoCD, GitHub Actions                                                                        |
| **기타**            | OpenAPI 타입 · Zod 자동화, NextAuth, SSE, FSD 아키텍처, MCP, TensorFlow.js(PoseNet), GA4/GTM · Amplitude, AI 개발 방법론(Claude × Codex 하네스 · @datumo/agent-harness) |

## EDUCATION

| 기간                    | 학교                             | 전공                          | 상태    |
| ----------------------- | -------------------------------- | ----------------------------- | ------- |
| 2026.03 – 2027.08(예정) | 고려대학교 융합데이터과학 대학원 | 융합데이터과학 (GPA 4.42/4.5) | 재학 중 |
| 2016.03 – 2020.02       | 상명대학교                       | 컴퓨터과학                    | 졸업    |

## AWARDS & CERTIFICATES

| 기간              | 구분   | 내용                                                                                                                                   |
| ----------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 2021.12           | 수상   | 제3회 인공지능 스타트업 경진대회 — 가스 수요 예측 모델 부문 **특별상**                                                                 |
| 2021.01 – 2021.06 | 교육   | 네이버 부스트캠프 AI Tech — PyTorch(EfficientNet 이미지 분류, Swin Transformer · U-Net · DeepLab v3+ 세그멘테이션, LGBM/CatBoost 예측) |
| 2020.07 – 2020.11 | 교육   | 삼성 청년 SW 아카데미(SSAFY) — Spring Boot · Vue.js 부동산 정보 서비스 개발                                                            |
| 2020.09           | 자격증 | ADsP (데이터분석 준전문가)                                                                                                             |
| 2020.06           | 자격증 | SQLD (SQL 개발자)                                                                                                                      |
| 2019.09           | 자격증 | 정보처리기사                                                                                                                           |
