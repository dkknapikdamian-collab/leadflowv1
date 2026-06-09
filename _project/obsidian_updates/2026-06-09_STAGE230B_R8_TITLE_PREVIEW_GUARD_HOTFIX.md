# CloseFlow / LeadFlow - STAGE230B R8 title preview guard hotfix

Data: 2026-06-09 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_TESTS

## FAKTY
- R7 wykryl brak kontraktu tytulu karty quick capture.
- R8 dodaje/egzekwuje getDraftTitle: Szybki szkic + preview raw tekstu.

## TESTY
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- npm run build
- git diff --check

## RYZYKA
- Nie mieszac z Stage240R2/R3/R4 ani globalnymi plikami.
- Manual QA po pushu: F5, zapis raw draftu, mobile dictation.
