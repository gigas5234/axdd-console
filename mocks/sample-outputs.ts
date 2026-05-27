/**
 * MOCK: Sandbox 산출물 미리보기용 fallback.
 *
 * Phase 5 atomic skill 재구성 후, 모든 워크유닛 mock은 **스킬별 동적 함수**로 처리된다.
 * 이 파일은 단순 폴백/legacy 호환용 — 사용자 프롬프트가 없거나 워크유닛에 매핑된
 * 스킬이 실행되지 않을 때만 표시된다.
 *
 * @see mocks/README.md
 * @see skills/fullstep/handoff-merge-skill/mock-output.ts (UX/UI 워크유닛 마스터 출력)
 */

export const SAMPLE_OUTPUT_BY_WORKUNIT: Record<string, string> = {
  "kickoff-report-workunit": `# 착수보고서 (generic 폴백)
사용자 프롬프트 없이 직접 sample-outputs를 호출한 경우 표시되는 기본 보고서.
정상 실행 시 \`skills/template/kickoff-report-template-skill/mock-output.ts\`의 \`buildKickoffReport\`가 사용자 도메인을 반영해 동적으로 생성합니다.`,

  "ux-ui-planning-workunit": `# UX/UI 마스터 핸드오프 (generic 폴백)
사용자 프롬프트 없이 직접 sample-outputs를 호출한 경우 표시되는 기본 안내.
정상 실행 시 10개 atomic skill (ui-ux-requirement-extract → … → handoff-merge → figma-prompt-build) 이 순차 실행되며,
각 스킬의 동적 mock이 사용자 도메인(헬스케어/핀테크/이커머스/어드민/SaaS)을 반영해 생성합니다.`,

  "cicd-setup-workunit": `# CI/CD Plan (generic 폴백)
사용자 프롬프트 없이 직접 sample-outputs를 호출한 경우 표시되는 기본 가이드.
정상 실행 시 각 스킬의 동적 mock이 도메인 컨텍스트를 반영해 생성합니다.`,
};

export const SAMPLE_OUTPUT_FALLBACK =
  "샘플 산출물이 등록돼 있지 않습니다. (mocks/sample-outputs.ts) — 정상 실행은 스킬별 동적 mock을 사용합니다.";

export function getSampleOutput(workUnitId: string): string {
  return SAMPLE_OUTPUT_BY_WORKUNIT[workUnitId] ?? SAMPLE_OUTPUT_FALLBACK;
}
