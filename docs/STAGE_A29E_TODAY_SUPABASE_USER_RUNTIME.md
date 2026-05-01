# STAGE A29E - Today bez Firebase Auth runtime

## Cel

Domknąć P0 po A29B/A29C/A29D: ekran `Dziś` nie może używać Firebase Auth w runtime.

## Zakres

- `src/pages/Today.tsx`
  - usuwa `import { auth } from '../firebase';`
  - dodaje `useSupabaseSession()`
  - tworzy `activeUserId` z Supabase session
  - zamienia `auth.currentUser`, `auth.currentUser.uid`, `auth.currentUser?.uid` na `activeUserId`

- `scripts/check-a29-supabase-runtime-shell.cjs`
  - wzmacnia guard dla `Layout.tsx` i `Today.tsx`
  - blokuje importy `../firebase` oraz użycia `auth.*` w shellu i Today

## Nie zmieniono

- wyglądu Today,
- routingu,
- układu kafelków,
- danych Supabase,
- logiki list i sekcji.

## Testy

- `npm run check:a29-supabase-runtime-shell`
- `npm run test:critical`
- `npm run build`

## Kryterium zakończenia

`Layout.tsx` i `Today.tsx` przechodzą bez Firebase Auth runtime, a build produkcyjny przechodzi.
