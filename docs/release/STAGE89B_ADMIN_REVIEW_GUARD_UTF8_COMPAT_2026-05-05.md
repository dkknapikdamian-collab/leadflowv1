# Stage89B - Admin Review guard UTF-8 compatibility

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Stage89 runtime i build przeszły, ale `verify:admin-tools` nadal zatrzymał się na `check:admin-review-mode`.

Błąd nie dotyczył runtime. To był przestarzały guard:

- oczekiwał starego score `score += 100` dla native actions,
- po Stage88 scoring ma semantyczny marker `native-action` i inną wagę,
- oczekiwał mojibake `WiÄ™kszy cel`, mimo że Stage87G naprawił toolbar na poprawne UTF-8 `Większy cel`.

## Zmiana

- guard akceptuje semantyczne markery `native-action`, `interactive-role`, `bad-tag`,
- guard akceptuje poprawne UTF-8 dla `Większy cel` / `Mniejszy cel`,
- test kompatybilności sprawdza brak mojibake w toolbarze.

## Kryterium zakończenia

- `check:admin-review-mode` PASS
- `test:admin-review-mode-compat` PASS
- `verify:admin-tools` PASS
- build PASS
