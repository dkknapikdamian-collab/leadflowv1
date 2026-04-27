# HOTFIX ClientDetail lint labels v7 — 2026-04-27

## Cel

Domknięcie dwóch regresji po v6:

- naprawa składni `scripts/check-today-week-client-more-ui-text-cleanup.cjs`, gdzie poprzedni hotfix źle przepisał backslashe w regexie,
- ujednolicenie etykiet w `src/pages/CaseDetail.tsx`, żeby test `ui-completed-label-consistency` nie znajdował już wzorca `Zakończ`.

## Zmienione pliki

- `scripts/check-today-week-client-more-ui-text-cleanup.cjs`
- `src/pages/CaseDetail.tsx`

## Nie zmieniono

- AI Drafts.
- Supabase API.
- Today tiles.
- Routing.
- Logika biznesowa zapisów.
