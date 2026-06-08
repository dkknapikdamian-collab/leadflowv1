# STAGE228O1R7 â€” Cases risk static CSS no runtime

Status: LOCAL_ONLY_PREPARED
Data: 2026-06-07 22:25 Europe/Warsaw

## Problem
Karta /cases â†’ Blokery i ryzyko migaĹ‚a i po sekundzie dostawaĹ‚a pogrubienie oraz niebieski kafelek pod tytuĹ‚em.

## Przyczyna
Konflikt poprzednich runtime mapperĂłw Stage228I/J/K/L/M/N/O1/O1R2/O1R3/O1R4/O1R5/O1R6 oraz stylowanie zĹ‚ego poziomu DOM. Runtime poprawiaĹ‚ element po renderze, potem inny mapper lub observer ponownie zmieniaĹ‚ atrybuty/style.

## Zmiana
- UsuniÄ™to importy starych runtime mapperĂłw z entry pointa.
- Dodano statyczny CSS tylko dla .cases-risk-rail-card.
- TytuĹ‚ karty ma zwykĹ‚y styl jak Operacyjne skrĂłty.
- Wiersze ryzyka sÄ… jednowarstwowe.

## Guard
npm run check:stage228o1r7-cases-risk-static-css-no-runtime

## Manual test
http://localhost:3000/cases
