# STAGE228O1R2 â€” Cases risk rail alignment

Data: 2026-06-07 22:10 Europe/Warsaw
Repo: CloseFlow / LeadFlow
Branch: dev-rollout-freeze
Zakres: /cases -> Blokery i ryzyko

## Problem
Po STAGE228O1 karta `Blokery i ryzyko` wizualnie odstaje od `Operacyjne skrĂłty`. Wiersze ryzyka majÄ… efekt zagnieĹĽdĹĽonego kafelka, sÄ… miejscami uciÄ™te i nie trzymajÄ… ĹşrĂłdĹ‚a prawdy z `Filtry zadaĹ„`.

## Zmiana
Dodano runtime `cf-cases-risk-rail-alignment-stage228o1r2`, ktĂłry mapuje tylko kartÄ™ `cases-risk-rail-card` i jej wiersze. Karta ma `height:auto`, `overflow:visible`, a wiersze majÄ… jeden background/border i reset wewnÄ™trznych chipĂłw.

## Guard
`npm run check:stage228o1r2-cases-risk-rail-alignment`

## Ryzyka
Runtime jest nadal etapem przejĹ›ciowym. Docelowo styl trzeba przenieĹ›Ä‡ do wspĂłlnych komponentĂłw rail cards, ale O1R2 jest bezpieczniejszy niĹĽ kolejny szeroki global CSS.
