# Today quick snooze hard click fix

Data: 2026-04-26

## Problem

W sekcji Dziś -> Zadania przyciski szybkiego odkładania były widoczne, ale mogły nie reagować na kliknięcie.

Najbardziej prawdopodobna przyczyna: akcje były renderowane jako natywne przyciski wewnątrz klikalnej karty albo innego rodzica przechwytującego kliknięcia. Taki układ bywa niestabilny w przeglądarce.

## Zmiana

- akcje Za 1h / Jutro / Za 2 dni / Przyszły tydzień nie są już natywnymi buttonami w tym komponencie
- zastąpiono je elementami role="button", które nie łamią układu klikalnej karty
- dodano twarde stopPropagation i preventDefault na pointer/mouse/click
- utrzymano obsługę klawiatury Enter/Spacja
- zostawiono przycisk Edytuj
- dodano test regresyjny

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
- w Dziś -> Zadania da się kliknąć Za 1h / Jutro / Za 2 dni / Przyszły tydzień
