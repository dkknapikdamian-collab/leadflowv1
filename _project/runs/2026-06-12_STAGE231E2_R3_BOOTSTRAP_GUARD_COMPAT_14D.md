# 2026-06-12_STAGE231E2_R3_BOOTSTRAP_GUARD_COMPAT_14D

- stage: STAGE231E2_R3_BOOTSTRAP_GUARD_COMPAT_14D
- date: 2026-06-12 24:25 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- deployment mode: ZIP_LOCAL_ONLY_THEN_PUSH_AFTER_DAMIAN_PASS

## FAKTY Z LOGU DAMIANA

- R2 ZIP applied successfully.
- `node scripts/check-stage231e2-r2-trial-14d-lock.cjs` passed.
- `node scripts/check-stage231e2-account-trial-bootstrap.cjs` failed with: `plans.ts must document the account trial bootstrap blocker.`
- `npm run build` passed.
- `git diff --check` returned line-ending warnings only.

## PRZYCZYNA

The old R1 bootstrap guard expected the old marker `STAGE231E2_ACCOUNT_TRIAL_BOOTSTRAP_BLOCKER` inside `src/lib/plans.ts`.
R2 intentionally replaced the active marker with `STAGE231E2_R2_TRIAL_14D_LOCK`, because the product decision changed from 21 days to 14 days.
This is a stale guard problem, not a runtime plan/trial logic failure.

## CO ZMIENIONO

- Replaced `scripts/check-stage231e2-account-trial-bootstrap.cjs` with an R3-compatible guard.
- The guard now accepts the R2 14-day model and still protects against a return to canonical 21-day trial.
- No runtime files were changed in this R3 hotfix.

## AUDYT PRZED ETAPEM

- stage: STAGE231E2_R3_BOOTSTRAP_GUARD_COMPAT_14D
- real problem: stale R1 guard blocks R2 after product decision changed to 14-day trial.
- files touched: `scripts/check-stage231e2-account-trial-bootstrap.cjs`, this run report, Obsidian payload.
- not touched: `src/lib/plans.ts`, `api/me.ts`, `src/hooks/useWorkspace.ts`, `src/pages/Login.tsx`, SQL, RLS, Google Calendar.

## TESTY AUTOMATYCZNE

Run locally after ZIP apply:

```powershell
node scripts/check-stage231e2-account-trial-bootstrap.cjs
node scripts/check-stage231e2-r2-trial-14d-lock.cjs
npm run build
git diff --check
git status --short
```

## AUDYT PO ETAPIE

- cause fixed: yes, stale marker check in the older bootstrap guard.
- runtime behavior changed: no.
- risk: low; this changes only a guard, but it must still be run locally because Damian's working tree contains unrelated uncommitted Stage231D* files.
- next step: local run, then manual fresh-account test for 14 days.

## OBSIDIAN PAYLOAD

Payload included in `_project/obsidian_updates/2026-06-12_STAGE231E2_R3_BOOTSTRAP_GUARD_COMPAT_14D.md`.

## NASTEPNY KROK

After local PASS, test a fresh account. If it still shows a wrong number of days, inspect the actual workspace row and plan/trial dates in Supabase; do not guess from UI alone.