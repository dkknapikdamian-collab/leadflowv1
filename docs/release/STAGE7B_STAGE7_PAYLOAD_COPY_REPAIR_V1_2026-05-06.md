# STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1

Date: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Goal

Repair the Stage7 package application process. Stage7 payload existed in the ZIP, but the PowerShell directory copy could place files under nested paths like `scripts/scripts/...` when the destination folder already existed.

## Fix

- Copy Stage7 payload file-by-file to exact repository paths.
- Remove accidental nested Stage7 payload paths if they exist.
- Register Stage7 and Stage7B scripts in `package.json`.
- Run Stage6, Stage6B, Stage6D, Stage7 and Stage7B gates before build, commit and push.
- Keep the apply script PowerShell ASCII-safe.

## Required exact paths

- `api/assistant/query.ts`
- `scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs`
- `tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs`
- `docs/release/STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1_2026-05-06.md`
- `scripts/check-stage7b-stage7-payload-copy-repair.cjs`
- `tests/stage7b-stage7-payload-copy-repair.test.cjs`
- `docs/release/STAGE7B_STAGE7_PAYLOAD_COPY_REPAIR_V1_2026-05-06.md`

## Gate

Any failed check, test or build stops before commit/push. No nested payload path is allowed for Stage7 files.
