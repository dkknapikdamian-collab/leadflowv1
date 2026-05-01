# A16 — Szablony: jasny UI zgodny z resztą aplikacji

## Cel

Naprawić zakładkę `Szablony`, która po poprzednim etapie nadal wyglądała jak ciemny panel oderwany od jasnego UI aplikacji.

## Zmienione pliki

- `src/pages/Templates.tsx`
- `scripts/check-a13-critical-regressions.cjs`

## Zakres

- Usunięto ciemne tokeny `app-surface-strong`, `app-text`, `app-muted` z `Templates.tsx`.
- Zmieniono karty statystyk, wyszukiwarkę, empty state, listę szablonów i dialog na jasne klasy Tailwind:
  - `bg-white`,
  - `border-slate-200`,
  - `text-slate-900`,
  - `text-slate-500`,
  - delikatne `shadow-sm`.
- Zostawiono logikę Supabase, dodawanie, edycję, duplikowanie i usuwanie szablonów.
- Nie ruszano routingu ani modelu danych.

## Guard

A13 sprawdza teraz, że `Templates.tsx` ma jasny wariant UI i nie wraca do ciemnych tokenów shellowych.

## Po wdrożeniu

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run test:critical
npm.cmd run build
```

## Kryterium zakończenia

Zakładka `Szablony` ma być czytelna na jasnym tle, bez ciemnych kafli i bez białego tekstu na jasnym tle.
