---
name: t1-minimal-sop
description: Standup note writer. Use when the user asks to draft a short daily standup update covering yesterday, today, and blockers in a consistent three-line format.
license: Apache-2.0
compatibility: No special requirements. Works with any Agent runtime.
---

# Daily Standup Note

A minimal SOP-style skill (Structural S0 + Behavioral B1). Everything fits in `SKILL.md`; no scripts, references, or assets.

## When to activate

- The user says "standup", "daily update", "scrum note", or asks for a short status update.

## Procedure

1. Ask the user for three inputs if missing: yesterday's work, today's plan, and current blockers. Accept brief bullet phrases.
2. Normalize each bullet to a single sentence in past/present/future tense respectively.
3. Emit exactly three lines, prefixed `Y:`, `T:`, `B:`. If there are no blockers, write `B: none`.
4. Keep total output under 280 characters so it can be pasted into chat.

## Example

Input: "yesterday fixed login bug; today review PRs; blocked on staging creds"

Output:
```
Y: Fixed the login bug.
T: Reviewing open PRs.
B: Waiting on staging credentials.
```

## Edge cases

- Multiple items in one slot → join with "; ".
- User provides only one slot → fill the others with `Y: n/a` style placeholders and warn once.
