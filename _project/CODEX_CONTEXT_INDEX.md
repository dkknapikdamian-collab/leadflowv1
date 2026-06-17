# CODEX_CONTEXT_INDEX - CloseFlow / LeadFlow

Status: ACTIVE
Stage: CF-CODEX-CONTEXT-INDEX-006
Created: 2026-06-16 Europe/Warsaw
Updated: 2026-06-17 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Purpose

This is the first routing file for Codex, ChatGPT, AI developers and local operators working in this repo.

Read this file before broad scans, planning, coding, auditing, ZIP delivery, bug sweeps or status verification.

Goal: collect enough context to work safely without scanning the whole repo or the whole Obsidian vault.

This file is not a replacement for the project memory protocol. It is a bounded router that tells the operator what to read first.

## Routing identifiers

```yaml
entity_id: CloseFlow / LeadFlow
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
obsidian_folder: 10_PROJEKTY/CloseFlow_Lead_App
```

## Read first - exact repo list

Read these files first, in this order, if they exist:

1. `AGENTS.md`
2. `_project/CODEX_CONTEXT_INDEX.md`
3. `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
4. `10_PROJEKTY/CloseFlow_Lead_App/07_SCIAGA_PLIKOW - CloseFlow Lead App.md`
5. `_project/04_STAGE232D_R1_CLOSURE_AND_STAGE232I0_NEXT_SYNC_2026_06_17.md`
6. `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md`
7. `_project/00_PROJECT_MEMORY_PROTOCOL.md`
8. `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
9. `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW__FOUND_PROBLEMS_ADDENDUM.md`
10. `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`
11. `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
12. `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`
13. `_project/06_GUARDS_AND_TESTS.md`
14. `_project/07_NEXT_STEPS.md`
15. `_project/08_CHANGELOG_AI.md`
16. `_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md`
17. `_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md`
18. `_project/13_TEST_HISTORY.md`
19. `package.json`
20. latest relevant `_project/runs/<stage>.md` for the current or immediately previous stage
21. exact source/test/guard files named by the current stage

Do not infer the active next stage from older long files when `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` or `_project/04_STAGE232D_R1_CLOSURE_AND_STAGE232I0_NEXT_SYNC_2026_06_17.md` has a newer queue-sync. If documents conflict, report the conflict instead of silently choosing.

## Obsidian routing - exact list only

Do not scan the whole vault.

If Obsidian access is needed, read only the project dashboard/status/index and exact referenced files, especially:

- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/07_SCIAGA_PLIKOW - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/12_ARCHIWUM_MAPA - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md`, only when stage D/I is relevant
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232J_LEADS_SCROLL_TOP_CUT_SOURCE_OF_TRUTH.md`, only when stage J/scroll is relevant
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232H_SZABLONY_CHECKLIST_SOURCE_OF_TRUTH.md`, only when stage H/templates/checklists is relevant
- `10_PROJEKTY/CloseFlow_Lead_App/99_SYNC/`, only exact file named by the current stage
- `10_PROJEKTY/CloseFlow_Lead_App/90_RAPORTY/`, only exact report named by the current stage

Archives are not active truth unless this index or the active stage points to them.

## Current source-of-truth rule

- Repo is source of truth for app code, Supabase/Vercel/runtime code, tests, guards, `_project/`, technical run reports and implementation history.
- Obsidian/GitHub project memory is source of truth for high-level dashboard, decisions, risks, next steps and operational memory.
- Chat is not a source of truth.

## Active stage pointer rule

Use `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` as the active canonical queue for planned product/code stages.

If a newly reported stage is not yet safely mirrored into the long central queue, use the newest `_project/04...QUEUE_SYNC...` file and mark conflicts explicitly.

Current queue-sync override:

```text
CLOSED: STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX -> PASS_PUSHED / CLOSED / d7b21240 / Damian manual smoke OK
NEXT:   STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT
LATER:  STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
LATER:  STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH
LATER:  STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME
```

## CloseFlow hard boundaries by default

Unless a stage explicitly says otherwise, do not:

- change runtime UI
- change routing
- change Supabase SQL/RLS/schema
- change Stripe/billing/webhooks
- change Google Calendar integration
- change owner-risk/business logic
- change global layout or visual source of truth
- alter production data or secrets
- read `.env`, API keys, secrets or private customer data
- run broad cleanup/refactor outside the stage
- scan unrelated project repos or unrelated Obsidian folders
- commit or push without green guards and `git diff --check`
- use `git add .`

Required tokens for guards and operator reasoning:

- BRANCH_DEV_ROLLOUT_FREEZE
- READ_CODEX_CONTEXT_INDEX_FIRST
- NO_RUNTIME_UI_MUTATION_FOR_CONTEXT_INDEX_STAGE
- NO_SQL_SUPABASE_OR_UI_CHANGE
- NO_SECRETS_OR_ENV_READ
- NO_GIT_ADD_DOT
- ONE_COMMIT_ONE_PROJECT_OR_GLOBAL_STAGE
- OBSIDIAN_PAYLOAD_REQUIRED
- GUARDS_AND_DIFFCHECK_REQUIRED

## Do not scan by default

Do not scan these unless the exact stage requires it:

- `node_modules/`
- `dist/`
- `build/`
- `.next/`
- `.vercel/`
- `.turbo/`
- `coverage/`
- caches
- generated bundles
- old ZIP packages
- screenshots/images/videos unless the stage is visual and the file is named
- other project repos
- the whole Obsidian vault

## Mandatory scan report before planning

Before planning or changing code, return a short scan report:

```text
Project:
Repo:
Branch:
Local path:
Obsidian folder:
entity_id / workspace_id / project_id / canonical_name:

Repo files read:
_project files read:
Obsidian files read:
Skipped files and why:

Current project status:
Active decisions:
Canonical next stage:
Recent stages:
Open risks:
Is the requested stage already fully/partly implemented:
Safest next step:
```

## Helper

Use this helper to generate a bounded context pack:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/codex-context-pack.ps1
```

The helper must stay exact-list based. It must not recurse through the repo or Obsidian vault unless Damian explicitly asks for a full local audit.
