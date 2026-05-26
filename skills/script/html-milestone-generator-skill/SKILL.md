# HTML Milestone Generator

WBS JSON을 받아 HTML 마일스톤 시각화를 생성한다.

## Input
- `wbs.json`

## Output
- `milestone.html`

## Scripts
- `scripts/render_milestone.py` — WBS → HTML 변환

## How it works
1. WBS JSON 받기
2. 각 Phase별 마일스톤 박스 생성
3. 의존성 화살표 그리기
4. HTML로 export
