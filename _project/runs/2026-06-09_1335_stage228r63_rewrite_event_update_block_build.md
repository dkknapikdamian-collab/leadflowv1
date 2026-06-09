# Stage228R63 - rewrite event update block and build

- data i godzina: 2026-06-09 13:35 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: runtime syntax repair / build repair
- status: prepared by ZIP runner

## Powod

R62 przepuscil guardy R25/R41/R47-R62 i testy, ale build wykryl uszkodzony ogon w updateEventInSupabase: `}) { return callApi... }`.

## Zakres

- przepisanie calego bloku updateEventInSupabase do przed deleteEventFromSupabase
- zachowanie PATCH /api/events
- zachowanie applyGoogleCalendarReminderPreferenceToEventPayload
- zachowanie no-flicker event update emit
- pelny stack R25/R41/R47-R63 + build + diff-check

## Audyt ryzyk po etapie

- Ryzyko: po naprawie task block analogiczny blad mogl pozostac w event block. Kontrola: R63 przepisuje caly event update block.
- Ryzyko: event update mogl zgubic reminder preference helper. Kontrola: R63 guard wymaga helpera.
- Ryzyko: TS/TSX syntaktycznie przechodzi dopiero przez Vite build. Kontrola: build jest obowiazkowy przed commit/push.
