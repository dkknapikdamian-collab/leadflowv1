# CloseFlow case trash + history fallback + ClientDetail runtime diag

## Stage

CLOSEFLOW_CASE_TRASH_HISTORY_CLIENTDETAIL_DIAG_2026_05_11

## Cel

Naprawia dwa czerwone guardy wykryte po diagnozie runtime:

1. Lista spraw ma używać wspólnego EntityTrashButton zamiast lokalnego przycisku kosza.
2. Historia sprawy ma mieć finalny fallback copy: `Dodano ruch w sprawie`.
3. Dodany jest lokalny diagnostic tool dla ClientDetail hook order, bez zmiany UI i bez obchodzenia React runtime.

## Zmienione pliki

- `src/pages/Cases.tsx`
- `src/pages/CaseDetail.tsx`
- `tools/diagnose-clientdetail-hook-order-2026-05-11.cjs`
- `docs/release/CLOSEFLOW_CASE_TRASH_HISTORY_CLIENTDETAIL_DIAG_2026-05-11.md`

## Wynik patcha

- Cases.tsx changed: true
- CaseDetail.tsx changed: true
- ClientDetail diagnostic written: true

## Weryfikacja wymagana po wdrożeniu

```powershell
npm.cmd run build
npm.cmd run check:case-trash-actions
npm.cmd run check:stage68p-case-history-package-final
node tools/diagnose-clientdetail-hook-order-2026-05-11.cjs
npm.cmd run verify:closeflow:quiet
```

## Uwaga

Ten patch nie maskuje React #310. Jeśli po deployu błąd nadal występuje, trzeba zebrać nieminizowany stack lokalnie albo z sourcemap/dev builda i wskazać konkretną linię hooka.
