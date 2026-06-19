# STAGE232I4_R14_R6_RUNTIME_SMOKE_FIX

Data: 2026-06-19 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

## Powód
Manual smoke obalił R5: po dodaniu braku klienta otwierał się manager Braki/Blokady, a nowy brak nie był widoczny w kafelku ani managerze.

## Naprawa
- `ClientTopTiles.onAddMissing` wymuszony na quick-add only.
- Po zapisie braku klienta zamykany jest quick modal i manager.
- Usunięty natychmiastowy `reload()` z handlera tworzenia braku klienta, żeby nie kasować optymistycznego rekordu zanim API/Supabase zwróci nową listę.
- Dodany guard `check-stage232i4-r14-r6-runtime-smoke-fix.cjs`, który sprawdza dokładnie zachowanie, którego nie złapały statyczne testy R4/R5.

## Testy
Do uruchomienia w apply:
- `node scripts/check-stage232i4-r14-client-lead-missing-tile-modal-parity.cjs`
- `node --test tests/stage232i4-r14-client-lead-missing-tile-modal-parity.test.cjs`
- `node scripts/check-stage232i4-r14-r6-runtime-smoke-fix.cjs`
- `npm run build`
- `git diff --check`

## Manual smoke
Wymagany po R6: klient add brak, brak widoczny od razu, manager nie otwiera się sam, F5 sprawdza persistence.

## Ryzyko
Jeśli po F5 brak znika, problem jest w API/persistencji `/api/tasks`, a nie tylko w UI state. Wtedy następny etap musi wejść w API route/tasks data contract.
