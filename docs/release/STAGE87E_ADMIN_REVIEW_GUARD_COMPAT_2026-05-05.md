# Stage87E - Admin review guard compatibility

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Stage87D zostaĹ‚ wypchniÄ™ty, ale `verify:admin-tools` przerwaĹ‚ siÄ™ na starym guardzie `check:admin-review-mode`.

Stary guard szukaĹ‚ tekstĂłw starego modala:
- `Zaznacz wiÄ™kszy`
- `Zaznacz mniejszy`
- `Komentarz *`

Stage87D celowo zmieniĹ‚ UX na quick editor:
- `WiÄ™kszy cel`
- `Mniejszy cel`
- `Uwaga *`
- Enter zapisuje

## Zmiana

- `check-admin-review-mode.cjs` rozpoznaje Stage87D po markerze `ADMIN_CLICK_TO_ANNOTATE_STAGE87D`
- guard akceptuje nowy quick editor
- dodano test `test:admin-review-mode-compat`
- `verify:admin-tools` uruchamia teĹĽ test kompatybilnoĹ›ci
- poprawiono potencjalny mojibake w tekstach `AdminDebugToolbar.tsx`

## Kryterium zakoĹ„czenia

- `check:admin-review-mode` PASS
- `test:admin-review-mode-compat` PASS
- `verify:admin-tools` PASS
- build PASS
