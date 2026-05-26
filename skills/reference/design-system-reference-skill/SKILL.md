# Design System Reference

고객사 디자인 시스템 MD를 참고해 **사용자 요청 도메인에 맞는** UI Foundation 문서를 만든다.

## 🛡 도메인 보존 규칙
- 토큰 색상은 사용자 도메인 톤에 맞춰 선택 (헬스케어 → 청록, 핀테크 → 짙은 청·골드 등)
- 다른 도메인의 토큰을 그대로 가져다 쓰지 말 것
- 임의 hex 값은 토큰 정의 없이 산출물에 박지 말 것

## When to Use
- 신규 프로젝트 UI Foundation 정의 시
- 디자인 시스템 토큰을 도메인 톤에 맞춰 일관 적용해야 할 때

## Input
- `design-system-reference.md`
- `requirements.md`
- `context.intent` (Pipeline 주입)

## Output
- `ui_foundation.md` — Tokens / Type / Color / Spacing / Component 매핑 (도메인 톤 반영)

## References
- `references/design-system.md`
- `references/brand-tokens.json`
- 도메인별 색상 가이드: `skills/_runtime/domain-profiles.ts`
