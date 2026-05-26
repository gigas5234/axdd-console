/**
 * 모든 runner.ts에서 공통으로 쓰는 유틸리티.
 *
 * - `withLlmOrMock`: LLM 키가 있으면 진짜 호출, 없으면 mock 출력 사용
 *
 * **외부 alias(@/...) 의존성 없음** — Bundle export 시 그대로 동작.
 */

import { callLlm, isLlmAvailable } from "./llm-client";
import type {
  SkillPromptTemplate,
  SkillRunInput,
  SkillRunOutput,
} from "./types";

export interface MockFallback {
  /** 입력 프롬프트 기반으로 mock을 동적 생성 (권장) */
  buildMock?: (input: SkillRunInput) => string;
  /** 정적 mock 문자열 */
  markdown?: string;
  /**
   * 워크유닛 ID로 sample-outputs에서 폴백 (레거시 — 거의 사용 안 함).
   * Bundle 환경에서는 외부 sample-outputs를 import할 수 없으므로
   * 호출 측에서 직접 markdown 또는 buildMock을 지정하는 것을 권장한다.
   */
  workUnitId?: string;
}

const GENERIC_FALLBACK = `# Generic Fallback Output
LLM이 비활성이고 buildMock·markdown도 지정되지 않은 스킬입니다.
\`mock-output.ts\`에서 buildMock 함수를 정의해주세요.`;

export async function withLlmOrMock(
  template: SkillPromptTemplate,
  input: SkillRunInput,
  mockFallback: MockFallback,
): Promise<SkillRunOutput> {
  if (!isLlmAvailable()) {
    let markdown: string;
    if (mockFallback.buildMock) {
      markdown = mockFallback.buildMock(input);
    } else if (mockFallback.markdown) {
      markdown = mockFallback.markdown;
    } else {
      markdown = GENERIC_FALLBACK;
    }
    return { mode: "mock", markdown };
  }

  const { text, usage } = await callLlm(template, input);
  return {
    mode: "llm",
    markdown: text,
    usage,
  };
}
