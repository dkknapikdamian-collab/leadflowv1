# STAGE232I4_R16X_MISSING_BLOCKER_TOGGLE_STATE_AND_ACTION_LABEL

Date/time: 2026-06-20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel
Domknąć checkbox `Blokuje` w managerze braków klienta bez zmiany zaakceptowanego layoutu.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/components/detail/MissingItemsManagerDialog.tsx`
- guard/test R16X

## Zmiana
- Toggle checkboxa nie wysyła już `missing_item` / `blocking_missing_item` do `work_items.status`.
- Stan blokowania jest mapowany na legalnie zapisywane `priority`: `high` dla blokuje, `medium` dla nie blokuje.
- Lokalny stan UI nadal zachowuje semantykę `missing_item` / `blocking_missing_item`, ale tylko w stanie frontendu/payload, nie jako PATCH `status` do DB.
- Widok zostaje zwarty, ma napis `Blokuje`, przycisk `Usuń` i etykietę `Uzupełnij` zamiast `Gotowe`.

## Testy
- guard R16X
- node test R16X
- npm run build
- git diff --check
- smoke runtime: checkbox odznacz/zaznacz bez błędów i bez powrotu zaznaczenia

## Nie ruszać
SQL, Owner Control, finanse, Calendar, billing/trial, CaseDetail.
