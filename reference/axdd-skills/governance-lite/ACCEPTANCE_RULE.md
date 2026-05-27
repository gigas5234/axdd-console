# Acceptance Rule

## Pack / Work Unit

| 상태 | 조건 |
|------|------|
| Draft | pack.yaml 또는 workunit.yaml 존재 |
| Accepted | `axe_check.py` 통과 + ToyProject 1회 Run + Reviewer 승인 |

## Skill

- `validate-skill` 통과
- Role Owner 또는 Solution Pack Owner 리뷰

## 자동화 한계

Scorecard(정성 평가)는 수동. `axe_check.py`는 누락·형식·명백한 secret만 검출.
