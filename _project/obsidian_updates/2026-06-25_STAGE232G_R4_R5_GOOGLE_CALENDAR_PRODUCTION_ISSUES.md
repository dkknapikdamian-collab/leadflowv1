# 2026-06-25_STAGE232G_R4_R5_GOOGLE_CALENDAR_PRODUCTION_ISSUES

Data/czas: 2026-06-25 13:29 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
status: OBSIDIAN_PAYLOAD / TO_SYNC

## Kontekst

Po STAGE232G_R3 Google Calendar onboarding Damian potwierdzil, ze synchronizacja dziala, ale pojawily sie dwa produkcyjne problemy:

1. Google OAuth pokazuje ekran `Google hasn't verified this app`.
2. Wpis dodany w CloseFlow na 13:19 pokazuje sie w Google Calendar jako 15:19.

## Klasyfikacja

### Problem 1 - Google hasn't verified this app

- stage: `STAGE232G_R5_GOOGLE_OAUTH_PRODUCTION_VERIFICATION_CONFIG`
- typ: CONFIG / GOOGLE_CLOUD / PRODUCTION_VERIFICATION
- status: PRIORYTET_PRODUKCYJNY / DO_WYKONANIA_W_GOOGLE_CLOUD
- plik repo: `_project/runs/STAGE232G_R5_GOOGLE_OAUTH_PRODUCTION_VERIFICATION_CONFIG.md`

Werdykt: nie jest to bug synchronizacji. Aplikacja prosi o `calendar.events`, wiec Google moze wymagac OAuth consent verification i poprawnych domen/polityk/test users.

### Problem 2 - 13:19 -> 15:19

- stage: `STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT`
- typ: CODE BUG / OUTBOUND_TIMEZONE_PARSE_BUG
- status: PRIORYTET_NAPRAWY / DO_WDROZENIA_NEXT
- plik repo: `_project/runs/STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT_PRIORITY.md`

Werdykt: `google-calendar-outbound.ts` ma lokalny `asIsoDate()` oparty o `new Date(raw).toISOString()`. Przy timestampie bez offsetu backend moze potraktowac `13:19` jako UTC i potem wyslac do Google jako `15:19 Europe/Warsaw`.

## Kolejnosc produkcyjna

1. `STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT` - kodowy bug runtime, do naprawy ZIP/em z guardami.
2. `STAGE232G_R5_GOOGLE_OAUTH_PRODUCTION_VERIFICATION_CONFIG` - konfiguracja Google Cloud / OAuth verification, rownolegle do przygotowania, ale bez mieszania z R4.

## Czego nie mylic

- OAuth unverified screen nie jest naprawiany przez zmiane daty/strefy.
- Time shift nie jest naprawiany przez Google Cloud verification.
- Google Calendar consent musi zostac osobny od Google loginu.
- User-scoped outbound sync ma zostac fail-closed.

## Nastepny krok

Wdrozyc R4 jako najblizszy runtime hotfix:

- scan-first,
- guard/test,
- build,
- verify:closeflow:quiet,
- diff-check,
- selective commit/push,
- Vercel success,
- manual smoke 13:19 -> 13:19.
