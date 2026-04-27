# Hotfix ClientDetail simplified card view V5 — 2026-04-27

## Cel

Domknięcie ostatniej bramki `tests/client-detail-simplified-card-view.test.cjs` po wdrożeniu patcha AI Drafts + Today tiles.

## Zakres

- `src/pages/ClientDetail.tsx`
  - przywrócenie dokładnej frazy kontraktowej: `Tu nie prowadzimy pracy`
  - zachowanie istniejących markerów uproszczonego widoku klienta

## Poza zakresem

- brak zmian w logice Supabase
- brak zmian w routingu
- brak zmian w AI Drafts
- brak zmian w Today tiles

## Testy po wdrożeniu

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
```
