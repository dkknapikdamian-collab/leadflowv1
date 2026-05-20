# 2026-05-20 - Supabase currency missing columns hotfix

## Status

WYKONANO.

## FAKTY

Po przepięciu CloseFlow na świeży projekt Supabase aplikacja logowała użytkownika poprawnie, ale endpointy listowe zwracały 500:

- /api/leads
- /api/cases
- /api/cases?includeArchived=1

Diagnostyka browser API pokazała:

- column leads.currency does not exist
- column cases.currency does not exist

## ZMIANA

Dodano migrację:

- supabase/migrations/20260520171000_leads_cases_currency_prereq.sql

Migracja dodaje:

- public.leads.currency text not null default 'PLN'
- public.cases.currency text not null default 'PLN'

## DECYZJE

- Nie naprawiamy ręcznie w Supabase SQL Editor.
- Repo zostaje źródłem prawdy dla schematu.
- SQL Editor służy tylko do weryfikacji.

## TESTY

Do wykonania po migracji:

- Supabase SQL Editor: potwierdzić kolumny currency w leads/cases.
- Aplikacja: odświeżyć /leads i /cases.
- Browser/API smoke:
  - /api/me = 200
  - /api/clients = 200
  - /api/leads = 200 []
  - /api/cases = 200 []
  - /api/cases?includeArchived=1 = 200 []

## RYZYKO

Po naprawie currency może pojawić się kolejny brak kolumny. Wtedy robimy kolejną migrację albo batch fresh-schema repair, ale nadal przez repo.
