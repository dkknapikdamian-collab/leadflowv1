# CLOSEFLOW_STAGE14I_REPAIR6_FULL_PREFLIGHT_2026-05-12

Cel: domknac naprawe brakujacych wpisow w kalendarzu, gdy zadania / wydarzenia przychodza z backendu w snake_case.

Zakres:
- package.json: naprawa parsera i dodanie check:stage14i-calendar-snake-case-task-dates.
- src/lib/task-event-contract.ts: typy dla snake_case dat.
- src/lib/work-items/normalize.ts: runtime aliases dla due_at, date_time, starts_at, start_at, scheduled_date/time, due_date/time, start_date/time, end_date/time, reminder_at.
- scripts/check-stage14i-calendar-snake-case-task-dates.cjs: guard regresji.
- tools/repair-stage14i-calendar-snake-case-dates-repair6.cjs: idempotentny repair.

Bramki:
- node --check na nowych skryptach,
- JSON.parse(package.json),
- npm run check:stage14i-calendar-snake-case-task-dates,
- opcjonalnie Stage14H guard i P3 guard, jesli istnieja,
- npm run build.

Nie zmieniono UI kalendarza ani logiki usuwania duplikatow z 14H.
