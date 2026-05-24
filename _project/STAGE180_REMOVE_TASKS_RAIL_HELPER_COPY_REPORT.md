# STAGE180 Remove Tasks Rail Helper Copy - raport

Data: 2026-05-24
Projekt: CloseFlow / LeadFlow
Zakres: UI / tasks right rail copy cleanup / pre-push guard

## Cel

Usunąć z prawego panelu zadań dwa opisy:

- Bez klikania po zakładkach. Najpierw to, co wymaga ruchu.
- 5 zadań, które najłatwiej zgubić w pracy operacyjnej.

## FAKTY

- Stage178 i Stage178B guardy przechodzą.
- Build przechodzi.
- Finalny kontrakt: zostają nagłówki `Filtry zadań` i `Najpilniejsze zadania`, bez opisów pod nimi.
- `Szybki fokus` nadal ma być usunięty.

## TESTY

node scripts/check-stage180-remove-tasks-rail-helper-copy.cjs
node scripts/check-stage179c-tasks-polish-final-guard-repair.cjs
node scripts/check-stage179b-tasks-polish-guard-alignment.cjs
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build

## CZEGO NIE RUSZANO

- deploy
- Supabase
- auth
- Google Calendar
- Stripe
- AI
