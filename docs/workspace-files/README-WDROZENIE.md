# ClientPilot — etap auth bez zmiany UI

## Co wdrożone teraz

- zachowany został zaakceptowany wygląd stage2,
- menu, layout i klimat UI nie zostały przebudowane,
- login ma teraz dwa tryby:
  - demo lokalne, jeśli brak env Supabase,
  - magic link Supabase, jeśli env jest ustawione,
- callback logowania wraca od razu do `Dziś`,
- wylogowanie działa dla demo i Supabase,
- dodany został SQL pod `profiles`, `workspaces`, `workspace_members` i starter trigger.

## Jak uruchomić

1. Skopiuj folder `clientpilot-next`.
2. Jeśli chcesz test lokalny bez Supabase, zostaw `.env.local` puste.
3. Jeśli chcesz prawdziwy auth, skopiuj `.env.example` do `.env.local` i wpisz dane Supabase.
4. W Supabase uruchom plik:

```text
clientpilot-next/supabase/001_init.sql
```

5. Odpal projekt lokalnie.

## Co wizualnie się zmieniło

- nie zmieniłem layoutu,
- nie zmieniłem menu,
- nie zmieniłem kart i układu dashboardu,
- doszedł tylko mały box statusu logowania na ekranie wejścia.

## Następny etap

- przepięcie `Dziś`, `Leady` i `Kalendarz` z danych statycznych na dane z Supabase,
- bez rozwalania obecnego wyglądu.

