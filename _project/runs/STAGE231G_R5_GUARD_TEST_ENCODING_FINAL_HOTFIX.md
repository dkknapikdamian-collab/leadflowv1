# STAGE231G R5 - guard/test encoding final hotfix

Date: 2026-06-14 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Stage: STAGE231G_LEAD_DETAIL_OPERATIONAL_WIRING_AUDIT_AND_FIX
Hotfix: R5

## Reason

R4 did not overwrite the broken guard/test because its temporary Node writer had nested template literals. The old guard still had UTF-8 BOM and the old test still checked mojibake text.

## Scope

Runtime application files are not changed in R5. R5 only overwrites:
- scripts/check-stage231g-lead-detail-operational-wiring.cjs
- tests/stage231g-lead-detail-operational-wiring.test.cjs
- this run report
- Obsidian update payload

## Verification required

- node scripts/check-stage231g-lead-detail-operational-wiring.cjs
- node --test tests/stage231g-lead-detail-operational-wiring.test.cjs
- npm run build
- optional npm run typecheck only if script exists
- git diff --check

## Risk audit

Risk reduced: guard/test no longer depend on Polish labels or mojibake-sensitive regexes. They use stable data-stage231g markers and ASCII-only checks.

Remaining risk: manual UI test is still required to confirm that potential editing from the card and finance panel opens the expected edit flow and persists after hard refresh.

## Not touched

SQL, Google Calendar, billing/trial, CaseDetail, ClientDetail, AI Drafts, global layout.