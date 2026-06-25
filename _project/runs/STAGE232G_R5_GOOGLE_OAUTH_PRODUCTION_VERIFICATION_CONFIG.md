# STAGE232G_R5_GOOGLE_OAUTH_PRODUCTION_VERIFICATION_CONFIG

Data/czas: 2026-06-25 13:29 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
status: PRIORYTET_PRODUKCYJNY / CONFIG_STAGE / DO_WYKONANIA_W_GOOGLE_CLOUD
current deployed commit: 452dd1f0

## Decyzja Damiana

Dzialamy produkcyjnie. Ekran Google `Google hasn't verified this app` ma byc zapisany jako osobny etap produkcyjny, zeby nie zgubic problemu i nie mylic go z bugiem runtime synchronizacji.

## Problem produkcyjny

Podczas laczenia Google Calendar uzytkownik widzi ekran:

```txt
Google hasn't verified this app
The app is requesting access to sensitive info in your Google Account.
```

To blokuje zaufanie i jest nieakceptowalne produkcyjnie.

## Audyt kodu / fakty

Sprawdzone pliki:

- `src/server/google-calendar-sync.ts`
- `src/pages/Settings.tsx`
- `src/lib/supabase-auth.ts`

Fakty:

1. `src/server/google-calendar-sync.ts` prosi o scope `https://www.googleapis.com/auth/calendar.events`.
2. Jest to osobny Calendar OAuth consent, niezalezny od Supabase Google login.
3. Kod ma poprawny kierunek bezpieczenstwa: nie podpina Calendar cicho, tylko wymaga zgody Google.
4. Ekran unverified nie jest bledem Reacta ani endpointu sync. To problem OAuth consent screen / Google Cloud verification / test users / authorized domains / scope declaration.

## Werdykt

```txt
CONFIG / GOOGLE_OAUTH_VERIFICATION_PRODUCTION_BLOCKER
```

## Zakres R5

1. Google Cloud Console:
   - sprawdzic, ktory projekt i OAuth client jest uzywany przez `GOOGLE_CLIENT_ID` w Vercel;
   - sprawdzic OAuth consent screen;
   - ustawic typ aplikacji/user type zgodnie z planem produkcyjnym;
   - dodac authorized domains dla domen produkcyjnych;
   - sprawdzic redirect URI zgodny z `GOOGLE_REDIRECT_URI` / `GOOGLE_CALENDAR_REDIRECT_URI`;
   - zadeklarowac scope `calendar.events`;
   - dodac Privacy Policy / Terms / Homepage, jesli Google wymaga;
   - dodac test users na czas testow, jesli aplikacja jest w trybie Testing;
   - wyslac verification request, jesli produkt ma byc publiczny.

2. Vercel env audit:
   - `GOOGLE_CLIENT_ID`,
   - `GOOGLE_CLIENT_SECRET`,
   - `GOOGLE_REDIRECT_URI` albo `GOOGLE_CALENDAR_REDIRECT_URI`,
   - `GOOGLE_TOKEN_ENCRYPTION_KEY`,
   - `GOOGLE_OAUTH_STATE_SECRET` albo fallback.

3. Produkt/UX:
   - jesli verification jest w toku, pokazac w instrukcji/testach, ze konta testowe musza byc dodane w Google Cloud;
   - nie ukrywac consentu i nie obchodzic Google.

## Czego nie robic

- Nie usuwac `calendar.events`, bo wtedy outbound sync przestanie tworzyc/edytowac wydarzenia.
- Nie uzywac osobistego konta Damiana jako obejscia produkcyjnego.
- Nie laczyc Calendar przez samo Google login bez consentu.
- Nie wlaczac workspace fallback tokenu dla zwyklych uzytkownikow.
- Nie zmieniac runtime sync tylko po to, zeby ukryc ekran Google.

## Warunek zamkniecia

Etap R5 mozna zamknac dopiero, gdy:

- Google Calendar connect dla nowego uzytkownika nie pokazuje unverified warning albo aplikacja jest swiadomie w trybie testowym z wpisanymi test users;
- OAuth consent screen ma poprawne domeny i scope'y;
- Vercel env pasuje do Google Cloud OAuth client;
- wynik jest zapisany w Obsidianie i repo.

## Status

```txt
STAGE232G_R5:
PRIORYTET_PRODUKCYJNY / CONFIG_STAGE / DO_WYKONANIA_W_GOOGLE_CLOUD
```

## Nastepny krok

Najpierw naprawic kodowy bug R4 time shift. R5 rownolegle przygotowac jako checklista Google Cloud Console, bo verification moze wymagac czasu i danych prawnych/polityk.
