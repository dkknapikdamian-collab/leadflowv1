# STAGE A29B - Supabase runtime shell / Today

## Cel

Usunąć Firebase Auth z runtime shell aplikacji i z ekranu Dziś bez zmiany wyglądu, routingu ani przebudowy Today.

## Zakres

- `src/components/Layout.tsx`
  - usuwa `import { auth } from '../firebase';`
  - usuwa `auth.currentUser`
  - usuwa `auth.signOut()`
  - dodaje `useSupabaseSession()`
  - dodaje `signOutFromSupabase()`
  - bierze nazwę i e-mail z `useWorkspace().profile` oraz Supabase session

- `src/pages/Today.tsx`
  - usuwa import Firebase Auth

- `src/firebase.ts`
  - zostaje oznaczony jako legacy compatibility do późniejszego wygaszenia

## Nie zmieniono

- routingu,
- wyglądu menu,
- układu Today,
- logiki kafelków Today,
- billing/access,
- danych Supabase.

## Testy

- `npm run check:a29-supabase-runtime-shell`
- `npm run test:critical`
- `npm run build`

## Uwaga

Ten etap celowo nie odpala `check:polish-mojibake`, ponieważ repo ma znany fałszywy alarm w dokumencie audytu z przykładami złych znaków. To powinno zostać naprawione osobnym etapem.
