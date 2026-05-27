/**
 * MOCK: 고객 Requirement에서 UI/UX 관련 요구사항만 필터링한 1페이지 요약.
 * intent.domain 기반으로 도메인 특화 요구사항 포함.
 */

import type { SkillRunInput } from "../../_runtime/types";
import { getDomainProfile } from "../../_runtime/domain-profiles";

export function buildUiUxRequirementExtract(input: SkillRunInput): string {
  const intent = input.context?.intent;
  const profile = getDomainProfile(intent?.domain);
  const userPrompt = input.prompt?.trim() ?? "";

  return `# UI/UX Requirement Summary — ${profile.label}

> 원본 요청: "${userPrompt.length > 100 ? userPrompt.slice(0, 100) + "…" : userPrompt}"
> 필터링 대상: UI/UX 관련 항목만 (백엔드·인프라 제외)

## Context
- **도메인**: ${profile.id === "unknown" ? "⚠️ 미지정 — 일반 SaaS" : profile.label}
- **톤**: ${profile.toneDescriptors.join(" · ")}
- **제품 유형**: ${intent?.productType ?? "unknown"}
- **브랜드 정체성**: ${profile.brandShort}

## Goal
UI/UX 작업 범위 (다음 단계로 넘길 인풋):
- 디자인 시스템 토큰 정의
- 도메인 특화 컴포넌트 식별
- 핵심 화면 와이어프레임
- 사용자 플로우 정의
- Information Architecture
- Figma 핸드오프 문서

## Key Points (UI/UX 한정)
${profile.personas
  .slice(0, 2)
  .map(
    (p, i) =>
      `- 핵심 사용자 ${i + 1}: **${p.role}** — ${p.goal}`,
  )
  .join("\n")}
- 핵심 컴포넌트 후보: ${profile.domainComponents.slice(0, 3).map((c) => c.name).join(", ")}
- 핵심 화면 후보: ${profile.sampleScreens.map((s) => s.name).join(", ")}
- 모션 가이드: ${profile.motionGuide}

## Risks (UI/UX 한정)
- 사용자 도메인 컨텍스트가 다른 카탈로그로 덮어쓰일 수 있음 (도메인 보존 규칙으로 방지)
- 도메인 특화 컴포넌트가 일반 컴포넌트로 단순화될 위험
${intent?.unknowns && intent.unknowns.length > 0 ? `- 정보 누락: ${intent.unknowns.slice(0, 3).join(", ")}` : ""}

## Next Steps
1. \`ui-element-extract\` 스킬에 디자인 시스템 + 본 요약 전달
2. \`ux-process-define\` 스킬에 본 요약 + UX 어셋 전달
3. 최종 \`handoff-merge\` 스킬에서 UI/UX 트랙 합쳐 마스터 핸드오프 생성
`;
}
