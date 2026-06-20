# STAGE232I4_R16Y_R2_MISSING_BLOCKER_SOURCE_TRUTH_ROBUST_FINAL

Date: 2026-06-20 15:35 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel

Naprawić źródło prawdy blokady braku klienta po R16X: checkbox zapisuje legalną domenę `priority: high/medium`, więc główny kafelek klienta musi czytać `priority === high` jako blokadę. Jednocześnie przycisk `Usuń` w managerze ma być widoczny.

## Zakres

- `src/pages/ClientDetail.tsx`
- `src/components/detail/MissingItemsManagerDialog.tsx`
- guard/test R16Y_R2

## Nie ruszać

SQL, Owner Control, finanse, Calendar, Billing, CaseDetail.

## Testy

- `node scripts/check-stage232i4-r16y-r2-missing-blocker-source-truth-robust-final.cjs`
- `node --test tests/stage232i4-r16y-r2-missing-blocker-source-truth-robust-final.test.cjs`
- `npm run build`
- `git diff --check`

## Smoke

- Usuń widoczny.
- Odznaczenie Blokuje zmienia checkbox i kafelek klienta na brak blokady.
- Zaznaczenie Blokuje zmienia checkbox i kafelek klienta na blokadę.
- F5 nie cofa stanu.
- Uzupełnij działa.
- Usuń działa.
