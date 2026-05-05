# Stage87F - Admin quick editor portal + drag

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Po Stage87D quick editor nadal potrafiĹ‚ pojawiÄ‡ siÄ™ przy samej gĂłrze / w obszarze topbara. UĹĽytkownik nie mĂłgĹ‚ wygodnie wpisaÄ‡ notatki.

## Przyczyna

Quick editor byĹ‚ renderowany jako dziecko `AdminDebugToolbar`, ktĂłry siedzi w gĂłrnym pasku aplikacji. Przy takim ukĹ‚adzie `position: fixed` moĹĽe wejĹ›Ä‡ w konflikt z warstwami layoutu.

## Zmiana

- quick editor jest renderowany przez `createPortal(..., document.body)`
- domyĹ›lnie startuje niĹĽej: `top: 136px`
- nie jest juĹĽ przypiÄ™ty do `bottom: 24px`
- moĹĽna go przesuwaÄ‡ myszkÄ… za nagĹ‚Ăłwek
- dodano `Reset pozycji`
- zachowano click-to-annotate z Stage87D
- poprawiono polskie teksty w `AdminDebugToolbar.tsx`

## Kryterium zakoĹ„czenia

- `check:admin-quick-editor-portal-drag` PASS
- `test:admin-quick-editor-portal-drag` PASS
- `verify:admin-tools` PASS
- build PASS
- commit + push

## Test rÄ™czny

1. Kliknij `Bug`.
2. Kliknij element na stronie.
3. Edytor ma pojawiÄ‡ siÄ™ poniĹĽej topbara, nie przy samej gĂłrze.
4. ZĹ‚ap nagĹ‚Ăłwek `Bug Note Recorder Â· przeciÄ…gnij`.
5. PrzesuĹ„ okno.
6. Wpisz notatkÄ™.
7. Enter zapisuje.
8. PowtĂłrz dla `Copy` i `Review â†’ Zbieraj`.