---
name: t4-asset-template
description: GitHub pull request description generator. Use when the user wants to draft a PR description that follows a fixed template with summary, changes, testing, and rollout sections.
license: Apache-2.0
compatibility: No special requirements. Works with any Agent runtime.
---

# PR Description from Template

Asset-template skill (S3 + B3). The body explains how to fill the template; the canonical text lives in `assets/`.

## When to activate

- User asks "write a PR description", "draft PR body", or pastes a diff and asks for a summary.

## Procedure

1. Load `assets/pr-template.md`. Treat it as the source of truth — do not invent additional sections.
2. Gather inputs (ask only what's missing):
   - PR title (imperative, ≤ 72 chars).
   - Summary (2-3 sentences, user-visible impact first).
   - List of notable changes (file or module level).
   - How it was tested.
   - Rollout / risk notes.
3. Render the template by replacing `{{PLACEHOLDERS}}` exactly. Leave a section out only if the placeholder text says "optional".
4. Return the filled template inside one fenced code block so it pastes cleanly into GitHub.

## Quality bar

- No marketing tone. Past tense for "what changed", present tense for "what it does".
- Link issues as `Closes #123` only if the user provided an issue number.
