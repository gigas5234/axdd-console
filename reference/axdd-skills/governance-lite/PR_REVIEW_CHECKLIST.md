# PR Review Checklist — AXE Harness

- [ ] pack.yaml 또는 workunit.yaml 필수 필드 존재
- [ ] instruction.md에 역할 책임·비책임 범위
- [ ] workflow.md 실제 수행 순서
- [ ] Work Unit이 Role Pack 복사 없이 참조만
- [ ] requiredArtifacts·closureCriteria 정의
- [ ] template에 Open Questions / Decision Needed
- [ ] SKILL.md name·description
- [ ] handoff required_sections
- [ ] 외부 MCP/Plugin·외부 URL fetch 없음 (1차)
- [ ] secret/token/credential 미포함
- [ ] `python axe-harness/scripts/axe_check.py` 통과
