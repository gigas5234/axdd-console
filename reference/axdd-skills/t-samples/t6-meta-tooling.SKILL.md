---
name: t6-meta-tooling
description: Skill scaffolder. Use when the user wants to create a new Agent Skill folder with valid SKILL.md frontmatter, optional subdirectories, and a stub that passes skills-ref validation.
license: Apache-2.0
compatibility: Requires Python 3.9+. Optional skills-ref CLI for validation.
---

# Skill Scaffolder

Meta / tooling skill (T6). It produces other skills. Combines a generator script with a small reference on the spec so the agent can reason about choices.

## When to activate

- User says "create a new skill", "scaffold a skill", "make a SKILL.md".

## Procedure

1. Ask for: skill `name` (kebab-case), one-sentence `description`, target type (T1-T8 from the catalog), and target directory.
2. Read `references/spec-cheatsheet.md` for frontmatter constraints. Validate `name` and `description` lengths before writing.
3. Run `scripts/scaffold.py --name <NAME> --description <DESC> --type <T#> --out <DIR>`.
4. If `skills-ref` is installed, run `skills-ref validate <DIR>/<NAME>` and report results.
5. Print next-step hints based on type (e.g., "T3 needs your script in `scripts/`").

## Guardrails

- Never overwrite an existing directory; abort and ask.
- Never invent a `compatibility` value — only set it when the user gave a real requirement.
