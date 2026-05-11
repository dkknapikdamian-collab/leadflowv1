# CloseFlow Cases import final rescue — 2026-05-11

## Cel

Naprawa czerwonego stanu po błędnych paczkach importów w `src/pages/Cases.tsx`.

## Zakres

- `src/pages/Cases.tsx`: rozdzielenie importów na właściwe źródła.
- `scripts/check-closeflow-cases-loader2-import.cjs`: odporny guard importów dla React / React Router / Lucide.

## Kontrakt

- React hooks i `FormEvent` tylko z `react`.
- `Link` i `useSearchParams` tylko z `react-router-dom`.
- `Loader2` i pozostałe ikony tylko z `lucide-react`.
- Commit i push wyłącznie po zielonym `verify:closeflow:quiet`.
