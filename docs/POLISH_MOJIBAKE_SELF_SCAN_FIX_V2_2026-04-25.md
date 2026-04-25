# Polish mojibake self scan fix v2

Data: 2026-04-25

## Problem

Pierwsza wersja testu zawierala slownik uszkodzonych znakow jako literalne teksty. Skaner poprawnie wykryl te znaczniki we wlasnym pliku testu i skanera.

## Poprawka

- slownik wzorcow jest budowany z kodow Unicode, a nie z literalnych uszkodzonych znakow
- skaner nadal wykrywa te same problemy w innych plikach
- skaner i test nie oznaczaja juz samych siebie jako blednych

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
