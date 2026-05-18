# Stage115C - LeadDetail inline note submit contract

## Status
LOCAL ZIP/PUSH PACKAGE APPLIED.

## Scan-first confirmation
- Repo: CloseFlow / leadflowv1.
- Branch expected: dev-rollout-freeze.
- Read files before patch: src/pages/LeadDetail.tsx, package.json, Stage115B guard context.
- Active source of truth: LeadDetail history note form uses handleAddNote; work-center note modal action stays global context action but must be explicitly named.

## FAKTY Z FEEDBACKU
- User writes text in LeadDetail contact history and expects inline save after clicking Dodaj notatkę.
- The global quick note modal must not be confused with inline note submit.

## FAKTY Z KODU
- History contact form uses onSubmit={handleAddNote}.
- Work-center button uses openLeadContextAction('note') and previously had a similar label.
- Inline copy had mojibake/plain-ASCII Polish issues.

## ZMIANY
- Added Stage115C source marker.
- History contact form now has explicit inline marker data-stage115c-inline-note-form.
- Submit button now has explicit data-stage115c-inline-note-submit and keeps type="submit".
- Work-center modal action label changed to Otwórz szybki formularz notatki.
- Fixed Polish copy: Dodaj krótką notatkę po kontakcie..., Dyktuj notatkę, Dodaj notatkę.

## TESTY AUTOMATYCZNE
- node --test tests/stage115-lead-contact-card-client-parity.test.cjs
- node --test tests/stage115-lead-notes-visible-source-contract.test.cjs
- node --test tests/stage115c-lead-inline-note-submit-contract.test.cjs
- npm run build

## TEST RĘCZNY DO WYKONANIA
1. Open /leads/:id.
2. In Historia kontaktu, type text into the inline textarea.
3. Click Dodaj notatkę.
4. Expected: no global modal opens; note saves inline and appears in history.
5. In Centrum pracy leada, click Otwórz szybki formularz notatki.
6. Expected: global quick note modal can open there, but it is visually/naming-wise distinct from inline submit.

## OBSIDIAN
Prepared note: 2026-05-18 - CloseFlow Stage115C LeadDetail inline note submit contract.md

## BRAKI I RYZYKA
- This stage does not change note persistence backend; it locks UI intent and submit path.
- If modal still opens from the inline submit after this patch, the bug is likely inside shared Button/event host, not LeadDetail copy.

## NEXT
Proceed to Stage115D overdue/task persistence after manual check.
