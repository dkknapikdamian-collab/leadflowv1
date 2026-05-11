# CLOSEFLOW_CASES_IMPORT_DEEP_CLEAN_FINAL_2026-05-11

Cel: zamknąć serię runtime błędów `/cases` wynikających z rozjechanych importów w `src/pages/Cases.tsx`.

Naprawa:
- usuwa wszystkie importy z `react`, `react-router-dom`, `lucide-react` i `../components/ui-system/EntityIcon`,
- wstawia jeden kanoniczny import z każdego źródła,
- trzyma hooki Reacta tylko w `react`,
- trzyma `Link` i `useSearchParams` tylko w `react-router-dom`,
- trzyma ikony typu `Clock`, `Loader2`, `Trash2` tylko w `lucide-react`,
- trzyma `EntityIcon` w `../components/ui-system/EntityIcon`,
- dodaje guard na nierozwiązane JSX symbole w `Cases.tsx`.

Weryfikacja:
- `node --check scripts/check-closeflow-cases-loader2-import.cjs`,
- `npm.cmd run check:closeflow-cases-loader2-import`,
- `npm.cmd run verify:closeflow:quiet`.
