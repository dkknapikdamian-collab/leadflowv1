# STAGE220A26 - Case finance display and modal VST - 2026-06-03

## Cel

Naprawić po A25:
- brak wyświetlania finansów w widoku sprawy,
- ryzyko runtime przez użycie niezaimportowanego getCaseFinanceSummary,
- stary ciemny modal Dodaj wpłatę / Wartość sprawy i prowizja.

## Diagnoza

CaseDetail importuje helper jako:
getCaseFinanceSummary as getCaseFinanceSourceSummary.

Dlatego widok finansów ma czytać:
getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)

## Zmienione pliki

- src/pages/CaseDetail.tsx
- src/styles/visual-stage13-case-detail-vnext.css
- scripts/check-stage220a25-case-finance-sync.cjs
- scripts/check-stage220a26-case-finance-display-modal.cjs
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- package.json

## Nie ruszano

- SQL
- RLS
- API
- routing
- schema danych

## Test ręczny po deployu

1. Otwórz sprawę z wartością.
2. Sprawdź górne kafle finansowe sprawy.
3. Sprawdź prawy panel Finanse sprawy.
4. Kliknij Dodaj wpłatę.
5. Modal ma być jasny i spójny z VST.
6. Dodaj częściową wpłatę.
7. Sprawdź: wartość, wpłaty, do domknięcia w sprawie.
8. Wróć do klienta i sprawdź sumę klienta.

## R4 - A13 guard compatibility

A26 R3 patched CaseDetail correctly, but prebuild failed on the older A13 guard.
A13 expected direct strings:
- caseFinanceSummary.contractValue
- caseFinanceSummary.clientPaidAmount
- caseFinanceSummary.remainingAmount

A26 intentionally moves the display source to:
- caseFinanceSourceStage220A26
- getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)

R4 updates the A13 guard to accept both the legacy source and the A26 guarded source.

## R5 - A14 guard compatibility

R4 fixed A13, but prebuild then stopped on A14.
A14 still required legacy strings:
- caseFinanceSummary.contractValue
- caseFinanceSummary.clientPaidAmount
- caseFinanceSummary.remainingAmount
- dependency on [caseFinanceSummary]

A26 intentionally moves the display source to:
- caseFinanceSourceStage220A26
- getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)
- dependency on [caseFinanceSourceStage220A26]

R5 updates A14 to accept both the old guarded source and the A26 guarded source.
