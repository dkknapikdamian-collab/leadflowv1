# Google Calendar Sync V1 - Stage 07 OAuth Smoke Evidence Gate

## Cel

Ten etap dodaje bramke dowodowa dla Google Calendar Sync V1.

Nie oznaczamy Google Calendar jako `active`, dopoki nie ma recznego dowodu, ze produkcyjny/preview deployment przeszedl prawdziwy smoke test OAuth.

## Dlaczego

Build i guardy potwierdzaja strukture kodu, ale nie potwierdzaja:

- czy Google Cloud OAuth ma poprawny redirect URI,
- czy Vercel ENV sa ustawione,
- czy token OAuth zapisuje sie w Supabase,
- czy CloseFlow realnie tworzy event w Google Calendar,
- czy edycja eventu aktualizuje Google Calendar,
- czy usuniecie eventu usuwa/anuluje event Google,
- czy przypomnienia Google Calendar trafiaja jako popup/email/default.

## Aktualny status

Google Calendar Sync V1 ma pozostac w product truth jako:

```text
requires_config
```

do czasu zaliczenia smoke testu.

## Warunek zmiany statusu na active

Mozna zmienic status Google Calendar na `active` dopiero gdy:

1. Vercel deploy dla aktualnego commita jest zielony.
2. ENV sa ustawione:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
   - `GOOGLE_TOKEN_ENCRYPTION_KEY`
   - `GOOGLE_OAUTH_STATE_SECRET`
3. Google Cloud OAuth ma identyczny redirect URI.
4. `/api/google-calendar?route=status` nie zwraca brakujacych ENV.
5. Connect OAuth przechodzi.
6. Supabase zapisuje aktywne polaczenie w `google_calendar_connections`.
7. Utworzenie eventu w CloseFlow tworzy event Google.
8. Edycja eventu w CloseFlow aktualizuje event Google.
9. Usuniecie eventu w CloseFlow usuwa/anuluje event Google.
10. Wybor przypomnienia z Ustawien jest widoczny w Google Calendar.
11. Nie przekroczono limitu 12 funkcji Vercel Hobby.
12. Zwykly uzytkownik bez planu platnego nie ma aktywnego Google sync.

## Evidence file

Po tescie trzeba uzupelnic:

```text
docs/release/GOOGLE_CALENDAR_SYNC_V1_STAGE07_MANUAL_SMOKE_EVIDENCE_2026-05-03.md
```

## Minimalny reczny smoke

1. Otworz aktualny deployment.
2. Zaloguj sie.
3. Wejdz: Ustawienia -> Google Calendar.
4. Kliknij status.
5. Polacz Google Calendar.
6. Po powrocie sprawdz status `connected`.
7. Ustaw przypomnienie: `Powiadomienie + e-mail`, 30 minut.
8. Dodaj event: `GCAL STAGE07 SMOKE - CREATE`.
9. Sprawdz w Google Calendar, czy event istnieje.
10. Zmien tytul w CloseFlow na `GCAL STAGE07 SMOKE - UPDATE`.
11. Sprawdz w Google Calendar, czy tytul sie zmienil.
12. Usun event w CloseFlow.
13. Sprawdz w Google Calendar, czy event zniknal albo jest anulowany.
14. Rozlacz Google Calendar.
15. Sprawdz w Supabase `google_calendar_connections`, czy `disconnected_at` zostalo ustawione.

## SQL kontrolny

```sql
select id, workspace_id, user_id, google_calendar_id, google_account_email, sync_enabled, disconnected_at, last_error, updated_at
from google_calendar_connections
order by updated_at desc
limit 10;
```

```sql
select id, title, google_calendar_sync_enabled, google_calendar_event_id, google_calendar_sync_status, google_calendar_sync_error, google_calendar_synced_at, google_calendar_html_link, google_calendar_reminders
from work_items
where kind = 'event'
order by updated_at desc
limit 20;
```

## Kryterium zakonczenia Stage 07

Stage 07 jako etap repo jest zaliczony, gdy:

- istnieje dokument gate,
- istnieje evidence template,
- guard Stage 07 przechodzi,
- build przechodzi,
- Vercel Hobby function budget guard przechodzi.

Stage 07 jako funkcja produktowa jest zaliczony dopiero po recznym uzupelnieniu evidence.
