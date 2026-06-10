# STAGE231B0-R7 — Case archive / restore / navigation

Date: 2026-06-10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## FAKTY Z KODU

- Stage231B0 exists and introduced close-case flow.
- R7 adds archive/closed navigation, restore flow, and client closed-cases visibility.
- Client finance summary must keep lifetime mode as all_cases.

## DECYZJE DAMIANA

- Zamknij sprawę != Usuń sprawę.
- Zamknięta sprawa znika z aktywnej listy i trafia do Sprawy zamknięte.
- Zamkniętą sprawę można przywrócić z karty sprawy i z klienta.
- Finanse, historia, wpłaty i prowizje mają zostać.

## ZMIANY R7

- Shared closed-case status helper in src/lib/cases.ts.
- CaseDetail restore flow and positive close/restore styling.
- Cases view /cases?view=closed and closed-cases shortcut.
- ClientDetail active/closed case separation and restore action.
- Guard/test: STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION.

## TESTY

- node scripts/check-stage231b0-r7-case-archive-restore-navigation.cjs
- node --test tests/stage231b0-r7-case-archive-restore-navigation.test.cjs
- node scripts/check-stage231b0-case-close-archive-finance-truth.cjs
- node --test tests/stage231b0-case-close-archive-finance-truth.test.cjs
- node scripts/check-stage228r25-delete-flow-source-truth.cjs
- node scripts/check-stage228r41-delete-flow-final-validate.cjs
- npm run build
- git diff --check

## RYZYKA / POZA ZAKRESEM

- No SQL migration in R7.
- No monthly finance dashboard or costs.
- Existing build warning about duplicate savedRecord in ContextActionDialogs.tsx remains outside this stage.


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "Przywróć sprawę".
- Restore flow używa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostają zachowane; delete flow nie jest używany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodność nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `Przywróć sprawę` używa handlera reopen.
- Logika finansów, delete flow i dane rozliczeń pozostają bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodność CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodność segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formę `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `Przywróć sprawę` używa handlera reopen.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodność `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietę `Sprawy zamknięte` oraz filtr aktywne vs zamknięte.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamknięte`, `Przywróć sprawę`.
- Kontrakt używa wspólnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamknięte/przywróć oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- Podział używa wspólnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodność CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.
