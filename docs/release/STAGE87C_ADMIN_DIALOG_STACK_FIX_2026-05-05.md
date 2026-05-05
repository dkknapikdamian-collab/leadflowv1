# Stage87C - Admin dialog stack fix

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Po Stage87B klikniÄ™cie `Bug` pokazywaĹ‚o tylko ciemny pasek przy gĂłrze. Dialog byĹ‚ czÄ™Ĺ›ciowo przykryty przez warstwy aplikacji/topbara, wiÄ™c nie daĹ‚o siÄ™ go normalnie kliknÄ…Ä‡ ani przeciÄ…gnÄ…Ä‡.

## Zmiana

- toolbar dostaĹ‚ wysoki stacking context i `isolation: isolate`
- backdrop dostaĹ‚ wysoki `z-index`
- dialog dostaĹ‚ wysoki `z-index`
- offset z gĂłry zmniejszony do `72px`, czyli tylko trochÄ™ niĹĽej niĹĽ wczeĹ›niej
- dodano `Reset pozycji` w dialogu Bug i Review/Copy
- dodano guard i test Stage87C

## Nie zmieniono

- localStorage schema
- export JSON/Markdown
- Review/Copy/Bug data contract
- backend / Supabase

## Kryterium zakoĹ„czenia

- `check:admin-dialog-stack-fix` PASS
- `test:admin-dialog-stack-fix` PASS
- `verify:admin-tools` PASS
- build PASS
- commit + push

## Test rÄ™czny

1. Kliknij `Bug`.
2. Okno ma byÄ‡ widoczne caĹ‚e, nie jako pasek.
3. ZĹ‚ap nagĹ‚Ăłwek i przesuĹ„.
4. Kliknij `Reset pozycji`.
5. SprawdĹş Review/Copy.
