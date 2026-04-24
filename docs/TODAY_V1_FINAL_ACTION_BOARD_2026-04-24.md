# Today V1 final action board

Data: 2026-04-24

## Problem

Ekran DziĹ› ma byÄ‡ operacyjnym centrum dnia, a nie tylko listÄ… wpisĂłw. UĹĽytkownik musi szybko zobaczyÄ‡, dlaczego wpis jest waĹĽny, co jest zalegĹ‚e i co moĹĽna bezpiecznie odĹ‚oĹĽyÄ‡ bez wchodzenia w szczegĂłĹ‚y.

## Decyzja

Dodajemy warstwÄ™ V1 final dla ekranu DziĹ›:

- powody priorytetu przy wpisach,
- szybkie odĹ‚oĹĽenie wpisu,
- activity log dla odĹ‚oĹĽenia,
- czytelne etykiety w ekranie AktywnoĹ›Ä‡.

## Nowe szybkie akcje

- OdĹ‚ĂłĹĽ 2h
- Jutro 9:00
- Za 3 dni

## Nowe eventy activity

- today_task_snoozed
- today_event_snoozed

## Powody przy wpisie

System pokazuje krĂłtkie etykiety:

- ZalegĹ‚e,
- Na dziĹ›,
- Wysoki priorytet,
- Bez relacji,
- Bez przypomnienia,
- Wykonane.

## Zasada UX

UĹĽytkownik nie musi myĹ›leÄ‡, gdzie kliknÄ…Ä‡. Z poziomu DziĹ› moĹĽe:

- podejrzeÄ‡ wpis,
- oznaczyÄ‡ jako wykonany,
- przywrĂłciÄ‡,
- usunÄ…Ä‡,
- odĹ‚oĹĽyÄ‡,
- przejĹ›Ä‡ do leada albo sprawy.

## Zakres techniczny

Dodano helper `src/lib/today-v1-final.ts`, ktĂłry trzyma logikÄ™ V1 final dla ekranu DziĹ›. UI korzysta z niego zamiast dopychaÄ‡ kolejne ify bezpoĹ›rednio do widoku.
