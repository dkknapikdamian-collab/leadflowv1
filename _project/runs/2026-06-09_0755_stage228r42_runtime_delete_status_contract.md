# Stage228R42 - runtime delete status contract

Data: 2026-06-09 07:55 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## FAKTY Z TESTU PRODUKCYJNEGO
- Runtime trace Damiana pokazaĹ‚, ĹĽe UI tworzy wpis przez POST /api/tasks.
- Przy usuwaniu UI wysyĹ‚a PATCH /api/tasks z body status=deleted.
- Backend odpowiada 200, ale dotychczas zwracaĹ‚/utrzymywaĹ‚ status todo.
- Wpis wracaĹ‚, poniewaĹĽ wspĂłlny normalizer statusu nie dopuszczaĹ‚ deleted i sprowadzaĹ‚ status do fallbacku todo/scheduled.

## ZMIANA
- Dodano deleted do TASK_STATUS_VALUES i EVENT_STATUS_VALUES.
- Dodano etykiety deleted do map statusĂłw.
- Dodano guard i test Stage228R42.

## TESTY DO WYKONANIA
- node scripts/check-stage228r42-runtime-delete-status-contract.cjs
- node --test tests/stage228r42-runtime-delete-status-contract.test.cjs
- npm run build
- git diff --check
- test produkcyjny po deployu: dodaj CF_DEL_TEST_3, usuĹ„, odĹ›wieĹĽ, sprawdĹş czy nie wraca.

## RYZYKA
- deleted staje siÄ™ dozwolonym statusem domenowym work_items. JeĹĽeli jakikolwiek widok nie filtruje status=deleted, moĹĽe pokazaÄ‡ techniczny status "Usuniete" zamiast ukrycia. Po deployu trzeba przetestowaÄ‡ Leads/Clients/Calendar/TasksStable.
- JeĹĽeli baza ma constraint blokujÄ…cy deleted, PATCH moĹĽe zaczÄ…Ä‡ zwracaÄ‡ bĹ‚Ä…d. Wtedy potrzebna bÄ™dzie migracja SQL dla statusĂłw work_items.
