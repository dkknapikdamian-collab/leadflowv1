# CloseFlow / LeadFlow - Stage223 R2P PWA foundation legacy marker hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / PWA foundation legacy marker
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2P PWA foundation legacy marker hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Quiet release gate blokuje `pwa-foundation.test.cjs`.
- Stary test wymaga tekstu `register('/service-worker.js'`.
- Stage220A29 zabrania realnej rejestracji `navigator.serviceWorker.register('/service-worker.js'`.
- R2P dodaje marker tekstowy bez realnej rejestracji.

## DECYZJE

- Nie przywracać runtime service worker registration.
- Nie wyłączać PWA foundation testu.
- Nie zmieniać Stage220A29 ani Stage122.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/pwa-foundation.test.cjs
node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
