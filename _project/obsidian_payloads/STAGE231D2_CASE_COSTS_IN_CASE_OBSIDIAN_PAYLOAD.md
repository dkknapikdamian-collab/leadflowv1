# CloseFlow / LeadFlow — STAGE231D2 CASE COSTS IN CASE

Data i godzina: 2026-06-10 18:55 Europe/Warsaw

## Zakres
Dodano koszty w sprawie: SQL table case_costs, API /api/case-costs, wrappery Supabase, panel kosztów w CaseDetail i guard.

## SQL
Uruchomić osobno w Supabase SQL Editor:

sql/2026-06-10_stage231d2_case_costs.sql

## Testy
- check/test D2
- regresja D1/D0/D0A
- Polish guard
- build
- git diff --check

## audyt ryzyk
Najważniejsze ryzyko: brak uruchomionego SQL w Supabase przed testem zapisu kosztu. Drugie ryzyko: API działa przez service_role, więc workspace scope musi pozostać wymagany w route.

## następny krok
Po wdrożeniu i SQL: sprawdzić dodanie kosztu w CaseDetail, odświeżenie panelu oraz zapis activity. Potem D3.
