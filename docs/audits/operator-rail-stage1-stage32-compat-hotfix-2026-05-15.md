# Operator rail Stage 1 — Stage32 guard compatibility hotfix

Data: 2026-05-15

## Problem

Po przepięciu kafla `Najcenniejsze leady` na `TopValueRecordsCard` guard `tests/stage32-leads-value-right-rail.test.cjs` nadal czytał wyłącznie `src/pages/Leads.tsx` i szukał dokładnego markera:

```text
data-stage32-valuable-relation-row="true"
```

Marker funkcjonalnie został przeniesiony do konfiguracji komponentu jako `dataAttrs`, ale stary guard oczekiwał dokładnego tekstu w `Leads.tsx`.

## Naprawa

Dodano komentarz kompatybilności Stage32 w `src/pages/Leads.tsx`, bez zmiany logiki danych, routingu, limitu 5 ani renderu.

## Zakres

- Nie cofnięto `operator-rail`.
- Nie zmieniono CSS.
- Nie zmieniono `TopValueRecordsCard`.
- Nie zmieniono testu Stage32.

## Weryfikacja

```powershell
node --test tests/stage32-leads-value-right-rail.test.cjs
npm.cmd run check:operator-rail-stage1
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```
