# Stage34C - Calendar leads typefix

## Cel

Dokończyć Stage34B po błędzie TypeScript:

`CalendarBundle.leads` było zadeklarowane jako `never[]`, mimo że Stage34B zaczął zwracać realne leady do kalendarza.

## Zakres

- `src/lib/calendar-items.ts`
- zmiana typu `leads: never[]` na `leads: Record<string, unknown>[]`
- brak zmian w routingu, auth, API, modelu danych i UI poza kontynuacją już nałożonego Stage34B

## Testy

- `node scripts/check-stage34c-calendar-leads-typefix.cjs`
- `node scripts/check-polish-mojibake.cjs`
- `npm.cmd run lint`
- `npm.cmd run build`
