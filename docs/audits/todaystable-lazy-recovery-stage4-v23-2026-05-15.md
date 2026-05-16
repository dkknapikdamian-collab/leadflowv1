# CloseFlow Stage 4 - TodayStable lazy export recovery V23

Data: 2026-05-15
Zakres: runtime recovery + guard dla lazyPage export contract.

## Cel

Naprawic klase bledu:

- CLOSEFLOW_LAZY_PAGE_EXPORT_MISSING
- Missing lazy page export: TodayStable
- APP_ROUTE_RENDER_FAILED po deployu albo stale cache/chunk mismatch

## Co zmieniono

- src/components/AppChunkErrorBoundary.tsx
  - blad "Missing lazy page export" jest traktowany jak recoverable stale deploy/cache mismatch.
  - aplikacja wykonuje jeden kontrolowany reload po wyczyszczeniu cache, zamiast zostac na martwym ekranie.

- tests/stage88-lazy-page-export-contract.test.cjs
  - sprawdza wszystkie lazyPage(...) w src/App.tsx.
  - sprawdza, czy importowany modul ma default export albo wskazany named export.
  - sprawdza konkretnie TodayStable.

- package.json
  - dodano check:stage88-lazy-page-export-contract.

## Czego nie zmieniono

- Nie zmieniono logiki TodayStable.
- Nie zmieniono routingu.
- Nie usunieto testow.
- Nie wylaczono release gate.
- Nie wykonano commit/push.

## Weryfikacja

Do uruchomienia przez paczke:

- node tools/fix-todaystable-lazy-recovery-v23.cjs --check
- node tests/stage88-lazy-page-export-contract.test.cjs
- npm run build
- npm run verify:closeflow:quiet

## Kryterium zakonczenia

- Missing lazy page export nie zostaje jako bialy ekran bez odzysku.
- Prawdziwy brak exportu w kodzie lapie stage88 przed deployem.
