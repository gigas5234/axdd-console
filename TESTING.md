# 실제 동작 테스트 가이드

이 콘솔은 **두 가지 모드**로 돌릴 수 있습니다.

| 모드 | 트리거 | 결과 |
|---|---|---|
| **LLM 모드** | `.env.local`의 `ANTHROPIC_API_KEY` 채움 | Sandbox에서 진짜 Claude 응답 |
| **Mock 모드** | 키 없음 (기본값) | 미리 준비된 designer-grade 샘플 출력 |

**서버 사이드에서 자동 감지**합니다. UI는 그대로, 키 유무만으로 동작이 바뀜.
출력 카드 헤더에 `LLM 실행` / `Mock 폴백 (키 없음)` 배지가 표시됩니다.

---

## 1. LLM 모드로 실제 응답 받기 (5분)

### 1) Anthropic API 키 발급
1. https://console.anthropic.com 가입/로그인
2. Settings → API Keys → Create Key
3. 키 복사 (`sk-ant-...`)
4. 비용: Claude Haiku는 백만 토큰당 $0.25 (입력) / $1.25 (출력) — 한 번 실행에 보통 1센트 미만

### 2) `.env.local` 생성
```powershell
# PowerShell
Copy-Item .env.local.example .env.local
notepad .env.local
```
```bash
# Bash
cp .env.local.example .env.local
```

`ANTHROPIC_API_KEY=` 뒤에 키를 붙여넣고 저장.

### 3) dev server 재시작 (env 반영을 위해 필수)
```powershell
# 기존 dev server 종료
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
# 재시작
npx next dev -p 3017
```

### 4) Sandbox에서 실행
1. http://localhost:3017/sandbox 열기
2. 프롬프트 입력 (예: "신규 SaaS 대시보드 UX 기획해서 핸드오프 문서까지 만들어줘")
3. **Run** 클릭
4. Output Preview 헤더에 **`LLM 실행`** 초록 배지가 뜨면 진짜 호출 성공
5. 산출물 마크다운에 매번 다른 내용이 나오면 정상

### 5) 결과 검증 체크포인트
| 항목 | 확인 방법 |
|---|---|
| LLM이 실제로 호출됐는가 | Output Preview 헤더 = "LLM 실행" |
| 비용이 얼마나 들었는가 | https://console.anthropic.com/usage |
| 응답 시간이 얼마나 걸렸는가 | 브라우저 DevTools → Network → `/api/run` |
| 어느 스킬이 실행됐는가 | `/api/run` 응답 JSON의 `steps[]` 배열 |

---

## 2. Mock 모드 (LLM 키 없이도 전체 흐름 검증)

키를 안 넣어도 모든 화면이 정상 동작합니다. UX/UI 핸드오프 산출물은 **designer-grade 샘플**이 들어 있어서 시각 검증용으로 충분합니다.

http://localhost:3017/sandbox 에서:
1. 프롬프트 입력 (예: "UX 기획해서 핸드오프 문서까지 만들어줘")
2. Run 클릭
3. Output Preview 헤더에 **`Mock 폴백 (키 없음)`** 황색 배지
4. 본문에 10섹션 마스터 핸드오프 문서가 표시됨

---

## 3. 워크유닛별 테스트 시나리오

| Work Unit | 트리거 키워드 | LLM 응답 시간 | 주요 검증 포인트 |
|---|---|---|---|
| **Kickoff Report** | "착수보고서" / "kickoff" / "프로젝트 시작" | ~8초 | 5섹션 표준 템플릿 모두 채워짐 |
| **UX/UI Planning** ⭐ | "UX 기획" / "IA" / "디자인 파운데이션" / "handoff" | ~20초 | 10섹션 핸드오프 (토큰 표 / 컴포넌트 스펙 / Figma 프롬프트) |
| **CI/CD Setup** | "CI/CD" / "배포 환경" / "Vercel" | ~10초 | GitHub Actions / Vercel / 릴리즈 체크리스트 |

⭐ **UX/UI Planning Work Unit**이 핵심 검증 대상입니다. 다음 항목이 모두 산출물에 있어야 합니다:
- [ ] Project Overview (성공 지표 3개)
- [ ] IA tree (코드블록)
- [ ] User Flow (state-based, 1~3개)
- [ ] Design Tokens (color/typography/spacing/radius 표)
- [ ] Component Spec (최소 5종 — Button/Card/Input/Modal/Toast)
- [ ] Sample Screens (3~5개 와이어프레임)
- [ ] Interaction & Motion 표
- [ ] Accessibility Checklist (WCAG 2.1 AA, 10개 이상)
- [ ] QA Matrix
- [ ] Figma AI Prompt (코드블록, 그대로 복사 가능)

---

## 4. API 직접 호출 (Postman / curl)

UI 없이 API만 테스트하고 싶다면:

```bash
curl -X POST http://localhost:3017/api/run \
  -H "content-type: application/json" \
  -d '{
    "workUnitId": "ux-ui-planning-workunit",
    "prompt": "신규 헬스케어 SaaS의 환자 대시보드를 기획해줘. 데스크탑 우선, 차분한 톤."
  }'
```

응답 JSON 구조:
```json
{
  "mode": "llm" | "mock",
  "workUnit": { "id": "...", "name": "..." },
  "steps": [
    {
      "skillId": "simple-summary-skill",
      "status": "passed",
      "mode": "llm",
      "durationMs": 4231,
      "markdown": "...",
      "usage": { "inputTokens": 412, "outputTokens": 287, "model": "claude-haiku-4-5-20251001" }
    },
    ...
  ],
  "finalMarkdown": "...",
  "totalDurationMs": 18753
}
```

---

## 5. Figma 듀얼 트랙 테스트

산출물이 생성되면 우측 하단에 두 개의 카드가 표시됩니다.

### Track A: Figma AI 프롬프트 복사 (항상 동작)
1. **프롬프트 복사** 버튼 클릭
2. 클립보드에 자동 복사
3. Figma 열기 → 우측 사이드바의 AI / First Draft / Make Designs 패널
4. 붙여넣기
5. Figma가 화면 셋을 생성

### Track B: Figma MCP 직접 (조건부)
- 기본은 `blocked` 표시 (회사 보안정책)
- 풀리면 `.env.local`에 `NEXT_PUBLIC_FIGMA_MCP_ENABLED=1` 추가 + MCP 트랜스포트 wiring
- 활성화 후 카드 색이 초록으로 변하고 버튼이 활성화됨

---

## 6. 트러블슈팅

### "LLM 실행" 배지가 안 뜨고 항상 "Mock 폴백"
- `.env.local` 파일 경로 확인 (`D:\Src\axdd_console\.env.local`)
- 변수명 정확히: `ANTHROPIC_API_KEY=sk-ant-...` (공백/따옴표 없음)
- **dev server 재시작 필수** — Next.js는 env 파일을 시작 시점에만 읽음

### Anthropic 401 에러
- 키가 만료됐거나 잘못 복사된 것
- console.anthropic.com에서 새 키 발급

### Output에 한국어가 깨짐
- 브라우저는 정상, 터미널만 깨질 수 있음
- VS Code 또는 브라우저 DevTools로 확인

### 페이지 404 (`main-app.js` 등 청크 missing)
- `.next` 폴더 캐시 충돌
- `Remove-Item -Recurse -Force .next` 후 dev server 재시작
