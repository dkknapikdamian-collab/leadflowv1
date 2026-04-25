# Today layout + daily digest cron guard

Data: 2026-04-25

## Cel

Naprawic rozjechany widok Dzis, gdzie tekst zadania potrafil zawijac sie po jednej literze, oraz domknac autoryzacje crona daily digest przy ustawionym CRON_SECRET.

## Problem UI

Prawa strona kafelka z przyciskami zabierala szerokosc, a tytul zostawal scisniety do bardzo waskiej kolumny. Efekt: tekst szedl pionowo po jednej literze.

## Zmiana UI

- akcje w Today moga zawijac sie i schodzic pod tresc,
- kafelki przechodza w uklad kolumnowy na mniejszych szerokosciach,
- przyciski nie zabieraja calej szerokosci tytulowi.

## Problem digestu

W Vercel jest ustawiony CRON_SECRET. Endpoint daily digest pilnowal secretu przed sprawdzeniem naglowka Vercel Cron, wiec przy niektorych konfiguracjach cron mogl byc odrzucany.

## Zmiana digestu

- x-vercel-cron jest akceptowany jako wywolanie crona,
- CRON_SECRET nadal chroni reczne i zewnetrzne wywolania,
- test pilnuje kolejnosci guardow.

## Vercel ENV

Wymagane:
- RESEND_API_KEY
- DIGEST_FROM_EMAIL
- NEXT_PUBLIC_APP_URL albo APP_URL

Juz widoczne u Ciebie:
- RESEND_API_KEY
- CRON_SECRET
- NEXT_PUBLIC_APP_URL

Do dodania/brakuje najpewniej:
- DIGEST_FROM_EMAIL

Przyklad:
CloseFlow <noreply@twojadomena.pl>

W Resend domena nadawcy musi byc zweryfikowana, jezeli mail ma isc do zwyklych odbiorcow.

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi,
- widok Dzis nie zawija tytulu po jednej literze,
- daily digest ma cron co godzine,
- Vercel ma poprawne ENV dla Resend.
