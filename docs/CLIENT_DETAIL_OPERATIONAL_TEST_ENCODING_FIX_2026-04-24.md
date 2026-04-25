# Client Detail operational test encoding fix

Data: 2026-04-24

## Problem

Test Client Detail V1 operational center sprawdzal tekst Następny ruch w zle zakodowanej formie mojibake.

## Decyzja

Test uzywa teraz zapisu unicode escape: Nast\u0119pny ruch.

## Efekt

- test nie zalezy od kodowania konsoli PowerShell,
- UI nadal sprawdza prawdziwy tekst Następny ruch,
- verify:closeflow:quiet moze przejsc bez falszywego bledu kodowania.
