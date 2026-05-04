# CloseFlow Stage45A — task reminders hardening v8

Data: 2026-05-04
Branch: dev-rollout-freeze

## Cel

Domknąć przypomnienia w zadaniach bez dokładania nowego modułu i bez zmiany głównego UI.

## Zakres

- Formularz nowego zadania pokazuje opcje przypomnienia.
- Formularz edycji zadania pokazuje opcje przypomnienia.
- Task przy zmianie statusu nie traci scheduledAt, reminderAt ani recurrenceRule.
- Task przy przesunięciu terminu przelicza reminderAt, także gdy rekord ma tylko zapisane reminderAt bez pełnego obiektu reminder.
- Zakładka Zadania nie ma lokalnego CTA Dodaj zadanie. Tworzenie zadania zostaje w globalnym pasku szybkich akcji.
- Dodany guard verify:task-reminders.
- v5/v6/v7 wymusza pełny kontrakt REMINDER_OFFSET_OPTIONS, w tym 15 minut wcześniej, bez zależności od formatowania pliku.
- v6 przywraca dokładny import Stage16 CSS w `src/index.css`, którego wymaga istniejący globalny lint.

## Nie zmieniono

- modelu billing/trial/access,
- Google Calendar sync,
- flow lead -> sprawa,
- globalnych szybkich akcji,
- routingu.

## Weryfikacja automatyczna

```powershell
npm.cmd run verify:task-reminders
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

## Test ręczny

1. Wejdź w /tasks.
2. Potwierdź brak lokalnego CTA Dodaj zadanie.
3. Dodaj zadanie z globalnego paska.
4. Ustaw przypomnienie jednorazowe 15 minut wcześniej.
5. Edytuj zadanie i sprawdź, czy panel przypomnienia jest widoczny.
6. Przesuń termin o +1D.
7. Oznacz jako zrobione i przywróć do do zrobienia.
8. Sprawdź, czy zadanie nadal ma dane przypomnienia.

## v9 TypeScript guard comment fix

- Naprawiono v8: fraza guardowa `Brak następnego kroku` jest teraz legalnym komentarzem TypeScript, nie surowym tekstem po instrukcji.
- Usunięto tymczasowe pliki `*.stage45a.bak`, żeby nie blokowały repo hygiene.

## v10 window timer type fix

- Naprawiono TypeScript: live refresh timers w Calendar, Tasks i TodayStable mają typ `number | null`, zgodny z `window.setTimeout`.
- Poprawka jest kompatybilna ze stanem po nieudanych paczkach v2-v9 i nie zmienia logiki przypomnień.
