---
name: t7-api-integration
description: GitHub issue fetcher. Use when the user wants to fetch and summarize issues from a public GitHub repository via the REST API, including filtering by label or state.
license: Apache-2.0
compatibility: Requires Python 3.9+ and network access to api.github.com. Optional GITHUB_TOKEN env var raises rate limit from 60 to 5000 req/h.
---

# GitHub Issue Fetcher

API / integration skill (T7). Demonstrates auth handling, rate-limit awareness, pagination, and a thin script that returns structured JSON for the agent to summarize.

## When to activate

- User asks to "fetch GitHub issues", "list open issues for repo X", or "summarize bugs labeled Y".

## Procedure

1. Confirm: `owner/repo`, state (`open|closed|all`), optional label filter, max items (default 30, cap 200).
2. If `GITHUB_TOKEN` is unset, warn the user about the 60 req/h unauthenticated limit before running.
3. Run:
   ```
   python3 scripts/fetch_issues.py --repo <OWNER/REPO> --state <STATE> [--label <L>] [--max <N>]
   ```
4. Read `references/api-notes.md` only if the script reports a 4xx/5xx error.
5. Summarize the returned JSON: total count, top labels, oldest open issue, and any items the user explicitly asked to highlight.

## Output contract

The script always returns a JSON array of `{number, title, state, labels, created_at, url}`. Never invent fields not in the response.
