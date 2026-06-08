# STAGE228O1R3 â€” cases risk rail no-blink font fix

Data: 2026-06-07 22:25 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Problem

Po Stage228O1R2 karta /cases â†’ Blokery i ryzyko nadal odstawaĹ‚a: font byĹ‚ zbyt ciÄ™ĹĽki i karta wizualnie migaĹ‚a co okoĹ‚o sekundÄ™.

## Przyczyna

Poprzednie prĂłby Stage228I/J/K/L/M/N/O1/O1R2 nakĹ‚adaĹ‚y style runtime z obserwatorami/ponownÄ… aplikacjÄ… stylĂłw. NakĹ‚adanie stylĂłw na zbyt wysokie elementy DOM powodowaĹ‚o efekt ciÄ™ĹĽkiego fontu i migania.

## Zmiana

- dodano pojedynczy runtime: src/lib/cf-rail-tile-tone-source-truth-stage228o1r3.ts,
- usuniÄ™to z entry importy starych runtime soft-tone,
- runtime O1R3 nie uĹĽywa setInterval,
- MutationObserver nie obserwuje attributes/style,
- /cases risk rows majÄ… normalizowany font, tĹ‚o i border,
- top-value rows i simple filters pozostajÄ… w zakresie O1 bez zielonych/chipowych regresji.

## Guard

npm run check:stage228o1r3-cases-risk-no-blink-font-fix

## Manual check

- /cases: Operacyjne skrĂłty bez regresji,
- /cases: Blokery i ryzyko bez migania,
- /cases: font nie wyglÄ…da jak nadmiernie pogrubiony,
- /leads i /clients: top-value/filter rows bez zielonych chipĂłw.

## Ryzyka

Runtime O1R3 nadal jest obejĹ›ciem legacy DOM. Docelowo style trzeba przenieĹ›Ä‡ do komponentĂłw rail cards i usunÄ…Ä‡ runtime mappery.
