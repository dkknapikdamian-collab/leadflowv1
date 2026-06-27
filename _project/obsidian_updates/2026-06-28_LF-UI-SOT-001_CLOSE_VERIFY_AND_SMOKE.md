# Obsidian update - LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE

Date: 2026-06-28 00:30 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
Target Obsidian files:
- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY - CloseFlow Lead App.md`

## Status

```txt
LF-UI-SOT-001:
TECH_DONE / ROUTING_SOT_GUARD_ADDED / CLOSE_VERIFY_GUARD_ADDED / NEEDS_LOCAL_COMMAND_CONFIRMATION / NEEDS_MANUAL_SMOKE / FULL_ALIAS_POLICY_PENDING
```

## What changed in app repo

Added:

```txt
scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs
tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs
_project/runs/LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE.md
```

Updated:

```txt
_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-001_CANONICAL_ROUTING_MAP.md
```

## Product decision

Do not deploy LF-UI-SOT-001 from zero again.

Core CaseDetail canonical routing is done:

```txt
/cases/:caseId = canonical CaseDetail
/case/:caseId = alias redirect via LegacyCaseRedirect + Navigate replace
```

But do not mark full alias policy as closed because known exceptions remain:

```txt
/today
/start
/support
/dev/funnel
```

## Guard/test commands

To run locally:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

npm run guard:routes:canonical
node scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs
node --test tests/routes-canonical.test.cjs tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Manual smoke Damiana

```txt
[ ] /cases
[ ] /cases/:caseId
[ ] /case/:caseId -> replace redirect to /cases/:caseId
[ ] /leads
[ ] /leads/:leadId
[ ] lead-to-case handoff, if available
[ ] /
[ ] /today
[ ] /calendar
[ ] /funnel
```

## Follow-up

If Damian wants every alias to redirect-only, open:

```txt
LF-UI-SOT-001R2_ROUTE_ALIAS_POLICY_CLOSEOUT
```

Scope only alias policy. Do not mix with CSS/UI/layout/business data.

## Zapis do Obsidiana

- data i godzina: 2026-06-28 00:30 Europe/Warsaw
- name/alias: LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE
- canonical_name: CloseFlow / LeadFlow
- save status: app repo payload prepared and Obsidian repo files updated through GitHub connector
- Obsidian GitHub sync: DONE after companion obsidian-vault commits
- Obsidian local sync: LOCAL_SYNC_PENDING
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- tests: local command execution pending
- risk audit: full alias policy pending; do not overclaim FULL_ALIAS_POLICY_PASS
- what was not touched: CSS, layout, runtime business logic, SQL, Supabase/Firebase/API
- next step: run local commands and manual smoke
