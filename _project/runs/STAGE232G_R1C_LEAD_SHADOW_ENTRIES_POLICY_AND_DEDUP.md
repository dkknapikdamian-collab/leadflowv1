# STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP

Data: 2026-06-23 09:10 Europe/Warsaw
Status: APPLIED_PENDING_TEST_OR_PUSH
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel

Ustawić jawny, wspólny moduł polityki dla lead shadow entries: deduplikacja, ukrywanie lead-cienia przykrytego taskiem/eventem i ograniczone akcje leada.

## Zakres runtime

- `src/lib/calendar-lead-shadow-entry-policy.ts` - nowa czysta polityka.
- `src/lib/scheduling.ts` - `removeLeadShadowEntries()` deleguje do `applyLeadShadowEntryPolicy()`.

## Zakazy zakresu

- Nie ruszać `src/pages/Calendar.tsx`.
- Nie ruszać `src/pages/TodayStable.tsx`.
- Nie ruszać SQL/RLS.
- Nie ruszać finansów/prowizji.
- Nie ruszać Owner Control.
- Nie ruszać Google OAuth/sync.

## Testy

- `node scripts/check-stage232g-r1c-lead-shadow-entries-policy-and-dedup.cjs`
- `node --test tests/stage232g-r1c-lead-shadow-entries-policy-and-dedup.test.cjs`
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Ryzyka

Lead shadow nadal jest wpisem pochodnym, nie pełnym źródłem zadania. R1C ogranicza fałszywe akcje i deduplikację, ale pełne akcje Calendar/restore/done należą do R1D.

## Następny krok

`STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT`.
