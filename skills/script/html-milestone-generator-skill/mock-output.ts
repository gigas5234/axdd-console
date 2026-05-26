/**
 * MOCK: HTML Milestone 산출물 — WBS를 HTML 마일스톤 시각화 코드로.
 * 실제로는 milestone.html이지만 mock에서는 그 HTML 코드 자체를 마크다운 codeblock으로 보여준다.
 */

export const HTML_MILESTONE_MOCK = `# milestone.html — Project WBS Visualization

> 입력: \`wbs.json\`
> 산출: 인쇄 가능한 self-contained HTML 마일스톤 다이어그램

## 산출 코드 미리보기

\`\`\`html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>Project Milestone</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 32px; color: #0f1322; }
    h1 { font-size: 20px; margin: 0 0 16px; }
    .row { display: flex; gap: 12px; align-items: stretch; }
    .phase {
      flex: 1; border: 1px solid #d8dce8; border-radius: 12px;
      padding: 12px; background: #fff; min-height: 120px;
    }
    .phase h2 { font-size: 13px; margin: 0 0 6px; color: #5a647e; text-transform: uppercase; }
    .phase ul { padding-left: 18px; margin: 0; font-size: 12px; line-height: 1.6; }
    .arrow { display: flex; align-items: center; color: #b4bbcf; }
  </style>
</head>
<body>
  <h1>Project Milestone — 6 weeks</h1>
  <div class="row">
    <div class="phase">
      <h2>W1 · Discover</h2>
      <ul>
        <li>Stakeholder interviews</li>
        <li>Current UI audit</li>
        <li>Benchmark review</li>
      </ul>
    </div>
    <div class="arrow">→</div>
    <div class="phase">
      <h2>W2 · Define</h2>
      <ul>
        <li>Personas</li>
        <li>User flow</li>
        <li>IA</li>
      </ul>
    </div>
    <div class="arrow">→</div>
    <div class="phase">
      <h2>W3-4 · Design</h2>
      <ul>
        <li>UI Foundation</li>
        <li>Component spec</li>
        <li>Handoff doc</li>
      </ul>
    </div>
    <div class="arrow">→</div>
    <div class="phase">
      <h2>W5 · Build</h2>
      <ul>
        <li>MVP build</li>
        <li>Integration</li>
      </ul>
    </div>
    <div class="arrow">→</div>
    <div class="phase">
      <h2>W6 · Validate</h2>
      <ul>
        <li>Usability test</li>
        <li>Release candidate</li>
      </ul>
    </div>
  </div>
</body>
</html>
\`\`\`

## 사용법
1. 위 HTML을 \`milestone.html\` 로 저장
2. 브라우저에서 열기 — 인쇄 미리보기 (A4 landscape)
3. PDF로 export해 PMO에 공유
`;
