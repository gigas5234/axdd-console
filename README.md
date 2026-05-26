# AXDD SkillOps Console

> 자연어 한 줄로 디자이너·기획자가 함께 쓸 산출물을 만들고, **Claude Code 호환 zip**으로 묶어 어디서든 재실행 가능하게 하는 운영 콘솔.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Anthropic Skills](https://img.shields.io/badge/Anthropic_Skills-Compatible-d4a373)](https://docs.anthropic.com/)

---

## 한 줄 사용 예

```
"신규 헬스케어 SaaS 환자 대시보드 기획해서 핸드오프 문서까지 만들어줘"
```

→ 5단계 스킬 체인 자동 실행 → 디자이너용 마스터 핸드오프 (10섹션) + Figma 프롬프트 → **Claude Code 표준 zip** 다운로드 → `~/.claude/skills/`에 풀어 어디서든 재실행.

## 핵심 가치

- 🛡 **도메인 보존** — 사용자 요청 도메인(헬스케어/핀테크/이커머스/어드민/SaaS)을 모든 산출물에 일관 유지. 실측 누출 0~3회.
- 🧠 **Intent 분리** — domain · productType · tone · scope · unknowns로 의도 분해. SaaS는 productType이지 도메인이 아님.
- 🪝 **3단계 Hook fallback** — 키워드 매칭 → intent.scope → intent.domain. "디자인해줘"도 매칭됨.
- 📦 **Anthropic Skills 표준 Bundle** — SKILL.md frontmatter + references/scripts/assets/tests/examples. Claude Code에 그대로 풀어 사용.
- 🎨 **5개 도메인 프로필** — 각각 색 토큰·페르소나·플로우·컴포넌트·a11y 명세 완비.
- ✅ **4-state Validation** — passed / passed-with-review / needs-review / failed. 의미 검증(도메인 fit) 포함.

## Quick Start

```bash
npm install
npm run dev
```

http://localhost:3000 (또는 다른 포트) 접속.

### LLM 활성화 (선택)
```bash
cp .env.local.example .env.local
# ANTHROPIC_API_KEY=sk-ant-... 채우기
npm run dev
```

키가 없어도 mock 모드로 완전 동작. 키가 있으면 자동 LLM 전환.

## 페이지

| 경로 | 역할 |
|---|---|
| `/` Overview | KPI · Architecture Status · Activity Feed |
| `/skills` Skill Library | 8개 카테고리 스킬 카드 + SKILL.md export |
| `/work-units` Work Units | 스킬 체인 다이어그램 + Bundle zip 다운로드 |
| **`/sandbox` Sandbox** ⭐ | 프롬프트 → Intent → Hook → 실행 → 산출물 → Bundle |
| `/assets` Assets | 자산 레포지토리 |
| `/governance` Governance | Release Pipeline + Domain Fit 통계 |
| `/docs` Docs | 6개 문서 (Architecture · Install · Standard Kit · Agent · Playbook · WBS) |

## 폴더 구조

```
app/                    Next.js App Router (페이지 + API)
components/             UI 컴포넌트
data/                   시드 카탈로그 (skills/work-units/hooks/assets/runs)
mocks/                  MVP 가짜 데이터·동작 (// MOCK: 마커로 추적)
skills/
├── _runtime/           ← 시스템 두뇌 (intent/clarifying/domain-profiles/system-rules/...)
└── <category>/<id>/    ← 개별 스킬 (SKILL.md + prompt.ts + runner.ts + mock-output.ts)
lib/
├── hook-router/        ← 3단계 라우터
├── workunit-bundle.ts  ← Anthropic Skills 표준 zip 빌더
└── figma/              ← Figma 듀얼 트랙 어댑터
```

## Bundle 사용 — Claude Code 설치

Sandbox 또는 Work Units 탭에서 Bundle zip 다운로드 후:

```bash
cp -r ux-ui-planning-workunit/ ~/.claude/skills/
```

Claude Code가 SKILL.md frontmatter(`name`, `description`)로 자동 트리거 매칭.

자세한 설치 가이드는 [`/docs` → Claude Code Install Guide](http://localhost:3000/docs) 참조.

## 문서

| 위치 | 내용 |
|---|---|
| [`설명.md`](설명.md) | 콘솔 사용자 설명서 (Sandbox 중심 상세) |
| [`CLAUDE.md`](CLAUDE.md) | 시스템 빌드 사양 + §20~ 현재 아키텍처 |
| [`TESTING.md`](TESTING.md) | LLM 활성화 테스트 가이드 |
| 콘솔 내부 `/docs` 탭 | 6종 가이드 (Architecture · Install · Standard Kit · 등) |

## 기술 스택

- **Next.js 14** App Router + Server Components
- **TypeScript** strict
- **Tailwind CSS 3** + 직접 구현한 shadcn/ui 패턴
- **React Flow** — 스킬 체인 시각화
- **react-markdown + remark-gfm** — 표·코드블록 정확 렌더링
- **JSZip** — 클라이언트·서버 양쪽 zip 생성
- **Lucide React** — 아이콘
- Anthropic SDK 의존성 0 (fetch only)

## 검증된 도메인 시나리오

| 입력 | Intent | 도메인 키워드 | 누출 |
|---|---|---|---|
| 신규 헬스케어 SaaS 환자 대시보드 | 헬스케어 + saas | 107회 | 0회 |
| 패션 이커머스 MZ 타겟 | 이커머스 + mobile-app | 119회 | 2회 |
| 핀테크 KYC + 송금 | 핀테크 + saas | 113회 | 2회 |
| 엔터프라이즈 어드민 | 어드민 + admin | 66회 | 1회 |
| "디자인해줘" (모호) | unknown | — | 차단 (Clarifying) |
| "강아지 사료" (무관) | unknown | — | 차단 (NoMatch) |

## 한계 및 추후 작업

현재는 **mock 모드**로 동작 — LLM 미연결.
인프라는 완비되어 있어 `ANTHROPIC_API_KEY` 환경변수만 추가하면 자동 LLM 전환.

다음 단계:
1. Anthropic API 연결
2. 데이터 영속화 (Supabase / Postgres)
3. 인증 (NextAuth, 3개 역할)
4. 작업 큐 (긴 LLM 체인 비동기)
5. 도메인 확장 (교육·엔터·부동산 등)
6. Figma MCP wiring (보안정책 해제 시)
7. 관찰성 (Sentry · Langfuse)

상세는 [`설명.md`](설명.md#8-추후-작업--phase-6-production) 참조.

## 라이선스

별도 명시 시까지 비공개.

---

**더 자세한 사용법·아키텍처·확장 가이드는 [`설명.md`](설명.md)를 보세요.**
