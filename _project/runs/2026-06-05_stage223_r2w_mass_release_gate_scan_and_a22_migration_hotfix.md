# STAGE223 R2W - Mass release gate scan + A22 migration hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2V przeszedł:
  - Stage32e,
  - request identity,
  - Vercel Hobby budget,
  - daily digest gates,
  - PWA,
  - Stage122,
  - ClientDetail,
  - case-history gates,
  - Stage120,
  - Stage98,
  - Stage113,
  - Stage223,
  - Stage222,
  - build.
- `verify:closeflow:quiet` zatrzymał się na:
  `tests/faza2-etap22-rls-backend-security-proof.test.cjs`
- Błąd:
  `ENOENT supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`
- Test wymaga historycznego pliku migracji i konkretnych markerów RLS/backend security proof.

## ZAKRES

- Dodać:
  `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`
- Dodać:
  `scripts/stage223-r2w-mass-release-gate-scan.cjs`
- Skrypt mass scan:
  - czyta `scripts/closeflow-release-check-quiet.cjs`,
  - wyciąga ścieżki `tests/*.test.cjs`,
  - uruchamia je pojedynczo,
  - nie zatrzymuje się na pierwszym błędzie,
  - zapisuje raport JSON w `_project/reports/`.

## WAŻNE O SQL

Nie uruchamiać tego SQL ręcznie w Supabase w ramach tego etapu.
To jest odtworzenie historycznego pliku migracji/kontraktu repo.
Jeżeli SQL ma być wdrażany w Supabase, zrobić osobny etap SQL z instrukcją, kolejnością i guardem.

## TESTY

```powershell
node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## RYZYKA

- Mass scan może ujawnić kilka kolejnych historycznych gate’ów. To dobrze: następną paczkę robimy zbiorczo.
- A22 SQL jest historycznym kontraktem; nie traktować jako świeżej instrukcji wdrożenia Supabase bez review.

## NASTĘPNY KROK

Jeżeli mass scan pokaże kolejne fail-e, zrobić R2X jako batch napraw zamiast następnej pojedynczej mikropaczki.
