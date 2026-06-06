# STAGE228B — Lead Work Action Center — local report

## Cel

Dodać w LeadDetail czytelne centrum pracy podobne do modelu sprawy: zadania, wydarzenia, braki i akcje dalszej pracy.

## Zakres techniczny

- Patch: `src/pages/LeadDetail.tsx`
- Guard: `scripts/check-stage228b-lead-work-action-center.cjs`
- Test: `tests/stage228b-lead-work-action-center.test.cjs`
- Release gate: `scripts/closeflow-release-check-quiet.cjs`

## Testy wymagane

- `node scripts/check-stage228b-lead-work-action-center.cjs`
- `node --test tests/stage228b-lead-work-action-center.test.cjs`
- regresje Stage228A, Stage227A, Stage227B
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Audyt ryzyk

Ten etap nie powinien ruszać Supabase schema, RLS, klienta, sprawy ani globalnego lejka. Wykorzystuje istniejące akcje LeadDetail.
