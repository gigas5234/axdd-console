---
name: t8-optional-frontmatter
description: Demo skill that exercises every optional frontmatter field (license, compatibility, metadata, allowed-tools). Use as a reference when you need to set non-default frontmatter on a real skill.
license: Apache-2.0
compatibility: Works with any agent that supports the Agent Skills spec v1. No system packages or network access required.
metadata:
  owner: platform-team
  category: demo
  review-cycle: quarterly
  source-url: https://agentskills.io/specification
allowed-tools: bash view edit
---

# Optional Frontmatter Reference

This skill is intentionally trivial in body — it exists to show all optional frontmatter fields in one place.

## Field-by-field notes

- **license**: short string (SPDX id) or filename of a bundled LICENSE.
- **compatibility**: state real environment requirements only. Avoid filler like "works everywhere".
- **metadata**: arbitrary `string → string`. Namespacing keys (e.g., `owner`, `category`) avoids collisions.
- **allowed-tools**: experimental; space-separated tool names. Support varies by agent.

## When to activate

- User asks "show me a skill with all optional fields" or "how do I set metadata/compatibility".

## Procedure

1. Open this `SKILL.md` and walk through the frontmatter, explaining each field.
2. Point to `references/spec-cheatsheet.md` of T6 if more depth is needed.
