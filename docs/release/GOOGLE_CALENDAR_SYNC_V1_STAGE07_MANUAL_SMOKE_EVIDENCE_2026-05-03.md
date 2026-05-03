# Google Calendar Sync V1 - Stage 07 Manual Smoke Evidence

## Status

```text
NOT_RUN
```

Dozwolone wartosci:

```text
NOT_RUN
FAILED
PASSED
```

## Deployment

- Repo:
- Branch:
- Commit:
- Vercel deployment URL:
- App public URL:
- Test date/time:
- Tester:

## ENV evidence bez sekretow

Wpisz tylko TAK/NIE, bez wartosci sekretow:

| ENV | Ustawione? |
| --- | --- |
| GOOGLE_CLIENT_ID |  |
| GOOGLE_CLIENT_SECRET |  |
| GOOGLE_REDIRECT_URI |  |
| GOOGLE_TOKEN_ENCRYPTION_KEY |  |
| GOOGLE_OAUTH_STATE_SECRET |  |

## Google Cloud OAuth

- Google Calendar API wlaczone:
- OAuth consent screen skonfigurowany:
- Test user dodany, jezeli app jest w trybie testowym:
- Authorized redirect URI identyczny jak Vercel ENV:
- Redirect URI:

```text
https://closeflowapp.vercel.app/api/google-calendar?route=callback
```

## Smoke steps

| Krok | Wynik | Uwagi |
| --- | --- | --- |
| Vercel deploy zielony |  |  |
| `/api/google-calendar?route=status` bez brakujacych ENV |  |  |
| Connect Google przechodzi |  |  |
| Status po powrocie: connected |  |  |
| Supabase ma aktywne `google_calendar_connections` |  |  |
| Event CREATE w CloseFlow tworzy event w Google |  |  |
| Event UPDATE w CloseFlow aktualizuje Google |  |  |
| Event DELETE w CloseFlow usuwa/anuluje Google |  |  |
| Przypomnienie popup/email/default zgodne z ustawieniem |  |  |
| Disconnect ustawia `disconnected_at` |  |  |
| Zwykly user bez planu platnego nie ma aktywnego sync |  |  |

## Dane testowe

- Tytul create:

```text
GCAL STAGE07 SMOKE - CREATE
```

- Tytul update:

```text
GCAL STAGE07 SMOKE - UPDATE
```

- Google Calendar event ID:
- CloseFlow work_item/event ID:

## Supabase SQL result - google_calendar_connections

Wklej wynik bez sekretow:

```text

```

## Supabase SQL result - work_items

Wklej wynik bez sekretow:

```text

```

## Wynik koncowy

```text
NOT_RUN
```

## Decyzja

- Czy mozna zmienic Google Calendar z `requires_config` na `active`?
- Decyzja:
- Powod:
- Co zostaje do poprawy:
