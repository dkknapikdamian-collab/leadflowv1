# FAZA 3 - Etap 3.2G - AI draft cancellation hotfix

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** anulowanie/usuwanie szkiców AI, w tym szkicu notatki.

## Problem

Szkic notatki nie dawał się anulować.

Najbardziej prawdopodobna przyczyna: endpoint `ai-drafts` wymagał pełnego dostępu AI dla każdej mutacji, także dla czyszczenia/anulowania istniejącego szkicu.

To jest zły model. Blokada planu może zatrzymać tworzenie nowego szkicu AI, ale nie może więzić starego szkicu w aplikacji.

## Decyzja

Cleanup draftu ma być dozwolony po poprawnym:

```text
user
workspace
write access
scoped row
```

Pełny feature gate AI nadal jest wymagany dla:

```text
POST create draft
PATCH edit/convert/confirm draft
```

Nie jest wymagany dla:

```text
PATCH cancel/archive/expire
DELETE draft
```

## Kryterium zakończenia

```text
npm.cmd run check:faza3-etap32g-ai-draft-cancel-smoke
node --test tests/faza3-etap32g-ai-draft-cancel-smoke.test.cjs
npm.cmd run build
```

## Manualny test

1. Wejdź w szkice AI.
2. Utwórz lub znajdź szkic typu `note`.
3. Kliknij anulowanie / archiwizację.
4. Szkic znika z listy `Do sprawdzenia`.
5. W `Anulowane` status jest `Anulowany`.
6. Nie ma błędu 500 / `WORKSPACE_AI_ACCESS_REQUIRED`.

## Następny etap

```text
FAZA 4 - Etap 4.1 - Data contract map
```
