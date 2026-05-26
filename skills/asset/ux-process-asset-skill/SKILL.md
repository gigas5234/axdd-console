# UX Process Asset

UX 작업 단위에 필요한 프로세스/룰/체크리스트/예시 풀셋을 **사용자 도메인에 맞춰** 적용한다.

## 🛡 도메인 보존 규칙
- 페르소나는 도메인 특화로 작성 (헬스케어 → 환자/보호자/의료진 / 핀테크 → 송금자/자산관리자/KYC 등)
- User Flow는 도메인 핵심 시나리오를 반영
- 일반론 UX 프로세스만 나열하지 말 것 — 사용자 요청 도메인 컨텍스트가 모든 단계에 등장해야 함

## Input
- `raw_requirement.md`
- `context.intent` (Pipeline 주입)

## Output
- `ux_process_plan.md` — Double Diamond 5주 플랜 + 도메인 특화 페르소나·플로우

## Asset Pack
- `assets/ux-checklist.md` — UX 단계별 체크리스트
- `assets/ux-examples.md` — 모범 사례 라이브러리
- `assets/ux-summary.md` — 한 페이지 정리 가이드

## How it works
1. 요구사항 분석 + intent.domain 확인
2. UX 단계(Discover → Define → Design → Validate)별 액션 분류
3. 도메인 특화 페르소나 3개 + 핵심 User Flow 2개 작성
4. 단계별 산출물 정의
