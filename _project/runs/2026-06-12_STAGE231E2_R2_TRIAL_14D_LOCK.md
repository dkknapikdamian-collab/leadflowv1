# 2026-06-12_STAGE231E2_R2_TRIAL_14D_LOCK

- stage: STAGE231E2_R2_TRIAL_14D_LOCK
- date: 2026-06-12 24:10 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- runtime change: YES
- deployment mode: ZIP_LOCAL_ONLY_THEN_PUSH_AFTER_DAMIAN_PASS

## FAKTY Z KODU / PLIKOW

- `src/lib/plans.ts` is the central plan model and defines trial duration through `TRIAL_DAYS` and `TRIAL_MS`.
- `api/me.ts` imports `TRIAL_DAYS` and `TRIAL_MS` from `src/lib/plans.ts`; new workspace bootstrap uses `buildTrialEndsAt()` based on `TRIAL_MS`.
- `src/lib/access.ts` imports `TRIAL_DAYS` from `src/lib/plans.ts` and uses it for trial progress.
- `src/hooks/useWorkspace.ts` had a local/no-Supabase fallback with `trial_21d` and a hard-coded 21-day duration.
- `src/pages/Login.tsx` had user-facing copy saying 21 days.

## DECYZJE DAMIANA

- 2026-06-12: switch product trial to 14 days everywhere, including plan text/copy.
- 2026-06-12: stop direct GitHub push workflow for this thread; prepare ZIP package plus local PowerShell apply command, then separate selective push command after local PASS.

## HIPOTEZY / PROPOZYCJE AI

- The earlier "17 days" symptom can come from a stale existing workspace trial window, but the product decision now supersedes that: canonical trial is 14 days.
- Existing `trial_21d` rows may exist in the database; the code keeps `trial_21d` as a legacy alias so old rows do not break.

## DO POTWIERDZENIA

- Whether existing test accounts should be reset manually in Supabase if they already have old `trial_ends_at` values.
- Whether canonical DB values should be migrated from `trial_21d` to `trial_14d` in a later SQL stage. No SQL is included in this ZIP.

## AUDYT PRZED ETAPEM

- stage: STAGE231E2_R2_TRIAL_14D_LOCK
- user-visible effect: Login page and app billing/access state should describe a 14-day trial; new workspace bootstrap should create a 14-day trial window.
- files checked:
  - `src/lib/plans.ts`
  - `api/me.ts`
  - `src/lib/access.ts`
  - `src/hooks/useWorkspace.ts`
  - `src/pages/Login.tsx`
  - `src/pages/Billing.tsx`
  - `scripts/check-stage231e2-account-trial-bootstrap.cjs`
- existing partial implementation:
  - R1 already made unknown plan states fail closed to Free.
  - Trial was still canonicalized as 21 days in `TRIAL_DAYS`, plan id, local fallback and login copy.
- similar places checked:
  - central plan model,
  - server bootstrap,
  - access summary,
  - local fallback,
  - login copy,
  - billing plan copy.
- not touched:
  - SQL/RLS,
  - Google Calendar logic,
  - billing checkout/webhook,
  - Stripe config,
  - Vercel env,
  - visual layout.

## CO ZMIENIONO

- `src/lib/plans.ts`
  - `TRIAL_DAYS` changed from 21 to 14.
  - canonical trial id changed from `trial_21d` to `trial_14d`.
  - trial plan label changed to `Trial 14 dni`.
  - legacy alias `trial_21d` retained and mapped to the canonical trial id.
- `src/hooks/useWorkspace.ts`
  - local no-Supabase fallback changed from `trial_21d` / 21 days to `trial_14d` / 14 days.
- `src/pages/Login.tsx`
  - login copy changed from 21 days to 14 days.
- `api/me.ts`
  - added stage marker confirming server bootstrap must source duration from `src/lib/plans.ts`.
- `scripts/check-stage231e2-r2-trial-14d-lock.cjs`
  - new guard for trial duration/copy/legacy alias/source-of-truth.

## TESTY AUTOMATYCZNE

To be run locally after ZIP apply:

```powershell
node scripts/check-stage231e2-r2-trial-14d-lock.cjs
node scripts/check-stage231e2-account-trial-bootstrap.cjs
npm run build
git diff --check
```

## GUARDY

- New guard: `scripts/check-stage231e2-r2-trial-14d-lock.cjs`.
- Existing related guard to keep: `scripts/check-stage231e2-account-trial-bootstrap.cjs`.

## TESTY RECZNE

BRAK POTWIERDZONEGO TESTU RECZNEGO.

Manual test for Damian:

1. Open `/login`.
2. Confirm the card says `Startujesz od 14 dni testu`.
3. Confirm the hero side says `14 dni testu na start`.
4. Register a fresh test account.
5. Confirm the trial badge/sidebar starts with a 14-day trial window, not 17 or 21.
6. If it still shows an old number, inspect the actual `workspace.trial_ends_at` row in Supabase; it may be an existing stale workspace, not fresh bootstrap.

## AUDYT PO ETAPIE

- Original problem: new accounts / register flow showed a wrong trial duration, and product direction changed from 21 to 14 days.
- Cause fixed or only symptom masked: fixed central duration and known user-facing copy; existing database rows may still carry old dates and require a separate SQL/admin cleanup decision.
- Similar places checked: plan model, access summary, backend bootstrap, local fallback, login copy, billing text.
- What could regress: if some code depends on literal `trial_21d` as canonical value instead of using `PLAN_IDS.trial`, old rows remain supported by alias but new rows use `trial_14d`.
- New problems found: no SQL migration included; existing test accounts may still show old trial days until reset/updated.
- Problems intentionally not touched: paid plans, Stripe webhook, Google Calendar, digest, weekly report, RLS, SQL.
- Guard/test proving: `node scripts/check-stage231e2-r2-trial-14d-lock.cjs`.
- Manual test for Damian: fresh account register and `/login` visual copy.
- Impact on Obsidian/_project: this report and Obsidian update payload included in ZIP.
- Next best step: run local guards/build; then test a fresh account. If stale existing accounts still show wrong days, create a separate SQL/admin cleanup stage.

## BRAKI I RYZYKA

- Existing workspace rows with old `trial_ends_at` will not magically become 14 days. That is correct: changing active users' trial windows silently would be a business/data decision.
- If Damian wants all test accounts reset, that needs a separate SQL with strict WHERE filters.
- If a fresh account still starts with wrong days after this patch, likely it is being attached to an old workspace/profile mapping and should be debugged in `api/me.ts` workspace resolution.

## WPLYW NA OBSIDIANA

OBSIDIAN_LOCAL_UNAVAILABLE in this chat runtime. Payload is included in:
`_project/obsidian_updates/2026-06-12_STAGE231E2_R2_TRIAL_14D_LOCK.md`.

## NASTEPNY KROK

Run local apply and guards. Push only after Damian confirms local PASS.

## GIT / ZIP STATUS

- ZIP mode: YES.
- Direct GitHub push: NO.
- Vercel deploy trigger avoided by not pushing from chat.