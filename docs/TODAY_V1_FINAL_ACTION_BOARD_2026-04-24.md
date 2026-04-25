# Today V1 final action board

Data: 2026-04-24

## Problem

Ekran Dziś ma być operacyjnym centrum dnia, a nie tylko listą wpisów. Użytkownik musi szybko zobaczyć, dlaczego wpis jest ważny, co jest zaległe i co można bezpiecznie odłożyć bez wchodzenia w szczegóły.

## Decyzja

Dodajemy warstwę V1 final dla ekranu Dziś:

- powody priorytetu przy wpisach,
- szybkie odłożenie wpisu,
- activity log dla odłożenia,
- czytelne etykiety w ekranie Aktywność.

## Nowe szybkie akcje

- Odłóż 2h
- Jutro 9:00
- Za 3 dni

## Nowe eventy activity

- today_task_snoozed
- today_event_snoozed

## Powody przy wpisie

System pokazuje krótkie etykiety:

- Zaległe,
- Na dziś,
- Wysoki priorytet,
- Bez relacji,
- Bez przypomnienia,
- Wykonane.

## Zasada UX

Użytkownik nie musi myśleć, gdzie kliknąć. Z poziomu Dziś może:

- podejrzeć wpis,
- oznaczyć jako wykonany,
- przywrócić,
- usunąć,
- odłożyć,
- przejść do leada albo sprawy.

## Zakres techniczny

Dodano helper `src/lib/today-v1-final.ts`, który trzyma logikę V1 final dla ekranu Dziś. UI korzysta z niego zamiast dopychać kolejne ify bezpośrednio do widoku.
