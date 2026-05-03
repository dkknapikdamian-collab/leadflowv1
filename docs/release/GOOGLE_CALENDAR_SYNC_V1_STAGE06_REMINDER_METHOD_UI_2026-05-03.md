# Google Calendar Sync V1 - Stage 06 Reminder Method UI v3

## Cel

DodaÄ‡ uĹĽytkownikowi ustawienie typu przypomnienia wysyĹ‚anego do Google Calendar.

To jest ustawienie domyĹ›lne dla nowych i edytowanych wydarzeĹ„.

## Opcje

- `default` - domyĹ›lne przypomnienia z Google Calendar,
- `popup` - powiadomienie w Google Calendar,
- `email` - e-mail z Google Calendar,
- `popup_email` - powiadomienie + e-mail.

## Co wdroĹĽono

- `src/lib/google-calendar-reminder-preferences.ts`
  - localStorage preference,
  - walidacja metody,
  - walidacja minut,
  - doklejanie preferencji do payloadu wydarzenia.
- `src/pages/Settings.tsx`
  - panel `Przypomnienia Google Calendar`,
  - select metody,
  - input minut,
  - zapis preferencji.
- `src/lib/supabase-fallback.ts`
  - `insertEventToSupabase` dokleja preference,
  - `updateEventInSupabase` dokleja preference.

## RĂłĹĽnica v3

v2 padĹ‚ na dokĹ‚adnym anchorze JSX w `Settings.tsx`. v3 uĹĽywa regexu po strukturze:

`<section className="settings-main-column">`

i nie zaleĹĽy od CRLF.

## Brak SQL

Ten etap nie wymaga SQL.

## Kryterium zakoĹ„czenia

Przechodzi:

- `npm run check:google-calendar-stage06-reminder-method-ui`
- `npm run check:vercel-hobby-function-budget`
- `npm run check:google-calendar-stage05-reminder-method-backend`
- `npm run check:google-calendar-sync-v1-event-wiring`
- `npm run check:ui-truth`
- `npm run build`
