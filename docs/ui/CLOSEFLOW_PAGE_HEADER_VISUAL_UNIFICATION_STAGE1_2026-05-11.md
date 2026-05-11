# CloseFlow — Page Header Visual Unification Stage 1

## Cel

Ujednolicić wygląd górnych kafelków/nagłówków zakładek bez runtime DOM patchera.

## Zakres

Ekrany:
- Dziś
- Leady
- Klienci
- Sprawy
- Zadania
- Kalendarz
- Szablony spraw
- Szablony odpowiedzi
- Aktywność
- Szkice AI
- Powiadomienia
- Rozliczenia
- Pomoc
- Ustawienia
- Admin AI

## Jedno źródło prawdy

`src/styles/closeflow-page-header-card-source-truth.css`

Ten plik definiuje:
- tło kafla,
- obramowanie,
- cień,
- radius,
- typografię,
- kicker/badge,
- przyciski neutralne,
- przyciski główne,
- przyciski AI.

## Ważna decyzja

Zielony nie jest głównym CTA.  
Główne CTA = blue/indigo.  
AI = violet/indigo.  
Neutralne = white/slate.  
Danger = red.  
Green zostaje tylko jako status sukcesu.

## Zmiana funkcjonalna

W `TasksStable.tsx` dochodzi przycisk `Nowe zadanie` w nagłówku. Używa istniejącej funkcji `openNewTask`, więc nie zmienia logiki formularza, API ani zapisu.

## Czego nie wolno robić

- Nie dodawać `MutationObserver`.
- Nie przepisywać DOM po renderze.
- Nie ruszać pozycji modali.
- Nie ruszać logiki zapisu.
- Nie zmieniać endpointów.
- Nie zmieniać list, metryk ani danych.

## Weryfikacja

1. `node scripts/check-closeflow-page-header-visual-unification-stage1.cjs`
2. `npm.cmd run build`
3. Ręcznie sprawdzić wymienione ekrany.
