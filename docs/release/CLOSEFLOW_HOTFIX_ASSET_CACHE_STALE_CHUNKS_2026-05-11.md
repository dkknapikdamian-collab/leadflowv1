# CloseFlow hotfix — stale chunk / CSS preload 404 po deployu

## Cel

Naprawić błąd po deployu, gdzie przeglądarka albo service worker trzyma stary frontend i próbuje pobrać nieistniejące już pliki typu:

- /assets/ClientDetail-*.js
- /assets/ClientDetail-*.css

Objaw w konsoli:

```text
Unable to preload CSS for /assets/ClientDetail-*.css
Failed to load resource: 404
APP_ROUTE_RENDER_FAILED
```

## Przyczyna

Vite generuje hashowane nazwy chunków. Po deployu nazwy są inne. Jeżeli użytkownik ma stary index albo starą mapę chunków w cache, aplikacja woła pliki z poprzedniego deployu. Na aktualnym deployment aliasie Vercel ich już nie ma, więc jest 404 i route crash.

## Zmiany

- Service worker nie cacheuje już / ani /assets/*.js / /assets/*.css.
- Service worker czyści stare cache closeflow-* przy aktywacji.
- Vercel dostaje no-store dla app shell, route fallbacków i /service-worker.js.
- Hashowane /assets zostają immutable.
- Dodano runtime guard, który przy stale chunk / CSS preload error czyści cache i robi jeden reload.
- ErrorBoundary uruchamia ten sam guard przy błędzie route renderu.
- Naprawiono nieucieczony CSS selector .text-[12px].

## Kryterium zakończenia

Po deployu użytkownik nie zostaje na białym ekranie / error boundary przez stare chunk IDs. Przy pierwszym trafieniu w stare assety aplikacja wykonuje jednorazowy reload na świeży build.
