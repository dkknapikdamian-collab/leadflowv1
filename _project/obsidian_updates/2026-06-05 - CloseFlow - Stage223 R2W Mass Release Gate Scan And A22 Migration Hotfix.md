# CloseFlow / LeadFlow - Stage223 R2W Mass release gate scan + A22 migration hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / mass failure sweep
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2W Mass release gate scan + A22 migration hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2V przeszedł większość gate’ów i build.
- Aktualny bloker: brak `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- R2W dodaje brakujący plik migracji i skrypt masowego skanowania release gate.

## DECYZJE

- Przechodzimy z trybu „jeden fail = jedna paczka” na tryb mass scan.
- Nie wyłączać testów.
- Nie uruchamiać SQL ręcznie w Supabase bez osobnego etapu SQL.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Ryzyko: historyczny SQL może zostać potraktowany jako gotowy SQL do wdrożenia. Nie robić tego bez osobnej instrukcji SQL.
- Ryzyko: mass scan może długo działać, ale oszczędzi serię pojedynczych paczek.

## NASTĘPNY KROK

Po R2W zebrać pełną listę failów z mass scan i zrobić R2X jako batch.
