# Production-First Integration Rule - CloseFlow

## Status

Permanentna zasada architektoniczna dla projektu CloseFlow / LeadFlow.

## Twarda zasada

CloseFlow pracuje production-first.

Dla integracji zewnÄ™trznych, OAuth, ENV, redirect URI, webhookĂłw i deploymentĂłw ustawiamy docelowe konfiguracje produkcyjne, a nie tymczasowe ustawienia testowe.

## Co to znaczy w praktyce

1. Vercel ENV ustawiamy przynajmniej dla `Production`.
2. Redirect URI ustawiamy na produkcyjny publiczny adres aplikacji.
3. OAuth Client tworzony dla funkcji produkcyjnej ma nazwÄ™ i konfiguracjÄ™ produkcyjnÄ….
4. Dokumentacja release ma mĂłwiÄ‡, co jest aktywne produkcyjnie, co wymaga konfiguracji, a co czeka na weryfikacjÄ™ dostawcy.
5. Nie zostawiamy rzeczy jako `testing-only`, jeĹĽeli da siÄ™ ustawiÄ‡ je docelowo produkcyjnie.

## WyjÄ…tek

JeĹĽeli dostawca technicznie blokuje publikacjÄ™ produkcyjnÄ… do czasu weryfikacji, konfigurujemy wszystko produkcyjnie, ale status u dostawcy moĹĽe tymczasowo pozostaÄ‡ jako wymuszony stan przejĹ›ciowy.

PrzykĹ‚ad:

Google OAuth dla `https://www.googleapis.com/auth/calendar.events` moĹĽe wymagaÄ‡ Google verification. Wtedy:

- uĹĽywamy produkcyjnego Google Cloud projektu,
- uĹĽywamy produkcyjnego OAuth Clienta,
- uĹĽywamy produkcyjnego redirect URI,
- ustawiamy Vercel Production ENV,
- nie zmieniamy statusu funkcji w aplikacji na `active`, dopĂłki verification/smoke evidence nie przejdzie,
- w dokumentacji zapisujemy, ĹĽe blokada wynika z procesu dostawcy, nie z testowego modelu wdroĹĽenia.

## Google Calendar aktualna zasada

Dla Google Calendar Sync V1 produkcyjny redirect URI to:

```text
https://closeflowapp.vercel.app/api/google-calendar?route=callback
```

Nie uĹĽywaÄ‡ `/api/system` jako redirect URI, mimo ĹĽe Vercel rewrite kieruje `/api/google-calendar` do `api/system.ts`.

## Czego nie wolno

- Nie ustawiaÄ‡ losowych preview redirectĂłw jako docelowej konfiguracji.
- Nie zostawiaÄ‡ aplikacji w trybie testowym, jeĹ›li da siÄ™ przejĹ›Ä‡ na produkcjÄ™.
- Nie mieszaÄ‡ klienta OAuth od logowania z klientem OAuth od integracji, jeĹ›li grozi to rozbiciem logowania.
- Nie oznaczaÄ‡ funkcji jako `active`, dopĂłki nie ma realnego smoke evidence.

## Kryterium zmiany statusu funkcji na active

Funkcja integracji moĹĽe byÄ‡ oznaczona jako `active`, gdy:

1. Production ENV sÄ… ustawione.
2. Production redirect URI dziaĹ‚a.
3. Provider nie blokuje dostÄ™pu albo verification jest zakoĹ„czona.
4. Manual smoke evidence jest uzupeĹ‚nione.
5. Guardy i build przechodzÄ….
