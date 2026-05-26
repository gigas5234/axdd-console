# Simple Summary

원본 문서를 받아 한 페이지 분량의 요약 마크다운을 만든다.

## When to Use
- 긴 문서를 짧게 정리해 다른 스킬의 입력으로 넘기고 싶을 때
- 미팅/회의록을 일관된 포맷으로 요약하고 싶을 때

## Input
- `raw_document.md` — 요약할 원문

## Output
- `summary.md` — 5섹션 표준 요약

## How it works
1. 원문 받기
2. 5개 표준 섹션으로 분류 (Context / Goal / Key Points / Risks / Next Steps)
3. 각 섹션 3~5개 bullet로 정리

## Validation
- `tests/summary-length-check.md` — 5섹션이 모두 존재하는지 + 분량(< 1 page)
