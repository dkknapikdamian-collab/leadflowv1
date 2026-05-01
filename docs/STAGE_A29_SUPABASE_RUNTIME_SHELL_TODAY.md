# Stage A29 — Supabase runtime shell / Today

## Cel

Usunąć zależność Firebase Auth z runtime shell aplikacji i z ekranu Dziś.

Ten etap nie usuwa całego pliku `src/firebase.ts`, bo w repo mogą jeszcze istnieć starsze, niekrytyczne ścieżki migracyjne. Oznacza go jako legacy compatibility i odcina z globalnego shellu oraz Today.

## Zakres

Zmienione pliki:

- `src/components/Layout.tsx`
- `src/pages/Today.tsx`
- `src/firebase.ts`
- `scripts/check-a29-supabase-runtime-shell.cjs`
- `package.json`

## Zasada

Docelowym runtime auth jest Supabase:

- `useSupabaseSession()`
- `useWorkspace().profile`
- `signOutFromSupabase()`

Firebase Auth nie może sterować:

- avatarem użytkownika w shellu,
- e-mailem użytkownika w shellu,
- wylogowaniem,
- ekranem Dziś.

## Czego nie zmieniać

- wyglądu menu,
- routingu,
- układu Today,
- modelu danych,
- billing/access,
- Firebase legacy poza zakresem tego hotfixa.

## Guard

Dodany skrypt:

```bash
npm run check:a29-supabase-runtime-shell
```

Sprawdza:

- brak `../firebase` w `Layout.tsx`,
- brak `../firebase` w `Today.tsx`,
- brak `auth.currentUser`,
- brak `auth.signOut()`,
- obecność `useSupabaseSession()`,
- obecność `signOutFromSupabase()`,
- odczyt profilu przez `useWorkspace()`,
- skrypt w `package.json`.

## Test po wdrożeniu

1. Zaloguj się przez Google Supabase.
2. Odśwież stronę.
3. Sprawdź sidebar: nazwa i e-mail użytkownika.
4. Wejdź na Dziś.
5. Wyloguj się z menu.
6. Sprawdź, czy wraca do `/login`.
7. Uruchom:

```bash
npm run check:a29-supabase-runtime-shell
npm run test:critical
npm run build
```

## Kryterium zakończenia

Globalny shell i ekran Dziś działają bez Firebase Auth runtime.
