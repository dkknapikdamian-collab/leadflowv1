# Vercel Hobby API Function Budget Rule - CloseFlow

## Status

Permanentna zasada architektoniczna dla projektu CloseFlow / LeadFlow.

## Problem

Vercel Hobby ma limit:

```text
maksymalnie 12 Serverless Functions
```

W praktyce kazdy osobny plik w katalogu:

```text
api/*.ts
api/*.js
```

moze liczyc sie jako osobna funkcja Vercel.

Przekroczenie limitu powoduje czerwony deployment mimo tego, ze lokalny `vite build` przechodzi.

Typowy blad:

```text
No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan.
```

## Twarda zasada

Nie dodawac nowych plikow `api/*.ts` bez sprawdzenia limitu.

Kazda nowa funkcja backendowa ma domyslnie isc do istniejacego agregatora:

```text
api/system.ts
```

przez parametr:

```text
/api/system?kind=nazwa-funkcji
```

Jesli potrzebny jest publiczny ladny URL, dodac rewrite w:

```text
vercel.json
```

Przyklad:

```json
{
  "source": "/api/google-calendar",
  "destination": "/api/system?kind=google-calendar"
}
```

## Poprawny model dodawania nowej funkcji

Zamiast tworzyc:

```text
api/nowa-funkcja.ts
```

robimy:

```text
src/server/nowa-funkcja-handler.ts
```

i dopinamy w:

```text
api/system.ts
```

Przyklad:

```ts
import newFeatureHandler from '../src/server/new-feature-handler.js';

if (kind === 'new-feature') {
  await newFeatureHandler(req, res);
  return;
}
```

Opcjonalnie publiczny URL:

```json
{
  "source": "/api/new-feature",
  "destination": "/api/system?kind=new-feature"
}
```

## Kiedy wolno dodac nowy plik api

Tylko jezeli:

1. `npm run check:vercel-hobby-function-budget` nadal przechodzi.
2. Liczba plikow `api/*.ts` i `api/*.js` jest <= 12.
3. Jest jasny powod, dlaczego nie da sie dopiac tego do `api/system.ts`.
4. Decyzja jest opisana w dokumencie release albo architecture.

## Aktualny przyklad z Google Calendar

Nie trzymamy Google Calendar jako:

```text
api/google-calendar.ts
```

bo przebilo limit Vercel Hobby.

Poprawny stan:

```text
src/server/google-calendar-handler.ts
api/system.ts -> kind === 'google-calendar'
vercel.json -> /api/google-calendar -> /api/system?kind=google-calendar
```

Publiczny endpoint zostaje:

```text
/api/google-calendar
```

ale Vercel nie liczy tego jako osobnej funkcji, bo technicznie obsluguje to `api/system.ts`.

## Obowiazkowy guard

Przed commitem/pushem uruchomic:

```powershell
npm.cmd run check:vercel-hobby-function-budget
```

Ten guard ma pilnowac:

- maksymalnie 12 plikow funkcji w `api`,
- brak standalone `api/google-calendar.ts`,
- rewrite `/api/google-calendar`,
- route `kind === 'google-calendar'` w `api/system.ts`.

## Konsekwencja dla kolejnych etapow

Przy kazdej nowej integracji/backend feature:

- nie tworzyc automatycznie `api/nazwa.ts`,
- najpierw sprawdzic, czy da sie dopiac do `api/system.ts`,
- jezeli frontend potrzebuje starego/ladnego URL, zrobic rewrite w `vercel.json`,
- dodac albo rozszerzyc guard.

Ta zasada jest wazniejsza niz wygoda tworzenia osobnego endpointu.
