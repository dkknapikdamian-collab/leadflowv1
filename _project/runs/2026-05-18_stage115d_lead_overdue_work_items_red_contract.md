# Stage115D - LeadDetail overdue work items red contract

## Status
LOCAL ZIP/PUSH PACKAGE PREPARED.

## Scan-first confirmation
- Repo: CloseFlow / leadflowv1.
- Branch expected: dev-rollout-freeze.
- Read files before patch: src/pages/LeadDetail.tsx, src/styles/visual-stage14-lead-detail-vnext.css, package.json, Stage115A/B/C guard context.
- Active source of truth: LeadDetail buildTimeline + status helpers.

## FAKTY Z FEEDBACKU
- Zadanie z minioną datą pokazuje `Do zrobienia`, a powinno pokazywać `Zaległe` na czerwono.
- `leadWorkCenter.nextActionLabel` ma mojibake separator `â”¬Ě`.

## FAKTY Z KODU
- `taskStatusLabel()` przed etapem nie sprawdzał daty.
- `statusClass()` przed etapem nie znał daty i nie miał danger/red dla overdue.
- `buildTimeline()` budował label statusu wyłącznie ze statusu tekstowego.

## ZMIANY
- Added `isWorkItemOverdue(dateValue, status)`.
- `taskStatusLabel` and `eventStatusLabel` can return `Zaległe` when date is in the past and status is not done/cancelled/completed.
- `statusClass` can return `lead-detail-pill-danger` for overdue work items.
- `buildTimeline` stores `isOverdue`, passes date into label/class decisions and exposes row marker.
- Replaced mojibake separator with `•` and added status label to nearest action label.
- Added CSS for red overdue pill and row.

## TESTY AUTOMATYCZNE
- node --test tests/stage115-lead-contact-card-client-parity.test.cjs
- node --test tests/stage115-lead-notes-visible-source-contract.test.cjs
- node --test tests/stage115c-lead-inline-note-submit-contract.test.cjs
- node --test tests/stage115-lead-overdue-work-items-red-contract.test.cjs
- npm run build

## TEST RĘCZNY DO WYKONANIA
1. Open /leads/:id with a planned task dated in the past and status todo/open.
2. Confirm work list status pill says `Zaległe`.
3. Confirm pill/row is red/danger.
4. Confirm nearest planned action also contains `Zaległe`.
5. Confirm there is no `â”¬Ě` separator anywhere in LeadDetail.

## OBSIDIAN
Prepared note: 2026-05-18 - CloseFlow Stage115D LeadDetail overdue work items red contract.md

## BRAKI I RYZYKA
- This stage does not change persistence of task dates or +1D/+1W actions. It only fixes derived overdue display.
- Finance repair remains separate Stage115E.

## NEXT
Stage115E LeadDetail finance repair after manual overdue confirmation.
