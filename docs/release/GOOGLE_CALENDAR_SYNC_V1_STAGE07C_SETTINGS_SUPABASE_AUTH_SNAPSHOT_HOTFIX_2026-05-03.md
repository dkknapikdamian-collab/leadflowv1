# Google Calendar Sync V1 - Stage 07c Settings Supabase Auth Snapshot Hotfix v4

## Cel

Naprawić panel Google Calendar w Ustawieniach, który nadal opierał się miejscami na Firebase `auth.currentUser`.

## Objaw

W UI:

```text
Workspace albo użytkownik nie jest jeszcze gotowy.
```

albo brak reakcji przy kliknięciu status/connect.

## Przyczyna

Aplikacja działa już po Supabase/client-auth snapshot, ale Google Calendar UI w `Settings.tsx` sprawdzał wciąż wyłącznie:

```text
auth.currentUser?.uid
```

## Naprawa

- `Settings.tsx` importuje `useClientAuthSnapshot`.
- Dodano `activeUserId`:
  - Firebase UID, jeżeli istnieje,
  - Supabase auth snapshot UID,
  - fallback `workspaceProfile.id`.
- Dodano `activeUserEmail`:
  - Firebase email,
  - Supabase auth snapshot email,
  - fallback `workspaceProfile.email`.
- Cały blok Google Calendar od `GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT` do `handleSaveGoogleCalendarReminderPreference` jest czyszczony regexem:
  - `auth.currentUser?.uid` -> `activeUserId`,
  - `auth.currentUser.uid` -> `activeUserId`,
  - email z Firebase fallback -> `activeUserEmail`.
- App owner ma dostęp do Google Calendar tak samo jak admin.
- Nie dodano nowego `api/*.ts`.
- Nie dodano SQL.

## Różnica v4

v3 nadal opierało się na zbyt dokładnym tekście. v4 działa blokowo i usuwa każde użycie Firebase UID w sekcji Google Calendar.

## Manual smoke

Po zielonym deployu:

1. Wejdź w produkcję.
2. Wejdź: Ustawienia -> Google Calendar.
3. Kliknij: Odśwież status.
4. Status nie może milczeć przez brak `auth.currentUser`.
5. Kliknij: Połącz Google.
6. Jeżeli ENV są OK, powinien przejść redirect do Google OAuth.
