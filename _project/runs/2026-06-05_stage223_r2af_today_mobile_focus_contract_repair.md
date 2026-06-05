# STAGE223 R2AF - Today mobile focus contract repair after no-scroll fix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

R2AE naprawił package script i build przechodził. `verify:closeflow:quiet` zatrzymał się na starym guardzie:

```text
FAILED: today mobile tile focus
Klik kafelka musi rozwinąć sekcję przez zdjęcie jej z collapsedSections
```

Stary guard wymagał także `moveTodaySectionToTop(sectionKey)` i `scrollToTodaySection(sectionKey)`, czyli dokładnie mechaniki usuniętej przez R2AD.

## ZAKRES

R2AF aktualizuje:

- `scripts/check-closeflow-today-mobile-tile-focus.cjs`
- dodaje `scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs`
- utrzymuje exact `verify:closeflow:quiet`
- utrzymuje R2AD guard w `closeflow-release-check-quiet.cjs`

## TESTY

```powershell
node scripts/check-closeflow-today-mobile-tile-focus.cjs
node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## TEST RĘCZNY

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
npm run dev
```

Na `/today` kliknąć wszystkie górne kafelki.

## AUDYT RYZYK

- To naprawa starego guard contract po świadomej zmianie UX.
- Nie przywracamy scroll/reorder, bo to było źródło scroll trap.
