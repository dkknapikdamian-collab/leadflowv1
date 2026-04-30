# Stage 30 - PWA / instalacja aplikacji na telefonie

## Cel

Dodać bezpieczny fundament PWA dla CloseFlow bez budowania natywnej aplikacji Android/iOS.

## Zakres zmian

- `public/manifest.webmanifest` ma nazwę `CloseFlow`, `display: standalone`, start URL, scope, kolory i ikonę.
- `public/service-worker.js` cacheuje tylko app shell i assety, a omija API oraz ścieżki danych.
- `src/components/PwaInstallPrompt.tsx` pokazuje prompt tylko wtedy, gdy przeglądarka wystawi `beforeinstallprompt`.
- `src/App.tsx` montuje prompt PWA globalnie.
- `src/pages/Settings.tsx` zawiera krótką instrukcję dodania aplikacji do ekranu głównego na Android Chrome i iPhone Safari.
- `src/pages/Today.tsx` nie pokazuje lokalnego hałasu o globalnych akcjach i ukrywa lejek w Dziś.

## Czego nie zmieniono

- routing,
- auth,
- API,
- model danych,
- cache API,
- natywne push notifications.

## Testy automatyczne

Dodany test:

```text
tests/stage30-pwa-install-foundation.test.cjs
```

Sprawdza:

- istnienie manifestu,
- `display: standalone`,
- `name` i `short_name`,
- ostrożny service worker bez cache API,
- mount promptu PWA,
- instrukcję w ustawieniach,
- usunięcie leja i tekstu o globalnych akcjach z Dziś.

## Test ręczny

1. `npm.cmd run build`
2. `npm.cmd run preview`
3. DevTools -> Application -> Manifest.
4. Sprawdź installability w Chrome.
5. Android Chrome: menu -> Dodaj do ekranu głównego.
6. iPhone Safari: Udostępnij -> Do ekranu początkowego.
7. Sprawdź logowanie po odświeżeniu i po ponownym otwarciu PWA.
