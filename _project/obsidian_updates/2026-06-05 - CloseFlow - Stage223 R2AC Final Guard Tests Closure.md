# CloseFlow / LeadFlow - Stage223 R2AC Final guard/tests closure

Data: 2026-06-05
Typ wpisu: final guard/tests closure
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2AC Final guard/tests closure
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Stage223 R2 runtime został wypchnięty.
- Podetap E wymagał jeszcze finalnego testu `tests/stage223-owner-movement-risk-system.test.cjs`.
- R2AC dodaje finalny test i zaostrza guard.

## DECYZJE

- Nie zaczynać Stage224 przed domknięciem R2AC.
- Nie wdrażać nowych funkcji w R2AC.
- Pilnować jednego źródła prawdy dla badge, ciszy i następnego ruchu.

## TESTY

```powershell
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-movement-risk-system.test.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Guard może zablokować przyszłe ręczne hard-coded badge w UI. To jest zamierzone.
- Po testach odpalić aplikację lokalnie i sprawdzić checklistę manualną.

## NASTĘPNY KROK

Uruchomić R2AC lokalnie, potem `npm run dev:api` i ręczny smoke.
