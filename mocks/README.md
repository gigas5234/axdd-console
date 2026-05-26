# `mocks/` — MVP 가짜 데이터·동작 격리 영역

이 디렉터리에는 **MVP 데모용 가짜 데이터와 가짜 실행 로직**이 모여 있습니다.
CLAUDE.md §17 ("MVP 단계에서는 실제 LLM/API/GitHub/Figma 연동 금지")에 따라
실제 백엔드가 붙기 전까지의 임시 구현입니다.

## 구성

| 파일 | 무엇이 가짜인가 | 누가 쓰는가 |
|---|---|---|
| `sample-outputs.ts` | Sandbox에서 실제 LLM 대신 보여줄 산출물 마크다운 | `components/sandbox/prompt-runner.tsx` |
| `execution.ts` | `setTimeout` 기반 가짜 step-by-step 실행기 | `components/sandbox/prompt-runner.tsx` |
| `validation.ts` | 항상 `passed` + 고정 이슈 3건을 반환하는 가짜 검증 | `components/sandbox/prompt-runner.tsx` |
| `integrations.ts` | Overview 우측의 GitHub/Vercel/Miro/Figma 연결 상태 (정적) | `app/page.tsx` |
| `risks.ts` | Governance Risk Log 고정 3건 | `app/governance/page.tsx` |
| `decisions.ts` | Governance Decision Log 고정 3건 | `app/governance/page.tsx` |
| `docs.ts` | Docs 페이지 카드 정적 목록 | `app/docs/page.tsx` |
| `index.ts` | 위 항목 재수출 + `IS_MOCK` 플래그 | 모든 호출지 |

### `data/*.json`은 왜 여기에 없나
`data/skills.catalog.json` / `work-units.json` / `hooks.json` / `assets.json` /
`runs.json`은 **시드 카탈로그**로 분류했습니다 — 실제 백엔드가 붙어도 동일한
스키마를 따르므로, "지금은 정적 JSON, 나중에는 API에서 같은 모양으로 받음"으로
정리하는 게 자연스럽습니다. 접근은 모두 `lib/data.ts` 한 곳을 거치므로
이 파일을 `fetch()` 기반으로 바꾸기만 하면 됩니다.

## 실제 백엔드로 교체할 때 체크리스트

전체 코드에서 마커로 한 번에 찾을 수 있습니다.

```bash
# 가짜 데이터/동작 호출지 전부 찾기
grep -rn "MOCK:" app components lib
```

각 호출지에서 다음 순서로 교체하세요.

1. **`mocks/execution.ts` → 진짜 LLM 호출**
   - `simulateRun()` 자리에 Anthropic API / 자체 LLM 호출 삽입
   - 스킬 카테고리별 system prompt 라우팅 추가

2. **`mocks/validation.ts` → 진짜 Validation Skill 실행**
   - `runValidation()`을 `output-validation-skill` 실행 결과로 교체

3. **`mocks/sample-outputs.ts` → 동적 생성 결과 사용**
   - 더 이상 필요 없음. `SAMPLE_OUTPUT` 임포트 제거

4. **`mocks/integrations.ts` → 실시간 연결 상태 조회**
   - GitHub: `gh auth status`, Vercel: API token check,
     Figma MCP: `figmaMcpAdapter.isAvailable()` 등 실시간 확인

5. **`mocks/risks.ts` / `mocks/decisions.ts` / `mocks/docs.ts`**
   - JSON 파일 또는 Notion/Linear 등 외부 시스템 연동으로 교체

6. **`lib/data.ts`** — JSON 임포트를 `fetch('/api/skills')` 등으로 교체

7. **`mocks/` 디렉터리 통째로 삭제 가능 시점**
   - `grep -rn "MOCK:" app components lib`이 0건이 될 때
   - `grep -rn "from \"@/mocks" app components lib`이 0건이 될 때

## 규칙

- **새 가짜 데이터·동작이 필요해지면 반드시 `mocks/`에 만들고 `// MOCK:` 주석으로 마킹.**
- 컴포넌트 파일 안에 인라인으로 두지 말 것.
- `mocks/`는 production 번들에 포함되어도 무해하지만 (정적 데이터), 정리 시점에는 통째로 삭제하는 게 목표.
