---
name: t2-reference-heavy
description: Korean business email composer. Use when the user asks to draft formal Korean business correspondence and needs honorifics, salutations, or industry-specific phrasing applied correctly.
license: Apache-2.0
compatibility: No special requirements. Works with any Agent runtime that supports Korean text.
---

# Korean Business Email Composer

Reference-heavy skill (S1 + B1/B2). The body is short; long domain knowledge lives in `references/` and is loaded only when needed (progressive disclosure).

## When to activate

- User requests a Korean business email, official notice, or formal reply.

## Procedure

1. Ask for: recipient role, sender role, purpose, deadline (if any), tone (formal/semi-formal).
2. Pick a template family:
   - General correspondence → read `references/honorifics.md` for honorific selection rules.
   - Cross-company / vendor → read `references/industry-phrases.md` for fixed phrasings.
   - Apology / complaint → read `references/edge-cases.md`.
3. Draft the email following the structure: 인사 → 본문 → 요청/마무리 → 서명.
4. Run the checklist below before returning.

## Checklist (gate before returning)

- [ ] Honorific level matches recipient seniority.
- [ ] Subject line ≤ 40 chars and includes a noun phrase, not a verb.
- [ ] No mixed speech levels in the same paragraph.
- [ ] Date/deadline written as `YYYY-MM-DD (요일)`.

Only load the reference file you actually need. Do not preload all of `references/`.
