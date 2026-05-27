/**
 * Phase 7 Cleanup: Sandbox 산출물 미리보기 폴백.
 *
 * Sandbox mock 실행이 제거되어 이 모듈도 단순 stub.
 * UI가 import만 유지하기 위해 남겨둠.
 */

export const SAMPLE_OUTPUT_FALLBACK =
  "이 콘솔은 AxDD-SKILLS 호환 export 도구입니다. Mock 실행은 제공하지 않으며, 생성된 zip을 Claude Code 또는 Cursor에서 직접 실행하세요.";

export function getSampleOutput(_workUnitId: string): string {
  return SAMPLE_OUTPUT_FALLBACK;
}
