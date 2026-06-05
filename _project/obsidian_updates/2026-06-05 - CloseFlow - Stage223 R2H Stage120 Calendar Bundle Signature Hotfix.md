# CloseFlow / LeadFlow - Stage223 R2H Stage120 calendar bundle signature hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / Stage120 calendar contract
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2H Stage120 calendar bundle signature hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Stage120 gate blokował przez extractor funkcji.
- Logika `Promise.all([` była w funkcji, ale default `= {}` w sygnaturze mylił extractor.
- R2H przenosi default options do ciała funkcji.

## DECYZJE

- Nie wyłączać Stage120.
- Nie zmieniać release gate.
- Nie zmieniać semantyki local-first.

## TESTY

```powershell
node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
