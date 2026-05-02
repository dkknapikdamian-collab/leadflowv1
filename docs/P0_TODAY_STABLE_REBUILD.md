# P0 — Today stable rebuild

## Problem

Stary `src/pages/Today.tsx` ma zbyt dużo warstw legacy: normalizacja, scheduler, filtry, skróty, stage cleanup i osobny loader szkiców. Diagnostyka z przeglądarki pokazała, że aplikacja sama dostaje dane z API:

- `/api/tasks` zwraca zadania,
- `/api/leads` zwraca leady,
- `/api/events` zwraca wydarzenia,
- `/api/cases` zwraca sprawy,
- `/api/system?kind=ai-drafts` zwraca szkice.

Mimo tego stare kafelki Today pokazywały `0 wpisów` poza szkicami.

## Decyzja

Zamiast dalej łatać stary ekran, root route `/` dostał nowy stabilny widok `TodayStable.tsx`.

## Zakres

Zmieniono tylko routing ekranu Dziś i dodano nowy stabilny ekran.

## Reguły widoku

- Zadania na dziś = niezrobione zadania z datą dzisiaj albo wcześniej.
- Leady do ruchu = aktywne leady bez następnego kroku albo z zaległym/dzisiejszym terminem.
- Wydarzenia = wydarzenia z datą dzisiejszą.
- Szkice = szkice AI ze statusem `draft`.

## Czego nie ruszono

- Nie zmieniono API.
- Nie zmieniono Supabase.
- Nie zmieniono auth.
- Nie usunięto starego `Today.tsx`, aby rollback był prosty.
