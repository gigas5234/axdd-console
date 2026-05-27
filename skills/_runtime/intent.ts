/**
 * Intent Extraction — 자연어 프롬프트를 구조화된 의도 객체로 분해.
 *
 * ╔════════════════════════════════════════════════════════════════════╗
 * ║  Phase 6 재정의                                                      ║
 * ║  ────────────────                                                  ║
 * ║  이 콘솔은 외부 산업(헬스케어/핀테크/이커머스) 프로젝트가 아니라      ║
 * ║  AXDD 전사 내부에서 쓰는 스킬을 만드는 도구다.                      ║
 * ║  → "domain" 필드 의미를 외부 산업 → 프로젝트 컨텍스트로 재정의.      ║
 * ╚════════════════════════════════════════════════════════════════════╝
 */

/**
 * 프로젝트 컨텍스트 — 이 콘솔이 다루는 4가지 시나리오.
 *
 * - axdd-internal: AXDD 내부 자체 자산을 만드는 작업 (Case B)
 * - customer-project: 외부 고객사 프로젝트 수행 (Case C)
 * - ds-bootstrap: 자체 DS가 아직 없어 부트스트랩 (Case A)
 * - generic: 컨텍스트 미확정 — clarifying 질문 필요
 */
export type Domain =
  | "axdd-internal"
  | "customer-project"
  | "ds-bootstrap"
  | "generic"
  | "unknown";

export type Tone =
  | "전문성" /* 사내 운영 - 신뢰·정확 */
  | "엔터프라이즈" /* 사내 표준·일관성 */
  | "효율" /* 어드민·내부 툴 */
  | "차분" /* 신뢰가 중요한 문서 작업 */
  | "미니멀" /* 핵심만 보이는 인터페이스 */
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
  /** Phase 6 신규 — DS Bootstrap 워크유닛 후보 신호 */
  needsDsBootstrap: boolean;
}

/**
 * Product Type — 제품 유형.
 *
 * AXDD 컨텍스트에서는 다음이 주로 쓰임:
 *   - admin-tool: 사내 어드민
 *   - internal-saas: 사내 SaaS (협업/관리 도구)
 *   - design-system: 디자인 시스템 자체
 *   - customer-deliverable: 외부 고객 산출물
 *   - documentation: 사내 문서/가이드
 */
export type ProductType =
  | "admin-tool"
  | "internal-saas"
  | "design-system"
  | "customer-deliverable"
  | "documentation"
  | "unknown";

export interface RunIntent {
  /** 프로젝트 컨텍스트 (외부 산업 도메인 X, AXDD 시나리오) */
  domain: Domain;
  /** 제품 유형 */
  productType: ProductType;
  /** 톤앤매너 */
  tone: Tone;
  scope: IntentScope;
  unknowns: UnknownField[];
  rawPrompt: string;
  confidence: number;
  detectedKeywords: string[];
  mode: "llm" | "heuristic";
}

// ─── 컨텍스트 매칭 사전 (Phase 6 재정의) ────────────────────────────────

const DOMAIN_PATTERNS: { domain: Domain; patterns: RegExp[] }[] = [
  {
    // DS Bootstrap 신호 — 디자인 시스템 자체를 만드는 작업
    domain: "ds-bootstrap",
    patterns: [
      /디자인 *시스템 *(만들|부트스트랩|초안|초기)/,
      /design *system *bootstrap/i,
      /토큰 *초안|ds *초안/i,
      /(우리|자체|axdd) *(디자인|ds) *(없|새로 만)/,
    ],
  },
  {
    domain: "customer-project",
    patterns: [
      /고객사|클라이언트 *프로젝트|외주|고객 *프로젝트/,
      /customer *project|client *project/i,
      /고객 *(?:디자인|ds)/,
    ],
  },
  {
    domain: "axdd-internal",
    patterns: [
      /axdd|사내|내부|전사|우리 *(?:팀|회사)/i,
      /사내 *(?:어드민|툴|대시보드|시스템)/,
      /internal *(?:tool|admin|dashboard)/i,
    ],
  },
];

const TONE_PATTERNS: { tone: Tone; patterns: RegExp[] }[] = [
  {
    tone: "엔터프라이즈",
    patterns: [/엔터프라이즈|enterprise/i, /사내 *표준|일관성/],
  },
  { tone: "효율", patterns: [/효율|어드민|admin|운영|관리/i] },
  { tone: "전문성", patterns: [/전문|신뢰|보수적|정확/] },
  { tone: "차분", patterns: [/차분|절제|진지/] },
  { tone: "미니멀", patterns: [/미니멀|minimal|깔끔|심플/i] },
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
  {
    key: "needsDsBootstrap",
    patterns: [
      /디자인 *시스템 *(만들|부트스트랩|초안|초기 *세팅)/,
      /토큰 *초안|ds *초안/i,
    ],
  },
];

// ─── 휴리스틱 추출 함수 ────────────────────────────────────────────────

function detectProductType(p: string): ProductType {
  if (/(어드민|admin|백오피스|운영 *툴|관리자 *콘솔)/i.test(p))
    return "admin-tool";
  if (/(디자인 *시스템|design *system|ds *카탈로그|토큰 *초안)/i.test(p))
    return "design-system";
  if (/(고객사|고객 *프로젝트|customer|deliverable)/i.test(p))
    return "customer-deliverable";
  if (/(사내 *saas|internal *saas|협업 *도구|콘솔)/i.test(p))
    return "internal-saas";
  if (/(문서|문서화|가이드|매뉴얼|docs)/i.test(p)) return "documentation";
  return "unknown";
}

/**
 * 도메인 검출 — score-based + 명시적 키워드 우선.
 */
function detectDomain(p: string): { domain: Domain; matched: string | null } {
  // 1) 명시적 키워드 우선
  const EXPLICIT: { kw: RegExp; dom: Domain }[] = [
    { kw: /디자인 *시스템 *(부트스트랩|초안|초기|만들)/, dom: "ds-bootstrap" },
    { kw: /고객사|client *project/i, dom: "customer-project" },
    { kw: /axdd|사내|전사 *내부/i, dom: "axdd-internal" },
  ];
  for (const { kw, dom } of EXPLICIT) {
    const m = p.match(kw);
    if (m) return { domain: dom, matched: m[0] };
  }

  // 2) score-based
  let bestDomain: Domain = "unknown";
  let bestScore = 0;
  let bestMatched: string | null = null;

  for (const { domain, patterns } of DOMAIN_PATTERNS) {
    let score = 0;
    let firstMatch: string | null = null;
    for (const re of patterns) {
      const matches = p.match(new RegExp(re.source, re.flags + "g"));
      if (matches) {
        score += matches.length;
        if (!firstMatch) firstMatch = matches[0];
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
      bestMatched = firstMatch;
    }
  }
  return { domain: bestDomain, matched: bestMatched };
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
    needsDsBootstrap: false,
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
  if (domain === "unknown" || domain === "generic") unknowns.push("domain");
  if (tone === "unknown") unknowns.push("tone");
  if (!/\d+ *(주|일|개월|month|week)/i.test(prompt)) unknowns.push("timeline");
  if (!/\d+ *(명|인|person|people)/i.test(prompt)) unknowns.push("team-size");
  if (scope.needsDesignSystem && !/(있|기존|새로 *만)/.test(prompt)) {
    unknowns.push("existing-design-system");
  }
  if (!/(타겟|페르소나|persona|사용자|디자이너|pm|개발자|운영자|기획자)/i.test(prompt)) {
    unknowns.push("target-persona");
  }
  if (!/(웹|web|모바일|mobile|앱|admin|어드민|데스크탑|desktop)/i.test(prompt)) {
    unknowns.push("platform");
  }
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
  let score = Math.min(0.85, 0.3 + wordCount * 0.04);
  if (domain === "unknown") score -= 0.15;
  if (tone === "unknown") score -= 0.05;
  const scopeCount = Object.values(scope).filter(Boolean).length;
  score += scopeCount * 0.05;
  score -= unknowns.length * 0.02;
  return Math.max(0.05, Math.min(0.95, score));
}

/**
 * 공개 API.
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
