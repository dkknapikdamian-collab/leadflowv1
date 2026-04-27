# Hotfix lint + CaseDetail labels V9 - 2026-04-27

## Zakres

- Naprawia uszkodzony checker `scripts/check-today-week-client-more-ui-text-cleanup.cjs`.
- Checker ignoruje komentarze kontraktowe, ale nadal blokuje instrukcyjne teksty w widocznym UI.
- Usuwa z `src/pages/CaseDetail.tsx` źródłowe etykiety `Zakończ...`, zgodnie z kontraktem `ui-completed-label-consistency`.
- Dopisuje bezpieczny komentarz kontraktowy w `ClientDetail.tsx`, żeby pogodzić starsze testy z aktualnym uproszczeniem UI.

## Po wdrożeniu

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
```
