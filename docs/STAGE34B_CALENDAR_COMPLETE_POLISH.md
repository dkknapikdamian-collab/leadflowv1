# Stage34B - Calendar complete polish

## Cel

Dokończyć poprawki kalendarza po Stage34:

- dopiąć brakujące fallbacki dat zadań,
- włączyć lead next-action / follow-up do bundla kalendarza,
- poprawić widoczność zakończonych wpisów także w miesiącu,
- utrzymać jasne, czytelne pola formularzy dodawania i edycji,
- zatrzymać skrypt przy nieudanym checku zamiast iść dalej do commita.

## Zakres

- `src/lib/calendar-items.ts`
- `src/lib/scheduling.ts`
- `src/pages/Calendar.tsx`
- `src/index.css`
- `src/styles/stage34b-calendar-complete-polish.css`

## Nie zmienia

- routingu,
- auth,
- Supabase API,
- modelu danych,
- logiki rozliczeń,
- AI.

## Testy

- `node scripts/check-stage34b-calendar-complete-polish.cjs`
- `node scripts/check-polish-mojibake.cjs`
- `npm.cmd run lint`
- `npm.cmd run build`

## Ręcznie po wdrożeniu

Sprawdź:

1. Kalendarz miesięczny, czy dłuższe tytuły są czytelniejsze.
2. Kalendarz tygodniowy, czy wpadają zadania, wydarzenia i lead next-action.
3. Wpis zakończony, czy jest przekreślony i nie wygląda jak aktywny.
4. Edycję wydarzenia/zadania, czy pola są białe z ciemnym tekstem.
5. Mobile 390px i 430px.
