# Phase 7-G 작업 계획서 — 하네스 레이어 + DS Ingest Skill

> **작성일**: 2026-05-28
> **이전 결과**: Phase 7-F (zip 77KB / 48 파일 / scaffold 0 / axe_check 통과)
> **목표**: 자연어 요청 → 자동 라우팅 가능한 운영 하네스 추가 + DS Ingest Skill 신규

---

## 1. 사용자 평가 (현 상태)

| 항목 | 점수 | 목표 |
|---|---:|---:|
| 파일 구조 | 88 | 유지 |
| 스킬 본문 충실도 | 82 | 유지 |
| dependency 내용 | 80 | 85+ |
| workunit lite 검증 | 85 | 95+ |
| **에이전트 실행성** | **45** | **90+** ← 가장 큰 갭 |
| **디자인 시스템 적용성** | **60** | **88+** ← 보강 필요 |

## 2. 추가할 6개 산출물 (P0)

### G-1. `CLAUDE.md` (루트)
- Claude Code가 zip을 풀어 들어왔을 때 최초로 읽는 운영 규칙
- 자연어 요청 → CATALOG / routing-rules / SKILL.md 순으로 자동 라우팅
- 응답 protocol (Selected skill / Reason / Referenced files / Output)
- 자연어 예시 (사내 권한 승인 화면 / 장애 대시보드 / 운영팀 사용 등)

### G-2. `AGENTS.md` (루트)
- `axdd-ux-ui-router` 에이전트 정의
- available skills · workunit mode · agent contract
- "사용자는 skill 이름 몰라도 됨" 룰

### G-3. `.cursor/agents/axdd-ux-ui-router.md`
- Cursor 어댑터
- CLAUDE.md와 같은 라우팅 흐름 (Cursor 형식)

### G-4. `routing/routing-rules.md`
- intent → skill 매핑 (10+ 케이스)
- 트리거 키워드 + 라우팅 대상 skill

### G-5. `skills/design-system-ingest-skill/` 신규
- T2 Reference-heavy
- 인풋: 브랜드 가이드 / Figma library / token table / 기존 DS
- 출력: design_system_profile.md / design_tokens.json / tailwind_token_mapping.md / figma_variable_mapping.md / component_library_mapping.md
- 파일:
  ```
  skills/design-system-ingest-skill/
  ├── SKILL.md
  ├── references/
  │   ├── customer-design-system-template.md
  │   ├── token-naming-convention.md
  │   └── spacing-scale-guide.md
  ├── assets/
  │   ├── design-token-template.json
  │   ├── tailwind-token-mapping.md
  │   ├── figma-variable-mapping.md
  │   └── component-library-template.md
  └── tests/
      └── design-system-mapping-check.md
  ```

### G-6. `work-units/axdd-ux-ui-standard-kit/workunit.yaml` 갱신
- 10개 → 11개 skill (design-system-ingest-skill 3번째 위치)

## 3. P1 보강 (선택)

- README.md / CLAUDE.md에 자연어 사용 예시
- CATALOG.md에 design-system-ingest-skill 등재 (T2)

## 4. 작업 순서

```
Step 1. data/skills.catalog.json — design-system-ingest-skill 등재
        (콘솔이 Skill로 인식하면 자동으로 export에 포함됨)

Step 2. lib/uxui-content.ts — design-system-ingest 관련 assets 5종 추가
        (design-token-template.json / tailwind-token-mapping.md /
         figma-variable-mapping.md / component-library-template.md /
         design-system-mapping-check.md)

Step 3. lib/enterprise-export.ts:
        - buildClaudeMd() 신규
        - buildAgentsMd() 신규
        - buildCursorAgent() 신규
        - buildRoutingRules() 신규
        - 각 파일을 root에 zip 추가
        - workunit 기본 skill 목록에 design-system-ingest-skill 포함

Step 4. skills/reference/ 또는 simple/에 design-system-ingest-skill 폴더 + SKILL.md 생성
        (콘솔의 skill 등록 컨벤션에 맞춰)

Step 5. typecheck + build

Step 6. Enterprise zip 재생성 + 검증
        - 파일 목록 확인 (CLAUDE.md / AGENTS.md / .cursor/ / routing/ / design-system-ingest-skill/)
        - axe_check.py validate-skill: 11/11
        - validate-workunit --lite: 11 skills OK
        - scaffold 마커 0
        - quality-report 정상

Step 7. 사용자에게 zip 전달 — 로컬에서 테스트해 보고 OK 하면 푸시

Step 8. (OK 받은 후) git commit + push
```

## 5. Acceptance Criteria

- [ ] 루트에 CLAUDE.md 존재
- [ ] 루트에 AGENTS.md 존재
- [ ] .cursor/agents/axdd-ux-ui-router.md 존재
- [ ] routing/routing-rules.md 존재
- [ ] skills/design-system-ingest-skill/SKILL.md 존재 (+ references/assets/tests)
- [ ] workunit.yaml에 design-system-ingest-skill 포함 (11개 skill)
- [ ] CATALOG.md에 design-system-ingest-skill 등재 (T2 섹션)
- [ ] axe_check.py validate-skill: 11/11
- [ ] axe_check.py validate-workunit --lite: PASS
- [ ] scaffold 마커 0 (quality-report)
- [ ] typecheck + build 통과
- [ ] Standard Kit ZIP 회귀 OK
- [ ] **사용자 OK 후에만** commit + push

## 6. 변경 금지 사항

1. flat `skills/<skill-name>/` 구조 유지
2. 기존 10개 UX/UI atomic skill 보존
3. T1~T8 폴더 nesting 도입 금지
4. Standard Kit ZIP 동작 보존
5. Sandbox mock / preset / 4-Case 다시 도입 금지
6. **자동 푸시 금지 — 사용자 OK 후 commit + push**
