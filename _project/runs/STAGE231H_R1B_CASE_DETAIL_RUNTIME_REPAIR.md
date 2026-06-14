# STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

Status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH
Date: 2026-06-14 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan-first sources read

- AGENTS.md
- _project/04_ETAPY_ROZWOJU_APLIKACJI.md
- _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md
- src/pages/CaseDetail.tsx
- src/components/CaseQuickActions.tsx
- src/components/finance/CaseSettlementSection.tsx
- src/components/finance/CaseSettlementPanel.tsx
- src/components/finance/CaseFinanceEditorDialog.tsx
- scripts/check-stage231h-r1-case-detail-function-mapping-audit.cjs
- tests/stage231h-r1-case-detail-function-mapping-audit.test.cjs

## Runtime repair scope

This R1B package repairs the highest-confidence CaseDetail problems confirmed by R1/R1A:

1. Fake dictation: `Dyktuj notatkę` is no longer a clickable action that opens the normal note dialog. It becomes a disabled, honest `Notatka głosowa — wkrótce` control.
2. `nextAction` fallback no longer mixes `missing` with operational task/event next steps.
3. Finance edit modal no longer clears `contractValue` when commission mode changes away from percent.
4. Transaction/contract value input is always editable, regardless of commission mode.
5. Payment history modal copy is honest: it says `Ostatnie 8 wpłat i korekt` while the modal still uses the visible 8-row list.
6. Main case history uses full sorted `casePayments`, not the visible 8-row payment subset.
7. Guard and test added for these contracts.

## Explicitly deferred

- `case_item` dual-path canonicalization remains documented from R1A. R1B does not remove checklist/local dialog because it needs a separate UX decision: quick blocker vs checklist item creation.
- cost lifecycle left as R1C. R1B does not invent cost edit/delete without checking existing data contract and Supabase helper coverage.
- SQL: NOT_TOUCHED.

## Guard tokens

- R1B_RUNTIME_REPAIR
- cost lifecycle left as R1C

## Required tests

```powershell
node scripts/check-stage231h-r1-case-detail-function-mapping-audit.cjs
node --test tests/stage231h-r1-case-detail-function-mapping-audit.test.cjs
node scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs
node --test tests/stage231h-r1b-case-detail-runtime-repair.test.cjs
npm run build
git diff --check
```

## Manual test after local apply

1. Open a case.
2. Check that `Dyktuj notatkę` no longer appears as a real action.
3. Check that `Notatka głosowa — wkrótce` is disabled.
4. Add a task and event; verify the next action is task/event only.
5. Add a missing item; verify it appears under blockers, not as the operational next step fallback.
6. Open finance edit modal.
7. Set transaction value with commission mode `Brak`; save; refresh; value remains.
8. Change commission mode to `Kwota stała`; transaction value remains.
9. Open payment history modal; title says `Ostatnie 8 wpłat i korekt`.
10. Build passes.

## Risk audit after stage

- This stage avoids SQL and broad case_item refactor to reduce blast radius.
- Main risk: existing finance helper assumptions in shared components may still use percent-only transaction basis outside this local CaseDetail modal. That is a follow-up audit item, not hidden as fixed here.
- Cost edit/delete remains an open product/runtime gap for R1C.
- Dual case_item creation remains open for R1C/R1D unless Damian chooses one canonical path.

## Local PASS before push

- R1 audit guard: PASS
- R1 audit test: PASS
- R1B runtime guard: PASS
- R1B runtime test: PASS
- build: PASS
- git diff --check: PASS
- Manual UI verification: REQUIRED_BY_DAMIAN before final closeout
