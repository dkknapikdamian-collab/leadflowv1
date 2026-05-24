# CloseFlow Stage180 - Remove Tasks Rail Helper Copy

Data: 2026-05-24
Status: przygotowano lokalnie
Typ: UI / tasks right rail copy cleanup / pre-push fix

## DECYZJE DAMIANA

- Usunąć opis: `Bez klikania po zakładkach. Najpierw to, co wymaga ruchu.`
- Usunąć opis: `5 zadań, które najłatwiej zgubić w pracy operacyjnej.`
- `Szybki fokus` pozostaje usunięty.
- Po przejściu guardów i builda zrobić push.

## TESTY

```powershell
node scripts/check-stage180-remove-tasks-rail-helper-copy.cjs
node scripts/check-stage179c-tasks-polish-final-guard-repair.cjs
node scripts/check-stage179b-tasks-polish-guard-alignment.cjs
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
