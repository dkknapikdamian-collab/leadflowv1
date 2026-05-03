# Google Calendar Sync V1 - Stage 07c Settings Supabase Auth Snapshot Hotfix v4

## Cel

NaprawiÄ‡ panel Google Calendar w Ustawieniach, ktĂłry nadal opieraĹ‚ siÄ™ miejscami na Firebase `auth.currentUser`.

## Objaw

W UI:

```text
Workspace albo uĹĽytkownik nie jest jeszcze gotowy.
```

albo brak reakcji przy klikniÄ™ciu status/connect.

## Przyczyna

Aplikacja dziaĹ‚a juĹĽ po Supabase/client-auth snapshot, ale Google Calendar UI w `Settings.tsx` sprawdzaĹ‚ wciÄ…ĹĽ wyĹ‚Ä…cznie:

```text
auth.currentUser?.uid
```

## Naprawa

- `Settings.tsx` importuje `useClientAuthSnapshot`.
- Dodano `activeUserId`:
  - Firebase UID, jeĹĽeli istnieje,
  - Supabase auth snapshot UID,
  - fallback `workspaceProfile.id`.
- Dodano `activeUserEmail`:
  - Firebase email,
  - Supabase auth snapshot email,
  - fallback `workspaceProfile.email`.
- CaĹ‚y blok Google Calendar od `GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT` do `handleSaveGoogleCalendarReminderPreference` jest czyszczony regexem:
  - `auth.currentUser?.uid` -> `activeUserId`,
  - `auth.currentUser.uid` -> `activeUserId`,
  - email z Firebase fallback -> `activeUserEmail`.
- App owner ma dostÄ™p do Google Calendar tak samo jak admin.
- Nie dodano nowego `api/*.ts`.
- Nie dodano SQL.

## RĂłĹĽnica v4

v3 nadal opieraĹ‚o siÄ™ na zbyt dokĹ‚adnym tekĹ›cie. v4 dziaĹ‚a blokowo i usuwa kaĹĽde uĹĽycie Firebase UID w sekcji Google Calendar.

## Manual smoke

Po zielonym deployu:

1. WejdĹş w produkcjÄ™.
2. WejdĹş: Ustawienia -> Google Calendar.
3. Kliknij: OdĹ›wieĹĽ status.
4. Status nie moĹĽe milczeÄ‡ przez brak `auth.currentUser`.
5. Kliknij: PoĹ‚Ä…cz Google.
6. JeĹĽeli ENV sÄ… OK, powinien przejĹ›Ä‡ redirect do Google OAuth.
