# UX/UI Handoff Full-step

레퍼런스 + 스크립트 + 어셋을 통합해 UX/UI 핸드오프 산출물을 만든다.
**이 스킬이 디자이너 향 핵심 산출물을 책임진다.**

## 🛡 최우선 규칙 — 도메인 보존

사용자 요청의 도메인·제품 유형·타깃 사용자·톤앤매너를 **모든 산출물에서 일관되게 유지하라.**

### 금지 사항
- 내부 예시(다른 워크유닛 / 카탈로그 / 콘솔 데모 등)의 컨텍스트를 산출물에 가져오지 말 것
- 사용자가 요청한 도메인(예: 헬스케어)을 다른 도메인 예시(예: 일반 SaaS)로 바꾸지 말 것
- 사용자가 명시한 톤(차분/엔터프라이즈 등)을 무시하지 말 것

### 도메인별 작성 기준
- **헬스케어**: 환자/보호자/의료진 페르소나 / 진료·복약·검사 시나리오 / 청록 신뢰감 톤
- **핀테크**: 송금자/자산관리자/KYC 페르소나 / 송금·포트폴리오 시나리오 / 짙은 청·골드 톤
- **이커머스**: MZ쇼퍼/비교형/셀러 페르소나 / 발견·장바구니·결제 시나리오 / 코랄·임팩트 톤
- **어드민**: 데이터분석가/운영자/관리자 페르소나 / 테이블·필터·일괄액션 시나리오 / 청·슬레이트 톤
- **미지정**: 일반 SaaS 톤으로 작성하되 산출물에 "도메인 확인 필요" 메모 남길 것

## When to Use
- 기획 단계가 끝나고 디자이너에게 인수인계할 때
- Figma 작업 직전 디자인 파운데이션이 필요할 때
- 개발자에게 컴포넌트 스펙을 정확히 전달해야 할 때

## Input
- `requirement_summary.md` — 요구사항 요약
- `design-system-reference.md` — (옵션) 디자인 시스템 레퍼런스
- `ux_process_plan.md` — (옵션) UX 프로세스 플랜
- `context.intent` — Pipeline에서 자동 주입되는 의도 객체 (domain/tone/scope/unknowns)

## Output
- `handoff.md` — **마스터 핸드오프 문서** (10개 섹션)
- `ui_foundation.md` — UI 토큰 정의 (도메인 톤 반영)
- `ia.md` — Information Architecture (도메인 특화 경로)

## Master Output 구조 (10 sections, 도메인 일관 유지)
1. **Project Overview** — 도메인 명시 / 핵심 사용자 / 성공 지표
2. **Information Architecture** — 도메인 특화 라우트 트리
3. **User Flow** — 도메인 핵심 시나리오 2~3개
4. **Design Tokens** — 도메인 톤에 맞춘 color/typography/spacing/radius/shadow/motion
5. **Component Spec** — 공통 5종 + **도메인 특화 컴포넌트 3종 이상**
6. **Sample Screens** — 도메인 화면 3~5개 (ASCII 와이어프레임)
7. **Interaction & Motion Spec** — 도메인 인터랙션
8. **Accessibility Checklist** — WCAG 2.1 AA + 도메인 특화 항목
9. **QA Matrix** — browser × breakpoint
10. **Figma AI Prompt** — 도메인 화면 생성 프롬프트 (그대로 복사 가능)

## References
- `references/design-system.md`
- 도메인 프로필: `skills/_runtime/domain-profiles.ts` (5개 도메인 + generic)

## Scripts
- `scripts/extract_components.py` — 산출물에서 컴포넌트 명세만 추출

## Tests
- `tests/handoff-completeness-check.md` — 10개 섹션 + 도메인 fit 검증
- 자동 검증: `output-validation-skill`이 도메인 키워드 등장 ≥ 5회, 다른 도메인 누출 ≤ 2회 체크

## Validation 기준 (의미 검증)
- ✅ 사용자 요청 도메인 키워드가 산출물 본문에 5회 이상 등장
- ✅ 다른 도메인(헬스케어 요청인데 핀테크 키워드 등) 누출 ≤ 2회
- ✅ 산출물 상단에 도메인 명시
- ❌ 도메인 미지정 시 → 휴먼 리뷰 필수
