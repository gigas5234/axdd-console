/**
 * Intent Extraction — 자연어 프롬프트를 구조화된 의도 객체로 분해.
 *
 * ╔════════════════════════════════════════════════════════════════════╗
 * ║  설계 원칙                                                          ║
 * ║  ────────────────                                                  ║
 * ║  · 의도 "파악" 자체는 자연어 이해라 LLM이 유리하지만,               ║
 * ║    LLM 키 없을 때를 위해 휴리스틱 fallback 제공.                    ║
 * ║  · 의도가 파악된 후 "사용자에게 무엇을 추가로 물을지"는              ║
 * ║    clarifying.ts의 정적 카탈로그가 담당 (LLM 호출 없음).            ║
 * ║                                                                    ║
 * ║  교체 가이드                                                       ║
 * ║  ──────                                                            ║
 * ║  ANTHROPIC_API_KEY 도입 시 extractIntent() 안에서                  ║
 * ║  isLlmAvailable() 분기 → callLlm으로 구조화 JSON 응답 받기.         ║
 * ║  현재는 휴리스틱(키워드 기반)만 동작.                               ║
 * ╚════════════════════════════════════════════════════════════════════╝
 */

export type Domain =
  | "헬스케어"
  | "핀테크"
  | "이커머스"
  | "어드민"
  | "saas"
  | "교육"
  | "엔터테인먼트"
  | "unknown";

export type Tone =
  | "엔터프라이즈"
  | "MZ"
  | "미니멀"
  | "차분"
  | "활발"
  | "전문성"
  | "unknown";

export type UnknownField =
  | "domain"
  | "tone"
  | "timeline"
  | "team-size"
  | "existing-design-system"
  | "target-persona"
  | "scope-specifics"
  | "platform";

export interface IntentScope {
  needsRequirementSummary: boolean;
  needsIA: boolean;
  needsUserFlow: boolean;
  needsDesignSystem: boolean;
  needsComponentSpec: boolean;
  needsHandoff: boolean;
  needsKickoffReport: boolean;
  needsCICD: boolean;
}

/**
 * Product Type — 제품 유형 (도메인과 다름).
 *
 * SaaS / Mobile App / Web 같은 분류는 **제품 유형**이지 비즈니스 도메인이 아니다.
 * "헬스케어 SaaS"는 domain=헬스케어 + productType=saas로 분해된다.
 * 이렇게 분리해야 SaaS 키워드가 "도메인 누출"로 잘못 잡히지 않는다.
 */
export type ProductType =
  | "saas"
  | "mobile-app"
  | "web"
  | "desktop"
  | "admin"
  | "unknown";

export interface RunIntent {
  domain: Domain;
  /** 제품 유형 — 도메인과 별개. SaaS / Mobile / Web 등 */
  productType: ProductType;
  tone: Tone;
  scope: IntentScope;
  unknowns: UnknownField[];
  rawPrompt: string;
  /** 추출 신뢰도 0~1 — UI에서 clarifying 카드 표시 여부 결정 */
  confidence: number;
  /** "엔터프라이즈 어드민" 같은 도메인 키워드 원본 */
  detectedKeywords: string[];
  /** intent 추출에 사용된 모드 (LLM vs 휴리스틱) */
  mode: "llm" | "heuristic";
}

// ─── 도메인 / 톤 휴리스틱 매칭 사전 ─────────────────────────────────────

const DOMAIN_PATTERNS: { domain: Domain; patterns: RegExp[] }[] = [
  { domain: "헬스케어", patterns: [/헬스케어/, /환자/, /병원/, /의료/, /원무/] },
  {
    domain: "핀테크",
    patterns: [/핀테크/, /송금/, /결제/, /kyc/i, /카드/, /금융/, /적금|예금/],
  },
  {
    domain: "이커머스",
    patterns: [/이커머스/, /쇼핑/, /패션/, /커머스/, /상품/, /장바구니/],
  },
  {
    domain: "어드민",
    patterns: [/어드민/, /관리자/, /admin/i, /백오피스/, /b2b/i, /사내 *툴/],
  },
  { domain: "saas", patterns: [/saas/i, /구독/, /b2b *서비스/] },
  { domain: "교육", patterns: [/교육/, /학습/, /lms/i, /강의/, /수강/] },
  { domain: "엔터테인먼트", patterns: [/엔터/, /미디어/, /콘텐츠/, /streaming/i] },
];

const TONE_PATTERNS: { tone: Tone; patterns: RegExp[] }[] = [
  {
    tone: "엔터프라이즈",
    patterns: [/엔터프라이즈/, /enterprise/i, /업무용/, /효율/, /데이터.*테이블/],
  },
  { tone: "MZ", patterns: [/mz/i, /인스타그램/, /인스타/, /젊은/, /트렌디/] },
  { tone: "미니멀", patterns: [/미니멀/, /minimal/i, /깔끔/, /심플/] },
  { tone: "차분", patterns: [/차분/, /절제/, /고요/, /진지/] },
  { tone: "활발", patterns: [/활발/, /동적/, /역동적/, /신나는/] },
  { tone: "전문성", patterns: [/전문/, /신뢰/, /보수적/] },
];

const SCOPE_PATTERNS: {
  key: keyof IntentScope;
  patterns: RegExp[];
}[] = [
  {
    key: "needsRequirementSummary",
    patterns: [/요구사항/, /정리/, /요약/, /기획/],
  },
  { key: "needsIA", patterns: [/ia\b/i, /정보 *구조/, /information architecture/i] },
  {
    key: "needsUserFlow",
    patterns: [
      /사용자 *플로우|user *flow/i,
      /ux *흐름|ux *플로우/i,
      /유저 *흐름|유저 *플로우/,
      /화면 *흐름|화면 *전환/,
      /시나리오|사용자 *시나리오/,
    ],
  },
  {
    key: "needsDesignSystem",
    patterns: [
      /디자인 *시스템/,
      /design system/i,
      /토큰/,
      /파운데이션/,
      /foundation/i,
    ],
  },
  {
    key: "needsComponentSpec",
    patterns: [/컴포넌트/, /component/i, /button|card|input|modal/i],
  },
  {
    key: "needsHandoff",
    patterns: [/핸드오프/, /handoff/i, /figma/i, /개발자.*인수인계/],
  },
  {
    key: "needsKickoffReport",
    patterns: [/착수보고서/, /kickoff/i, /프로젝트.*시작/, /제안서/],
  },
  {
    key: "needsCICD",
    patterns: [/ci\/cd/i, /cicd/i, /배포/, /vercel/i, /github actions/i, /릴리즈/],
  },
];

// ─── 휴리스틱 추출 함수 ────────────────────────────────────────────────

/**
 * Product type 검출 — 도메인 검출과 독립적.
 * "헬스케어 SaaS"는 domain=헬스케어 + productType=saas로 분해된다.
 */
function detectProductType(p: string): ProductType {
  if (/saas/i.test(p)) return "saas";
  if (/(모바일 *앱|mobile *app|ios|android)/i.test(p)) return "mobile-app";
  if (/(데스크탑|desktop|electron)/i.test(p)) return "desktop";
  if (/(어드민|admin|백오피스|관리자 *콘솔)/i.test(p)) return "admin";
  if (/(웹 *서비스|web *app|웹사이트|website)/i.test(p)) return "web";
  return "unknown";
}

function detectDomain(p: string): { domain: Domain; matched: string | null } {
  for (const { domain, patterns } of DOMAIN_PATTERNS) {
    for (const re of patterns) {
      const m = p.match(re);
      if (m) return { domain, matched: m[0] };
    }
  }
  return { domain: "unknown", matched: null };
}

function detectTone(p: string): Tone {
  for (const { tone, patterns } of TONE_PATTERNS) {
    if (patterns.some((re) => re.test(p))) return tone;
  }
  return "unknown";
}

function detectScope(p: string): IntentScope {
  const scope: IntentScope = {
    needsRequirementSummary: false,
    needsIA: false,
    needsUserFlow: false,
    needsDesignSystem: false,
    needsComponentSpec: false,
    needsHandoff: false,
    needsKickoffReport: false,
    needsCICD: false,
  };
  for (const { key, patterns } of SCOPE_PATTERNS) {
    if (patterns.some((re) => re.test(p))) scope[key] = true;
  }
  return scope;
}

function detectUnknowns(
  prompt: string,
  domain: Domain,
  tone: Tone,
  scope: IntentScope,
): UnknownField[] {
  const unknowns: UnknownField[] = [];
  if (domain === "unknown") unknowns.push("domain");
  if (tone === "unknown") unknowns.push("tone");
  // 기간/팀 규모 명시 여부
  if (!/\d+ *(주|일|개월|month|week)/i.test(prompt)) unknowns.push("timeline");
  if (!/\d+ *(명|인|person|people)/i.test(prompt)) unknowns.push("team-size");
  // 기존 디자인 시스템 여부 — "있다/없다" 명시 안 됐고 스코프에 포함된 경우만 unknown으로
  if (scope.needsDesignSystem && !/(기존|있|새로운|새|레퍼런스)/.test(prompt)) {
    unknowns.push("existing-design-system");
  }
  // 페르소나 명시
  if (!/(타겟|페르소나|persona|사용자.*세대|mz|시니어)/i.test(prompt)) {
    unknowns.push("target-persona");
  }
  // 플랫폼
  if (!/(웹|web|모바일|mobile|앱|ios|android|데스크탑|desktop)/i.test(prompt)) {
    unknowns.push("platform");
  }
  // 스코프 자체가 너무 일반적이면
  const scopeCount = Object.values(scope).filter(Boolean).length;
  if (scopeCount <= 1) unknowns.push("scope-specifics");
  return unknowns;
}

function computeConfidence(
  prompt: string,
  domain: Domain,
  tone: Tone,
  scope: IntentScope,
  unknowns: UnknownField[],
): number {
  const wordCount = prompt.trim().split(/\s+/).length;
  // base: 단어 수 기반 0.3~0.85
  let score = Math.min(0.85, 0.3 + wordCount * 0.04);
  if (domain === "unknown") score -= 0.15;
  if (tone === "unknown") score -= 0.05;
  const scopeCount = Object.values(scope).filter(Boolean).length;
  score += scopeCount * 0.05;
  score -= unknowns.length * 0.02;
  return Math.max(0.05, Math.min(0.95, score));
}

/**
 * 공개 API. LLM 미연결 시 휴리스틱으로 동작.
 * ⚠️ LLM 도입 시: isLlmAvailable() 분기로 LLM 호출 추가.
 */
export function extractIntent(prompt: string): RunIntent {
  const p = prompt.toLowerCase().trim();
  const { domain, matched } = detectDomain(p);
  const productType = detectProductType(p);
  const tone = detectTone(p);
  const scope = detectScope(p);
  const unknowns = detectUnknowns(p, domain, tone, scope);
  const confidence = computeConfidence(p, domain, tone, scope, unknowns);

  return {
    domain,
    productType,
    tone,
    scope,
    unknowns,
    rawPrompt: prompt,
    confidence,
    detectedKeywords: matched ? [matched] : [],
    mode: "heuristic",
  };
}
