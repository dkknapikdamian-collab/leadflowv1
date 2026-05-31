# STAGE213A - Supabase public Data API explicit grants

## FAKTY
- Supabase zmienia zachowanie dostępności tabel z public schema dla Data API.
- CloseFlow ma mieć jawne GRANT-y dla authenticated i service_role.
- Nie otwieramy prywatnych tabel szeroko dla anon.
- RLS nadal jest wymaganym mechanizmem ochrony rekordów.

## PLIKI
- supabase\migrations\20260531_stage213a_public_data_api_explicit_grants.sql
- scripts\check-stage213a-supabase-public-data-api-grants.cjs

## TESTY
- node scripts\check-stage213a-supabase-public-data-api-grants.cjs

## WDROŻENIE DO SUPABASE
- Skopiować zawartość migracji SQL do Supabase SQL Editor.
- Uruchomić na właściwym projekcie CloseFlow.
- Po wykonaniu odpalić sekcję audytu RLS z komentarza w migracji.

## CZEGO NIE RUSZANO
- Supabase automatem
- RLS policies
- dane produkcyjne
- deployment
- push do GitHub

## UWAGA O LIMITACH
- Ten etap dotyczy uprawnień Data API, nie redukcji liczby zapytań.
- Ograniczenie liczby zapytań Supabase robimy osobnym etapem: cache, batch fetch, mniej refetchy, brak pętli odświeżeń.

## AKTUALIZACJA - AUDYT RLS
- Audyt RLS wykonany w Supabase SQL Editor.
- Wynik z widocznej tabeli: wszystkie sprawdzone tabele public mają ls_enabled = true.
- Nie wykryto tabel public z wyłączonym RLS na screenie audytu.
- Następny krok: sprawdzić GRANT-y dla uthenticated i service_role.

## AKTUALIZACJA - SUPABASE WDROŻONE
- Migracja GRANT została uruchomiona w Supabase SQL Editor.
- Audyt RLS: wszystkie widoczne tabele w schema public mają ls_enabled = true.
- Audyt GRANT: wszystkie widoczne tabele mają 	rue dla:
  - authenticated_select
  - authenticated_insert
  - authenticated_update
  - authenticated_delete
  - service_role_select
  - service_role_insert
  - service_role_update
  - service_role_delete
- Wniosek: Stage213A jest wykonany po stronie Supabase.
- Nie zmieniano RLS policies ani danych.

## AKTUALIZACJA - SUPABASE WDROŻONE
- Migracja GRANT została uruchomiona w Supabase SQL Editor.
- Audyt RLS: wszystkie widoczne tabele w schema public mają ls_enabled = true.
- Audyt GRANT: wszystkie widoczne tabele mają 	rue dla:
  - authenticated_select
  - authenticated_insert
  - authenticated_update
  - authenticated_delete
  - service_role_select
  - service_role_insert
  - service_role_update
  - service_role_delete
- Wniosek: Stage213A jest wykonany po stronie Supabase.
- Nie zmieniano RLS policies ani danych.
