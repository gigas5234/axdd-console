/**
 * MOCK: Sandbox 산출물 미리보기용 fallback.
 *
 * 모든 워크유닛 mock은 이제 **스킬별 동적 함수**로 처리되므로 이 파일은
 * 단순 폴백/legacy 호환용. ENHANCED_UX_UI_HANDOFF_MOCK도 동적 함수에서 생성됨.
 *
 * @see mocks/README.md
 * @see skills/fullstep/ux-ui-handoff-fullstep-skill/mock-output.ts
 */

import { ENHANCED_UX_UI_HANDOFF_MOCK } from "@/skills/fullstep/ux-ui-handoff-fullstep-skill/mock-output";

export const SAMPLE_OUTPUT_BY_WORKUNIT: Record<string, string> = {
  "kickoff-report-workunit": `# 착수보고서 (generic 폴백)
사용자 프롬프트 없이 직접 sample-outputs를 호출한 경우 표시되는 기본 보고서.
정상 실행 시 \`skills/template/kickoff-report-template-skill/mock-output.ts\`의 \`buildKickoffReport\`가 사용자 도메인을 반영해 동적으로 생성합니다.`,

  "ux-ui-planning-workunit": ENHANCED_UX_UI_HANDOFF_MOCK,

  "cicd-setup-workunit": `# CI/CD Plan (generic 폴백)
사용자 프롬프트 없이 직접 sample-outputs를 호출한 경우 표시되는 기본 가이드.
정상 실행 시 각 스킬의 동적 mock이 도메인 컨텍스트를 반영해 생성합니다.`,
};

export const SAMPLE_OUTPUT_FALLBACK =
  "샘플 산출물이 등록돼 있지 않습니다. (mocks/sample-outputs.ts) — 정상 실행은 스킬별 동적 mock을 사용합니다.";

export function getSampleOutput(workUnitId: string): string {
  return SAMPLE_OUTPUT_BY_WORKUNIT[workUnitId] ?? SAMPLE_OUTPUT_FALLBACK;
}
