# Stage87B - Admin dialog lower position and draggable windows

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Bug/Review/Copy okno Admin Debug Toolbar mogĹ‚o byÄ‡ czÄ™Ĺ›ciowo niewidoczne przy gĂłrnej krawÄ™dzi ekranu.

## Zmiana

- dialogi admina otwierajÄ… siÄ™ niĹĽej: `padding-top: 96px`
- dialog ma limit wysokoĹ›ci: `max-height: calc(100vh - 128px)`
- backdrop ma `overflow: auto`
- Bug dialog i Review/Copy dialog moĹĽna przeciÄ…gaÄ‡ myszkÄ… za nagĹ‚Ăłwek
- drag nie startuje z przyciskĂłw, inputĂłw, textarea, selectĂłw ani linkĂłw
- dodano guard i test Stage87B

## Nie zmieniono

- localStorage schema
- eksport JSON/Markdown
- Review data contract
- Button Matrix
- Bug item format
- backend / Supabase

## Kryterium zakoĹ„czenia

- `check:admin-dialog-drag-lower` PASS
- `test:admin-dialog-drag-lower` PASS
- `verify:admin-tools` PASS
- build PASS
- commit + push

## Test rÄ™czny

1. OtwĂłrz Bug.
2. SprawdĹş, czy okno nie jest uciÄ™te przy gĂłrze.
3. ZĹ‚ap nagĹ‚Ăłwek `Bug Note Recorder Â· przeciÄ…gnij`.
4. PrzesuĹ„ okno.
5. Wpisywanie w pola nadal dziaĹ‚a normalnie.
