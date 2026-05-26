# Output Validation

산출물 누락, 템플릿 준수, 형식 일관성을 자동 검증한다.

## Input
- `output_bundle/` — 검증 대상 마크다운 파일들

## Output
- `validation_report.md` — 통과/실패 + 이슈 리스트

## Rules
- 필수 섹션 존재 여부
- 마크다운 표 구조 검증
- 토큰 이름 규칙 (kebab-case)
- 코드블록 언어 명시 여부
