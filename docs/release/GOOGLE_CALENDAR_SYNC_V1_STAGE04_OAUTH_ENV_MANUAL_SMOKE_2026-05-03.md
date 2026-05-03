# Google Calendar Sync V1 - Stage 04 OAuth ENV setup and manual smoke

## Cel

Ten etap nie dodaje kolejnej funkcji w kodzie. Domyka konfiguracje produkcyjna Google Calendar Sync V1:

- Google Cloud OAuth,
- ENV w Vercel,
- redirect URI,
- manual smoke test,
- zasady oceny, czy funkcja jest gotowa do pokazania jako aktywna.

## Aktualny stan po Stage 01-03b

W repo mamy:

- fundament backendu OAuth/status/connect/disconnect,
- migracje SQL wykonane w Supabase,
- sync eventow CloseFlow -> Google Calendar,
- panel w Ustawieniach,
- konsolidacje funkcji pod Vercel Hobby,
- publiczny endpoint `/api/google-calendar` przez rewrite do `/api/system?kind=google-calendar`.

Google Calendar w product truth zostaje jako `requires_config`, dopoki nie przejdzie prawdziwy smoke test z kontem Google.

## Wymagane ENV w Vercel

Ustaw w Vercel dla Production oraz Preview, jezeli testujesz preview:

```text
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://closeflowapp.vercel.app/api/google-calendar?route=callback
GOOGLE_TOKEN_ENCRYPTION_KEY=...
GOOGLE_OAUTH_STATE_SECRET=...
```

Jezeli testujesz inny deployment/preview URL, `GOOGLE_REDIRECT_URI` musi wskazywac dokladnie ten host.

## Generowanie sekretow w PowerShell

Wygeneruj dwa osobne sekrety:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)); [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Pierwszy wklej jako:

```text
GOOGLE_TOKEN_ENCRYPTION_KEY
```

Drugi wklej jako:

```text
GOOGLE_OAUTH_STATE_SECRET
```

## Google Cloud - minimalny setup

W Google Cloud Console:

1. Utworz projekt albo wybierz projekt aplikacji.
2. Wlacz Google Calendar API.
3. Skonfiguruj OAuth consent screen.
4. Dodaj siebie jako test user, jezeli aplikacja jest w trybie testowym.
5. Utworz OAuth Client ID typu Web application.
6. Dodaj Authorized redirect URI:

```text
https://closeflowapp.vercel.app/api/google-calendar?route=callback
```

7. Skopiuj Client ID i Client Secret do Vercel ENV.

## Wazne

Redirect URI w Google Cloud musi byc identyczny jak `GOOGLE_REDIRECT_URI` w Vercel. Nawet roznica domeny, protokolu albo query string rozwali OAuth.

## Manual smoke test

Po ustawieniu ENV zrob Redeploy w Vercel, potem:

1. Zaloguj sie jako admin albo uzytkownik platnego planu.
2. Wejdz: Ustawienia -> Google Calendar.
3. Kliknij `Odśwież status`.
4. Oczekiwany wynik: brak komunikatu o brakujacych ENV.
5. Kliknij `Połącz Google`.
6. Zatwierdz OAuth Google.
7. Po powrocie do aplikacji kliknij ponownie `Odśwież status`.
8. Oczekiwany wynik: status `Połączone`.
9. Wejdz w kalendarz CloseFlow.
10. Dodaj wydarzenie z tytulem testowym, np. `GCAL SMOKE TEST - CloseFlow`.
11. Otworz Google Calendar.
12. Oczekiwany wynik: wydarzenie pojawia sie w Google Calendar.
13. Edytuj wydarzenie w CloseFlow.
14. Oczekiwany wynik: wydarzenie aktualizuje sie w Google Calendar.
15. Usun wydarzenie w CloseFlow.
16. Oczekiwany wynik: wydarzenie znika albo jest anulowane w Google Calendar.

## Co sprawdzic w bazie

W Supabase sprawdz:

```sql
select id, workspace_id, user_id, google_calendar_id, sync_enabled, disconnected_at, last_error, updated_at
from google_calendar_connections
order by updated_at desc
limit 10;
```

Dla eventu:

```sql
select id, title, google_calendar_sync_enabled, google_calendar_event_id, google_calendar_sync_status, google_calendar_sync_error, google_calendar_synced_at, google_calendar_html_link
from work_items
where kind = 'event'
order by updated_at desc
limit 20;
```

## Kryterium zaliczenia Stage 04

Stage 04 jest zaliczony dopiero gdy:

- Vercel deploy jest zielony,
- `/api/google-calendar?route=status` nie zwraca braku ENV,
- OAuth connect przechodzi,
- `google_calendar_connections` ma aktywne polaczenie,
- utworzenie eventu w CloseFlow tworzy event w Google Calendar,
- edycja eventu w CloseFlow aktualizuje Google Calendar,
- usuniecie eventu w CloseFlow usuwa/anuluje Google Calendar,
- zwykly uzytkownik bez platnego planu nie ma aktywnego syncu.

## Czego nie robimy w Stage 04

- Nie robimy Google -> CloseFlow.
- Nie robimy automatycznego backfillu starych wydarzen.
- Nie oznaczamy funkcji jako `active`, dopoki smoke test nie przejdzie.
- Nie wlaczamy tej funkcji dla Free jako aktywnej funkcji platnej.
