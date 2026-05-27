---
name: t5-full-stack
description: Weekly status report builder. Use when the user wants to compile a multi-section weekly status report from a JSON activity log, applying a house template and validating completeness.
compatibility: Requires Python 3.9+ on PATH.
license: Apache-2.0
---

# Weekly Status Report Builder

Full-stack skill (S1+S2+S3 with B1/B2/B3). Combines references (style rules), scripts (deterministic aggregation), and assets (templates). Demonstrates progressive disclosure across all three subdirectories.

## When to activate

- User asks to "build the weekly report", "summarize this week's activity log", or provides an activity JSON and asks for a report.

## Procedure

1. **Validate input.** Run `scripts/validate_log.py --file <PATH>`. If it fails, stop and surface errors.
2. **Aggregate.** Run `scripts/aggregate.py --file <PATH>` to get section-ready JSON (highlights, metrics, risks).
3. **Render.** Load `assets/report-template.md` and fill placeholders.
4. **Style pass.** Read `references/style-guide.md` and rewrite any section that violates it.
5. **Gate.** Apply the checklist in `references/checklist.md` before returning.

## Outputs

Return the full Markdown report inside one fenced block. Include a one-line "what changed vs. last week" only if the user supplied last week's report.

## Failure modes

- Empty log → return template with "No activity recorded this week." in each section.
- Missing optional metrics → omit the metric, do not fabricate.
