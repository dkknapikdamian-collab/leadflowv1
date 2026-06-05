# CloseFlow / LeadFlow - Stage223 R2AD Today tile no-scroll trap hotfix

Data: 2026-06-05
Typ wpisu: produkcyjny bugfix / Today scroll trap
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2AD Today tile no-scroll trap hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2AD_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Użytkownik wykrył scroll trap na `/today` po klikaniu kafelków.
- Przyczyną było automatyczne `scrollIntoView`, reordering DOM sekcji i wiele click listenerów.
- R2AD zmienia kafelki na expand/collapse w miejscu.

## DECYZJE

- Nie scrollować automatycznie do sekcji.
- Nie przenosić sekcji w DOM po kliknięciu kafelka.
- Nie zaczynać Stage224 przed hotfixem.
- Nie pushować bez zielonego guard/build/verify i manualnego sprawdzenia `/today`.

## TESTY

```powershell
node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-movement-risk-system.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Zmieniono zachowanie kafelków: nie przenoszą sekcji na górę.
- Po wdrożeniu ręcznie sprawdzić `/today` i scroll po klikaniu wszystkich kafelków.

## NASTĘPNY KROK

Uruchomić R2AD lokalnie, test ręczny `/today`, push po akceptacji.
