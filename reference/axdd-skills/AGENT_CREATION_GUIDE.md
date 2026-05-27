# Agent Skill Creation Guide (Per Type)

Companion to [`CATALOG.md`](CATALOG.md). Walks through *how* to author each type, with a worked example pointing at the corresponding skill in `skills/`.


> **Always start from the spec:** https://agentskills.io/specification  
> **Interactive workflow:** Use [`skill-creator-agent`](skill-creator-agent/SKILL.md) to drive creation end-to-end.

---

## Universal steps (run for every type)

1. **Frame the task.** One sentence: *what* the skill does and *when* it should activate.
2. **Choose the type** using `skill-creator-agent/references/type-decision.md`.
3. **Name it.** kebab-case, ≤ 64 chars, will become the directory name.
4. **Write `description`.** 1-1024 chars; include both *what* and *when* with concrete keywords.
5. **Scaffold:**
   ```bash
   python3 skill-creator-agent/scripts/create_skill.py \
     --name <name> --description "<desc>" --type <T#>
   ```
   This creates `skills/<name>/` by default. Pass `--out <parent>` only when the skill should not live under `skills/`.
6. **Fill content** per the per-type sections below.
7. **Catalog:** add the skill to [`CATALOG.md`](CATALOG.md) with `skill-creator-agent/scripts/update_catalog.py` (see [`skill-creator-agent/SKILL.md`](skill-creator-agent/SKILL.md) for flags).
8. **Lint:** `python3 skill-creator-agent/scripts/lint_skill.py skills/<name>`
9. **Spec validate:** `skills-ref validate skills/<name>` (if installed).
10. **Smoke test** the activation phrases against the procedure.

---

## T1 — Minimal SOP

**Use when:** the procedure is short enough to read in one screen and needs no external assets.

**Body sections to write:**
- When to activate (3-5 trigger phrases)
- Procedure (numbered steps, ≤ 7)
- One worked example (input → output)
- Edge cases (3-5 bullets)

**Don'ts:**
- Don't add empty subdirectories.
- Don't inflate prose; if it grows beyond ~80 lines, switch to T2.

**Worked example:** [`skills/t1-minimal-sop`](skills/t1-minimal-sop/SKILL.md).

---

## T2 — Reference-heavy

**Use when:** there is a domain corpus (style guide, glossary, fixed phrases, regulations) too long to inline.

**Authoring steps:**
1. List the topics. Each becomes one file under `references/` (≤ ~200 lines).
2. In `SKILL.md`, name each reference and *when* to load it. Do not preload all references.
3. Include a checklist gate so the agent verifies it consulted the right reference.

**Don'ts:**
- Don't nest references more than one level deep from `SKILL.md`.
- Don't duplicate reference content in the body.

**Worked example:** [`skills/t2-reference-heavy`](skills/t2-reference-heavy/SKILL.md).

---

## T3 — Script-backed

**Use when:** correctness is non-negotiable (numbers, parsing, transformations).

**Authoring steps:**
1. Write the script first. Stdlib-only when feasible. Use `argparse` and emit JSON.
2. Define an explicit *output contract* in `SKILL.md` so the agent never invents fields.
3. Set `compatibility:` if a runtime/version is required.
4. Document failure modes: non-zero exit, missing file, malformed input.

**Don'ts:**
- Don't let the agent recompute results in prose; always quote the script.
- Don't pull heavy dependencies unless truly needed.

**Worked example:** [`skills/t3-script-backed`](skills/t3-script-backed/SKILL.md).

---

## T4 — Asset-template

**Use when:** output is a fixed-shape document (PR description, report, contract).

**Authoring steps:**
1. Drop the canonical artifact in `assets/<name>.md` (or `.html`, `.json`, etc.).
2. Use `{{UPPER_SNAKE}}` placeholders. Mark optional sections.
3. In `SKILL.md`, list inputs to gather and the placeholder ↔ input mapping.
4. Specify the output framing (e.g., "return inside one fenced code block").

**Don'ts:**
- Don't let the agent invent template sections.
- Don't bury the template inside the prose.

**Worked example:** [`skills/t4-asset-template`](skills/t4-asset-template/SKILL.md).

---

## T5 — Full-stack

**Use when:** the skill needs validation, aggregation, templated rendering, and style enforcement together.

**Authoring steps (pipeline):**
1. `scripts/validate_*.py` — fast schema check, exits non-zero on bad input.
2. `scripts/aggregate_*.py` — deterministic transform to render-ready JSON.
3. `assets/*-template.md` — canonical output shape.
4. `references/style-guide.md` — voice, tense, formatting rules.
5. `references/checklist.md` — pre-return gate.
6. `SKILL.md` describes the pipeline and forbids fabricated values.

**Don'ts:**
- Don't bundle unrelated tasks into one T5; split.
- Don't allow the agent to skip the checklist.

**Worked example:** [`skills/t5-full-stack`](skills/t5-full-stack/SKILL.md).

---

## T6 — Meta / tooling

**Use when:** the skill creates, edits, or validates other skills/tools.

**Authoring steps:**
1. Put the generator in `scripts/`. Validate inputs strictly (regex on names, length on descriptions).
2. Include a spec cheatsheet in `references/` so the agent doesn't improvise rules.
3. Refuse destructive defaults (no overwrite without confirmation).

**Don'ts:**
- Don't auto-add optional frontmatter. Ask the user.
- Don't silently fix invalid inputs.

**Worked example:** [`skills/t6-meta-tooling`](skills/t6-meta-tooling/SKILL.md).

---

## T7 — API / integration

**Use when:** the skill must call an external service.

**Authoring steps:**
1. Document in `references/api-notes.md`: auth, rate limits, error codes, pagination.
2. Script returns structured data; agent does the prose layer.
3. Warn the user if credentials/env vars are missing *before* calling.
4. Set `compatibility:` to declare network access and any required env vars.

**Don'ts:**
- Don't hide retries inside the agent prompt; put them in the script.
- Don't paginate in prompt — paginate in the script and cap output.

**Worked example:** [`skills/t7-api-integration`](skills/t7-api-integration/SKILL.md).

---

## T8 — Optional frontmatter overlay

**Use when:** any of the above needs `license`, `compatibility`, `metadata`, or `allowed-tools`.

**Rules:**
- `license`: SPDX id (e.g., `Apache-2.0`) or filename of a bundled LICENSE.
- `compatibility`: ≤ 500 chars; only real requirements (runtime, system pkg, network).
- `metadata`: `string → string`. Namespace your keys (`owner`, `category`, etc.).
- `allowed-tools`: experimental — only set if your runtime is known to support it.

**Worked example:** [`skills/t8-optional-frontmatter`](skills/t8-optional-frontmatter/SKILL.md).

---

## Validation reference

```bash
# Fast structural lint (stdlib only)
python3 skill-creator-agent/scripts/lint_skill.py skills/<name>

# Spec compliance
pipx install skills-ref
skills-ref validate skills/<name>
```

## Anti-patterns to avoid (all types)

- 500+ line `SKILL.md` body — split into `references/`.
- Deeply nested file references (`references/sub/topic.md`) — keep one level.
- Fabricated numbers, fields, or sections.
- "Works everywhere" `compatibility` — omit instead of bluffing.
- One mega-skill spanning unrelated tasks — split into multiple skills.

---

## KT-Specific Guidance

For KT employees implementing Agent Skills in the **AXE delivery framework**:
- **Role alignment:** See [docs/KT_DELIVERY_WAY_SKILLS_GUIDE_KO.md](docs/KT_DELIVERY_WAY_SKILLS_GUIDE_KO.md) (Korean).
- **Architecture & harness:** See [docs/AXE_Role_Based_Agent_Harness_v0_1_Final_Draft.md](docs/AXE_Role_Based_Agent_Harness_v0_1_Final_Draft.md) (Korean, internal).
- **Public + internal structure:** See [docs/README.md](docs/README.md) for how public skills and KT guidance are organized.

---

**Last updated:** 2026년 5월 15일  
**Specification:** https://agentskills.io/specification
