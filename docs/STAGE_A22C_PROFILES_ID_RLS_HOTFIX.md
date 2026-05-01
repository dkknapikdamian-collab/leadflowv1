# A22c - profiles.id / RLS hotfix

## Cel

Naprawić migrację A22 dla starszych instalacji Supabase, w których tabela `public.profiles` istniała już wcześniej, ale nie miała kolumny `id`.

## Problem

Supabase SQL Editor zgłosił:

```text
ERROR: 42703: column p.id does not exist
```

Migracja A22 zakładała, że `create table if not exists public.profiles (...)` utworzy docelową strukturę. Jeżeli tabela istniała wcześniej, Postgres nie dodaje brakujących kolumn z definicji `create table if not exists`.

## Zmiana

- Dodano naprawę `profiles.id` przed tworzeniem funkcji RLS.
- Uzupełniono brakujące `id` wartości przez `gen_random_uuid()`.
- Dodano unikalny indeks `profiles_id_unique_idx`.
- Porównania w funkcjach/politykach RLS używają `::text`, żeby nie wywalić się na starszych kolumnach o typie tekstowym.

## Po wdrożeniu

Po patchu skrypt kopiuje poprawioną migrację do schowka. Wklej ją w Supabase SQL Editor i uruchom ponownie.
