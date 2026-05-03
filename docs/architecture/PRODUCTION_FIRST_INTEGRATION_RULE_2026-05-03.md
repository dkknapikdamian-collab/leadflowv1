# Production-First Integration Rule - CloseFlow

## Status

Permanentna zasada architektoniczna dla projektu CloseFlow / LeadFlow.

## Twarda zasada

CloseFlow pracuje production-first.

Dla integracji zewnętrznych, OAuth, ENV, redirect URI, webhooków i deploymentów ustawiamy docelowe konfiguracje produkcyjne, a nie tymczasowe ustawienia testowe.

## Co to znaczy w praktyce

1. Vercel ENV ustawiamy przynajmniej dla `Production`.
2. Redirect URI ustawiamy na produkcyjny publiczny adres aplikacji.
3. OAuth Client tworzony dla funkcji produkcyjnej ma nazwę i konfigurację produkcyjną.
4. Dokumentacja release ma mówić, co jest aktywne produkcyjnie, co wymaga konfiguracji, a co czeka na weryfikację dostawcy.
5. Nie zostawiamy rzeczy jako `testing-only`, jeżeli da się ustawić je docelowo produkcyjnie.

## Wyjątek

Jeżeli dostawca technicznie blokuje publikację produkcyjną do czasu weryfikacji, konfigurujemy wszystko produkcyjnie, ale status u dostawcy może tymczasowo pozostać jako wymuszony stan przejściowy.

Przykład:

Google OAuth dla `https://www.googleapis.com/auth/calendar.events` może wymagać Google verification. Wtedy:

- używamy produkcyjnego Google Cloud projektu,
- używamy produkcyjnego OAuth Clienta,
- używamy produkcyjnego redirect URI,
- ustawiamy Vercel Production ENV,
- nie zmieniamy statusu funkcji w aplikacji na `active`, dopóki verification/smoke evidence nie przejdzie,
- w dokumentacji zapisujemy, że blokada wynika z procesu dostawcy, nie z testowego modelu wdrożenia.

## Google Calendar aktualna zasada

Dla Google Calendar Sync V1 produkcyjny redirect URI to:

```text
https://closeflowapp.vercel.app/api/google-calendar?route=callback
```

Nie używać `/api/system` jako redirect URI, mimo że Vercel rewrite kieruje `/api/google-calendar` do `api/system.ts`.

## Czego nie wolno

- Nie ustawiać losowych preview redirectów jako docelowej konfiguracji.
- Nie zostawiać aplikacji w trybie testowym, jeśli da się przejść na produkcję.
- Nie mieszać klienta OAuth od logowania z klientem OAuth od integracji, jeśli grozi to rozbiciem logowania.
- Nie oznaczać funkcji jako `active`, dopóki nie ma realnego smoke evidence.

## Kryterium zmiany statusu funkcji na active

Funkcja integracji może być oznaczona jako `active`, gdy:

1. Production ENV są ustawione.
2. Production redirect URI działa.
3. Provider nie blokuje dostępu albo verification jest zakończona.
4. Manual smoke evidence jest uzupełnione.
5. Guardy i build przechodzą.
