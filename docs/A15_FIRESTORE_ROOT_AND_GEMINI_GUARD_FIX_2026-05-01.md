# A15 — Firestore root removal + Gemini client guard fix

## Cel

Domknąć czerwone punkty po A14:

1. `src/firebase.ts` nadal inicjował `getFirestore()` i eksportował `db`.
2. Guard Gemini skanował `src/server/*`, czyli kod serwerowy, mimo że test ma pilnować tylko klienta/bundla frontu.

## Zmienione pliki

- `src/firebase.ts`
- `scripts/check-a13-critical-regressions.cjs`
- `scripts/install-a15-package-scripts.cjs`

## Zasada

- Firebase Auth może zostać tymczasowo jako warstwa logowania.
- Firebase Storage może zostać jako legacy runtime, jeśli aktualnie aplikacja go jeszcze importuje.
- Firestore nie może być inicjalizowany ani eksportowany.
- Sekret Gemini może występować tylko w kodzie serwerowym, nie w źródłach klienta.

## Po wdrożeniu

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run test:critical
```

## Kryterium zakończenia

A13 nie pokazuje już:

- `src/firebase.ts: import { getFirestore } from 'firebase/firestore'`
- `Gemini secret reference in client source: src/server/...`
