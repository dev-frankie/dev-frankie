# content/posts 구조 규칙

디렉터리 트리가 그대로 **카테고리 트리 + URL**이 됩니다.

```
content/posts/
  frontend/
    _category.json              → 카테고리 메타 (라벨/정렬/설명)
    performance/
      _category.json
      bundle-analysis-performance.mdx   → /blog/frontend/performance/bundle-analysis-performance
```

- 디렉터리를 새로 만들면 좌측 사이드바에 카테고리가 자동으로 추가됩니다. 깊이 제한 없음.
- 글 파일은 `.mdx` / `.md` 둘 다 인식하고, 파일명이 마지막 URL 세그먼트가 됩니다.
- `_` 또는 `.`로 시작하는 파일·디렉터리는 무시합니다. (초안은 `_draft.mdx`처럼)
- 디렉터리 이름은 URL에 그대로 들어가므로 **영문 kebab-case**를 권장하고,
  한글 이름은 `_category.json`의 `label`로 지정합니다.

## `_category.json`

```json
{ "label": "성능 최적화", "order": 1, "description": "카테고리 페이지 상단 설명" }
```

- `label` — 사이드바/브레드크럼 표시 이름 (없으면 디렉터리 이름)
- `order` — 같은 depth 안에서의 정렬 순서 (없으면 라벨 가나다순)
- `description` — 카테고리 페이지 설명 (선택)

## 글 프론트매터

```yaml
---
title: "제목"
date: "2026-07-10"
description: "목록/메타 설명"
tags: ["Next.js", "Performance"]
---
```

본문의 `##`~`####` 헤딩은 자동으로 id가 붙어 우측 목차(TOC)로 노출됩니다.
