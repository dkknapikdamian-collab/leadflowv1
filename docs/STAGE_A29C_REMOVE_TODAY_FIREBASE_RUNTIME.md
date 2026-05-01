# STAGE A29C - domknięcie usunięcia Firebase Auth z Today

## Cel

Domknąć etap A29 po tym, jak A29b wypchnął poprawkę `Layout.tsx`, ale `Today.tsx` nadal miał import Firebase Auth.

## Zakres

- `src/pages/Today.tsx`
  - usuwa `import { auth } from '../firebase';`
  - sprawdza, że ekran Dziś nie używa `auth.*`

## Nie zmieniono

- wyglądu Today,
- logiki kafelków,
- routingu,
- formularzy,
- danych Supabase,
- `Layout.tsx`, jeśli A29b już go poprawił.

## Testy

- `npm run check:a29-supabase-runtime-shell`
- `npm run test:critical`
- `npm run build`

## Kryterium zakończenia

Guard A29 przechodzi, a `Today.tsx` nie ma już importu `../firebase` ani runtime użycia Firebase Auth.
