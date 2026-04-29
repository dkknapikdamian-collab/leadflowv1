# HOTFIX — Right rail dark wrappers (Activity / Szkice AI / Powiadomienia)

Cel: usunąć czarne / granatowe tło spod jasnych kart w prawej kolumnie na:

- `/activity`
- `/ai-drafts`
- `/notifications`

Zakres: tylko CSS + import CSS w stronach. Bez zmian logiki, danych, API.

## Co zmienione

- `src/styles/hotfix-right-rail-dark-wrappers.css`
- `src/pages/Activity.tsx`
- `src/pages/AiDrafts.tsx`
- `src/pages/NotificationsCenter.tsx`
- `tests/hotfix-right-rail-dark-wrappers.test.cjs`

## Jak sprawdzić lokalnie

1. Test hotfix: `node tests/hotfix-right-rail-dark-wrappers.test.cjs`
2. Mojibake: `node scripts/check-polish-mojibake.cjs`
3. Build: `npm.cmd run build`

## Test ręczny

- `/activity` desktop + mobile: prawa kolumna bez czarnych narożników/pasów
- `/ai-drafts` desktop + mobile: prawa kolumna bez czarnych narożników/pasów
- `/notifications` desktop + mobile: prawa kolumna bez czarnych narożników/pasów
- Sidebar ma pozostać ciemny (bez zmian).

