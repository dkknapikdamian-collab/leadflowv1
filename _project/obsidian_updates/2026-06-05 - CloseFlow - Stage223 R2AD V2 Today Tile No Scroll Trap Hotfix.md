# CloseFlow / LeadFlow - Stage223 R2AD V2 Today tile no-scroll trap hotfix

Data: 2026-06-05
Typ wpisu: produkcyjny bugfix / Today scroll trap / V2 patcher repair
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2AD V2 Today tile no-scroll trap hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2AD_V2_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2AD V1 nie zaaplikował się przez kruchy anchor patchera.
- R2AD V2 poprawia patcher i zachowuje ten sam cel: usunąć scroll trap na Today.
- Kafelki mają rozwijać/zwijać sekcje w miejscu.

## DECYZJE

- Nie scrollować automatycznie do sekcji.
- Nie przenosić sekcji w DOM.
- Nie zaczynać Stage224 przed hotfixem.
- Nie pushować bez zielonego guard/build/verify i manualnego testu `/today`.

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

- Zmiana usuwa automatyczne przewijanie i reordering sekcji.
- Po wdrożeniu sprawdzić wszystkie kafelki Today.

## NASTĘPNY KROK

Uruchomić R2AD V2, test ręczny `/today`, push po akceptacji.
