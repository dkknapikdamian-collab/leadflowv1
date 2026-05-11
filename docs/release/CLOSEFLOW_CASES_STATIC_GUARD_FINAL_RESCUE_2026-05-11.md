# CloseFlow — Cases import static guard final rescue — 2026-05-11

## Cel

Naprawić runtime crash na `/cases` spowodowany brakującymi lub pomieszanymi importami w `src/pages/Cases.tsx`.

## Zakres

- `src/pages/Cases.tsx` ma jawny podział importów:
  - hooki Reacta z `react`,
  - router z `react-router-dom`,
  - ikony z `lucide-react`.
- `scripts/check-closeflow-cases-loader2-import.cjs` jest statycznym guardem kopiowanym 1:1, bez generowania przez heredoc/template.
- Guard sprawdza `useState`, `useRef`, `Loader2` i źródła importów.

## Weryfikacja

- `node --check scripts/check-closeflow-cases-loader2-import.cjs`
- `npm.cmd run check:closeflow-cases-loader2-import`
- `npm.cmd run verify:closeflow:quiet`

## Kryterium zakończenia

`/cases` nie może rzucać runtime błędów typu:

- `Loader2 is not defined`
- `useRef is not exported by react-router-dom`
- `useState is not defined`
