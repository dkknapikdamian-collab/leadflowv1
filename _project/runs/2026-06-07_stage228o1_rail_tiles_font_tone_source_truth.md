# Stage228O1 â€” rail tiles font/tone source truth

Data: 2026-06-07 22:10 Europe/Warsaw  
Repo: CloseFlow / LeadFlow  
Zakres: Leady, Klienci, Sprawy â€” right rail kafelki i wiersze.

## Problem

Po Stage228I/J/K/L/M/N kolory i fonty kafelkĂłw nadal byĹ‚y niespĂłjne:
- top value rows dziedziczyĹ‚y zielony ton,
- nazwa i kwota potrafiĹ‚y wyglÄ…daÄ‡ jak dwa chipy,
- filtr/simple rows miaĹ‚y inne kolory fontu niĹĽ wzĂłr zadaĹ„,
- cases risk card byĹ‚ uciÄ™ty i wyglÄ…daĹ‚ jak dwa kafelki na sobie.

## Zakres O1

WdroĹĽono runtime source truth:
- src/lib/cf-rail-tile-tone-source-truth-stage228o1.ts
- scripts/check-stage228o1-rail-tile-tone-source-truth.cjs

Mapowane kafelki:
- leads-simple-filters-card
- clients-simple-filters-card
- leads-top-value-records-card
- clients-top-value-records-card
- cases-operational-shortcuts-card
- cases-risk-rail-card

## ĹąrĂłdĹ‚o wzoru

Wzorem pozostajÄ… kafelki /tasks:
- Filtry zadaĹ„
- Najpilniejsze zadania

## Guard

npm run check:stage228o1-rail-tile-tone-source-truth

## Ryzyka

Runtime mapper jest bezpieczniejszy niĹĽ szeroki CSS fallback, ale nadal jest warstwÄ… legacy DOM.
Docelowo tokeny powinny wejĹ›Ä‡ do komponentĂłw wspĂłlnych rail cards.
