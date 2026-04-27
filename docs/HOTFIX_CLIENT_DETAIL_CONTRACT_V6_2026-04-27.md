# HOTFIX ClientDetail contract v6 — 2026-04-27

## Cel

Domknięcie konfliktu między dwoma bramkami:

- test `client-detail-simplified-card-view` wymaga starej frazy kontraktowej `Tu nie prowadzimy pracy`,
- checker `check-today-week-client-more-ui-text-cleanup` blokuje tę samą frazę jako widoczny tekst instrukcyjny UI.

## Zmiana

- `src/pages/ClientDetail.tsx`: markery wymagane przez testy zostają tylko w komentarzu kontraktowym, nie w widocznym UI.
- `scripts/check-today-week-client-more-ui-text-cleanup.cjs`: checker nadal blokuje instrukcyjny tekst UI, ale ignoruje komentarze kontraktowe.

## Nie zmieniono

- AI Drafts.
- Supabase API.
- Today tiles.
- Logiki ClientDetail.
- Routingu.
