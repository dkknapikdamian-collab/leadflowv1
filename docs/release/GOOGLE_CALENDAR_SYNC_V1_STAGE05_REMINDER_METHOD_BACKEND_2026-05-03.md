# Google Calendar Sync V1 - Stage 05 Reminder Method Backend

## Cel

Dopelnic backend przypomnien Google Calendar.

Do tej pory Google dostawal przypomnienie jako `popup` wyliczone z `reminderAt`.

Stage 05 dodaje obsluge metod zgodnych z Google Calendar API:

- `default` - uzyj domyslnych przypomnien kalendarza Google,
- `popup` - powiadomienie w Google Calendar,
- `email` - email z Google Calendar,
- `popup_email` - popup + email.

## Co zmieniono

- `src/server/google-calendar-sync.ts`
  - dodano `GoogleReminderMethod`,
  - dodano `googleReminderMethod`,
  - dodano `googleReminderMinutesBefore`,
  - dodano budowanie Google `reminders.overrides` dla popup/email/popup+email.
- `api/work-items.ts`
  - event sync potrafi odczytac metode i minuty z body/row/reminder.
- `src/lib/options.ts`
  - dodano `GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS`.

## Czego ten etap jeszcze nie robi

Ten etap nie dodaje jeszcze selektora w formularzu kalendarza.

Powod: najpierw blokujemy backend contract i guard, potem dopinamy UI w nastepnym etapie bez ryzyka rozjazdu.

## Kryterium zakonczenia

Przechodzi:

- `npm run check:google-calendar-stage05-reminder-method-backend`
- `npm run check:vercel-hobby-function-budget`
- `npm run check:google-calendar-sync-v1-event-wiring`
- `npm run check:ui-truth`
- `npm run build`

## Nastepny etap

Google Calendar Sync V1 - Stage 06 Reminder Method UI

Tam formularz wydarzenia dostanie wybor:

- Domyslne z Google Calendar
- Powiadomienie Google
- Email Google
- Powiadomienie + email
