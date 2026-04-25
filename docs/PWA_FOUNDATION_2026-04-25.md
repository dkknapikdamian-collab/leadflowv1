# CloseFlow PWA foundation

Data: 2026-04-25

## Cel

Dodać podstawę PWA zgodnie z zakresem V1 bez ruszania logiki leadów, spraw, billingów ani API.

## Co zmienia etap

- `index.html` ma manifest, theme-color, opis aplikacji i mobilne meta tagi.
- `public/manifest.webmanifest` definiuje nazwę, tryb standalone, kolor, ikonę i skróty.
- `public/icons/closeflow-icon.svg` dodaje ikonę aplikacji.
- `public/service-worker.js` cacheuje tylko statyczną skorupę aplikacji i assety.
- `src/pwa/register-service-worker.ts` rejestruje service worker tylko na produkcji.
- `src/main.tsx` odpala rejestrację przed renderem aplikacji.

## Zasady bezpieczeństwa

- service worker nie cacheuje `/api/`,
- service worker nie cacheuje ścieżek `/supabase/`,
- service worker działa tylko dla requestów GET z tego samego originu,
- dane biznesowe nie są agresywnie cacheowane.

## Dlaczego

V1 ma być aplikacją webową działającą wygodnie na komputerze i telefonie, z możliwością dodania do ekranu głównego. Ten etap daje fundament PWA bez ryzykownego mieszania w runtime danych.

## Kryterium zakończenia

- `index.html` wskazuje manifest,
- manifest ma tryb `standalone`, ikonę i skróty,
- service worker nie dotyka endpointów API,
- test `tests/pwa-foundation.test.cjs` przechodzi,
- release gate zawiera test PWA.
