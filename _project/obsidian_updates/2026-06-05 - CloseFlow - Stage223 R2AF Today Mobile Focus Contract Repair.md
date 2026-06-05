# CloseFlow / LeadFlow - Stage223 R2AF Today mobile focus contract repair

Data: 2026-06-05
Typ wpisu: guard contract repair / Today no-scroll follow-up
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2AF Today mobile focus contract repair
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Verify quiet po R2AE padł na starym guardzie `today mobile tile focus`.
- Stary guard wymagał scroll/reorder, co jest sprzeczne z R2AD.
- R2AF aktualizuje guard do nowego kontraktu: focus/aria/expand bez scroll trap.

## DECYZJE

- Nie przywracać scroll/reorder.
- Stary guard dostosować do decyzji R2AD.
- Nie pushować bez zielonego verify quiet i ręcznego testu `/today`.

## TESTY

```powershell
node scripts/check-closeflow-today-mobile-tile-focus.cjs
node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Zmiana dotyczy guard contract.
- Ryzyko UI pozostaje lokalne dla `/today`, więc manualny smoke jest wymagany.

## NASTĘPNY KROK

Uruchomić R2AF, lokalny `/today`, push po akceptacji.
