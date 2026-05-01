# A14 - calendar schedule type hotfix

## Cel

Domknac etap utwardzania typow biznesowych po tym, jak TypeScript wykryl zbyt luzny typ `ScheduleRawRecord`.

## Zakres

- `src/lib/scheduling.ts`
- `src/pages/Calendar.tsx`
- `src/lib/task-event-contract.ts`

## Zasada

`ScheduleEntry.raw` dalej moze przenosic starsze pola z Supabase, ale najwazniejsze pola uzywane przez kalendarz sa jawnie opisane i nie plyna przez `any`.

## Walidacja

Paczka zatrzymuje push, jesli nie przejda:

- `npm.cmd run check:a13-critical-regressions`
- `npm.cmd run check:a14-business-types`
- `npm.cmd run test:critical`
- `npm.cmd run lint`
- `npm.cmd run build`
