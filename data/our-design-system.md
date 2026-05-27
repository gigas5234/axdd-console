<!--
  AXDD Design System Catalog (v0 — Scaffold)

  이 파일은 AXDD 자체 디자인 시스템의 카탈로그입니다.
  모든 UX/UI 스킬이 이 파일을 "고정 자산"으로 참조합니다.

  현재 상태: SCAFFOLD (실제 자료 미입력 — 디자인팀 확인 필요)

  채우는 방법:
   A. 직접 이 파일 편집 → 토큰·컴포넌트 목록을 아래 양식대로 채움
   B. 콘솔 UI(/assets)에서 "AXDD DS 업로드" 카드를 통해 MD 업로드
   C. design-system-bootstrap-workunit 실행 → 산출물을 이 파일에 덮어쓰기

  비어있는 동안 모든 UX/UI 워크유닛은 사용자에게
  "DS Bootstrap 워크유닛을 먼저 실행하세요" 안내를 표시합니다.
-->

# AXDD Design System Catalog

> **상태**: `scaffold` — 디자인팀에서 실제 자료를 채워 넣어야 합니다.
> **마지막 업데이트**: (미입력)
> **버전**: v0.0.0 (Bootstrap 대기)

---

## 1. Brand

- **프로젝트명**: AXDD (AI eXperience Development Division — 또는 팀 공식 풀네임)
- **톤 키워드**: <!-- TODO: 디자인팀 확인 필요 (예: 신뢰·전문·효율) -->
- **타깃 사용자**: 사내 디자이너 · 프론트엔드 · PM · 운영

---

## 2. Color Tokens

<!-- TODO: 디자인팀에서 토큰 값 채워주세요. 아래는 양식 예시. -->

| 토큰 이름 | Hex | 용도 |
|---|---|---|
| `color/brand/primary` | `#__TODO__` | 메인 브랜드 색 |
| `color/brand/accent` | `#__TODO__` | 강조 액션 |
| `color/surface/base` | `#__TODO__` | 표면 기본 배경 |
| `color/surface/elevated` | `#__TODO__` | 카드·모달 배경 |
| `color/ink/primary` | `#__TODO__` | 주요 텍스트 |
| `color/ink/secondary` | `#__TODO__` | 보조 텍스트 |
| `color/ink/disabled` | `#__TODO__` | 비활성 텍스트 |
| `color/border/default` | `#__TODO__` | 기본 보더 |
| `color/status/success` | `#__TODO__` | 성공 |
| `color/status/warning` | `#__TODO__` | 경고 |
| `color/status/error` | `#__TODO__` | 에러 |
| `color/status/info` | `#__TODO__` | 정보 |

---

## 3. Typography

<!-- TODO: 디자인팀에서 폰트 패밀리·크기·line-height 채워주세요. -->

| 스케일 | 크기 | Line-height | 용도 |
|---|---|---|---|
| `text/display` | `__TODO__` | `__TODO__` | 페이지 헤더 |
| `text/h1` | `__TODO__` | `__TODO__` | H1 |
| `text/h2` | `__TODO__` | `__TODO__` | H2 |
| `text/h3` | `__TODO__` | `__TODO__` | H3 |
| `text/body` | `__TODO__` | `__TODO__` | 본문 |
| `text/caption` | `__TODO__` | `__TODO__` | 캡션 |
| `text/code` | `__TODO__` | `__TODO__` | 코드 |

- **Font family (primary)**: <!-- TODO -->
- **Font family (mono)**: <!-- TODO -->

---

## 4. Spacing Scale (4의 배수)

<!-- TODO: 4의 배수 스케일 채워주세요. -->

| 토큰 | 값 (px) |
|---|---|
| `space/xs` | `4` |
| `space/sm` | `8` |
| `space/md` | `12` |
| `space/lg` | `16` |
| `space/xl` | `24` |
| `space/2xl` | `32` |
| `space/3xl` | `48` |

---

## 5. Radius / Shadow / Motion

<!-- TODO: 채워주세요. -->

| 카테고리 | 토큰 | 값 |
|---|---|---|
| Radius | `radius/sm` | `__TODO__` |
| Radius | `radius/md` | `__TODO__` |
| Radius | `radius/lg` | `__TODO__` |
| Shadow | `shadow/sm` | `__TODO__` |
| Shadow | `shadow/md` | `__TODO__` |
| Motion | `motion/fast` | `__TODO__` (예: 120ms ease-out) |
| Motion | `motion/normal` | `__TODO__` |

---

## 6. Component Catalog

<!-- TODO: 디자인팀에서 AXDD 공용 컴포넌트 목록 채워주세요. -->

### 6.1 공용 컴포넌트

| 이름 | 한 줄 설명 | Variants |
|---|---|---|
| Button | (TODO) | primary / secondary / ghost |
| Card | (TODO) | default / elevated / outlined |
| Input | (TODO) | text / number / search |
| Modal | (TODO) | sm / md / lg / full |
| Toast | (TODO) | success / warning / error / info |

### 6.2 AXDD 특화 컴포넌트

<!-- TODO: 사내 자체 컴포넌트가 있다면 추가 (예: ProjectKickoffCard, SkillFlowNode 등) -->

| 이름 | 한 줄 설명 | 사용 시점 |
|---|---|---|
| `__TODO__` | `__TODO__` | `__TODO__` |

---

## 7. Patterns

<!-- TODO: 자주 쓰는 패턴 (Empty State / Error State / Loading 등) -->

- Empty State: TODO
- Error State: TODO
- Loading State: TODO
- Confirm Dialog: TODO

---

## 8. A11y Baseline

<!-- TODO: 접근성 기준 명시 -->

- 색 대비: TODO (예: WCAG AA 4.5:1)
- 키보드 네비게이션: TODO
- 포커스 인디케이터: TODO

---

## 9. 출처

- **디자인 시스템 원본 URL** (Figma / Notion / Storybook): TODO
- **담당자**: TODO
- **검토 주기**: TODO

---

## Bootstrap Trigger

이 카탈로그가 비어있는 한 콘솔은 다음을 안내합니다:

> AXDD 디자인 시스템이 아직 정의되지 않았습니다.
> `design-system-bootstrap-workunit` 을 실행해 초안을 생성하거나,
> 이 파일을 직접 편집해 자료를 채워주세요.
