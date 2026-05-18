# Stage115B - LeadDetail notes visible source contract

## Status
LOCAL ZIP/PUSH PACKAGE PREPARED.

## Scan-first confirmation
- Repo: CloseFlow / leadflowv1.
- Branch expected: dev-rollout-freeze.
- Read files: src/pages/LeadDetail.tsx, src/components/entity-contact-card.tsx, src/styles/visual-stage14-lead-detail-vnext.css, package.json.
- Active source of truth: LeadDetail route + shared EntityContactCard from Stage115 3.1.
- Legacy / competing paths: old lead-detail-note-box/contact-note placement and contact-card note prop.

## FAKTY Z KODU / PLIKÓW
- LeadDetail already has Stage115 contact parity marker and EntityContactCard.
- Before this stage, leadPrimaryNoteText was passed into EntityContactCard, so note content stayed attached to contact data.
- leadPrimaryNoteText reads lead.note, lead.notes, noteText, note_text and note activities.

## DECYZJE DAMIANA
- Notatka z tworzenia leada ma być osobną czytelną sekcją.
- Sekcja ma być po danych kontaktowych, przed finansami / dalszymi panelami leada.
- Kontakt nie ma wchłaniać notatki.

## ZMIANY
- LeadDetail splits source lead note and latest note activity into a dedicated Notatki leada section.
- EntityContactCard no longer receives note from LeadDetail.
- Added explicit empty state only when neither source lead note nor note activity exists.
- Added Stage115B guard.

## TESTY AUTOMATYCZNE
- node --test tests/stage115-lead-notes-visible-source-contract.test.cjs
- node --test tests/stage115-lead-contact-card-client-parity.test.cjs, if present
- npm run build

## TEST RĘCZNY DO WYKONANIA
1. Open /leads/:id for a lead with note added during creation.
2. Confirm contact card has only phone, email, company, last contact.
3. Confirm Notatki leada section appears next to/after contact and before finance/right-rail scan path.
4. Confirm source note and latest note_added history item show date and content.
5. Confirm empty state appears only when no source note and no note activity exist.

## WPŁYW NA OBSIDIANA
Prepared Obsidian note: 2026-05-18 - CloseFlow Stage115B LeadDetail notes visible source contract.md

## BRAKI I RYZYKA
- This stage does not fix LeadDetail finance buttons or overdue persistence. Those remain separate Stage115 subitems.
- Visual placement should be manually checked because desktop shell has left/main/right rails.

## NASTĘPNY KROK
Stage115 3.3: overdue task behavior or Stage115 finance repair, after manual confirmation of notes placement.
