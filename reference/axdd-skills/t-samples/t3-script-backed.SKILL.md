---
name: t3-script-backed
description: CSV column statistics. Use when the user asks for deterministic numeric summaries (count, mean, min, max, stddev) of one or more columns in a CSV file.
license: Apache-2.0
compatibility: Requires Python 3.9+ available on PATH. No third-party packages needed.
---

# CSV Column Statistics

Script-backed skill (S2 + B1). Determinism matters, so the agent delegates to a pinned script instead of computing in-prompt.

## When to activate

- User asks for stats on a CSV column ("평균", "합계", "표준편차", "describe this csv").

## Procedure

1. Confirm the absolute path to the CSV and the column name(s). If the file is large (>100 MB), warn before running.
2. Run the script:
   ```
   python3 scripts/stats.py --file <PATH> --columns <COL1,COL2,...>
   ```
3. Present the JSON output as a Markdown table. Round floats to 4 decimals.
4. If the script exits non-zero, surface its stderr verbatim — do not invent numbers.

## Output contract

The script always emits one JSON object: `{ "<column>": {"count":..., "mean":..., "min":..., "max":..., "stddev":...} }`.
