# Today quick snooze click, edit and Polish text fix

Data: 2026-04-25

## Problem

Sekcja "Szybko odłóż" w ekranie Dziś była widoczna, ale przyciski mogły nie reagować, gdy karta nadrzędna przechwytywała kliknięcie albo ruch pointera.

Dodatkowo w tej sekcji brakowało przycisku "Edytuj" i część tekstów była bez polskich znaków.

## Poprawka

- przyciski szybkiego odkładania zatrzymują propagację kliknięcia, mouse down i pointer down
- kontener akcji ma pointer-events-auto i wyższy kontekst kliknięcia
- dodano przycisk Edytuj obok szybkiego odkładania
- przycisk Edytuj otwiera istniejący podgląd/edycję wpisu przez openPreviewEntry
- poprawiono polskie znaki w etykietach i tooltipach
- dodano test regresyjny

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi
- w ekranie Dziś przyciski Za 1h / Jutro / Za 2 dni / Przyszły tydzień są klikalne
- w tej samej sekcji jest przycisk Edytuj
- teksty nie mają krzaków ani brakujących polskich znaków
