# CLOSEFLOW CASE SETTLEMENT EDIT VALUES 2026-05-12

## Cel

Naprawa używalności rozliczenia sprawy po usunięciu duchów renderowania.

Problem: panel finansów miał logikę wartości i prowizji, ale akcja była opisana głównie jako edycja prowizji. Użytkownik nie miał jasnego wejścia do ustawienia wartości transakcji, od której liczą się wpłaty, pozostało do zapłaty i prowizja procentowa.

## Zakres

- `src/components/finance/CaseSettlementPanel.tsx`
- `src/styles/finance/closeflow-finance.css`
- `src/pages/CaseDetail.tsx`
- `scripts/check-case-settlement-edit-values-2026-05-12.cjs`
- `scripts/diagnose-case-settlement-edit-values-2026-05-12.cjs`

## Decyzja produktowa

Pełna edycja wartości transakcji i prowizji zostaje w sprawie, bo sprawa jest miejscem pracy operacyjnej. Klient może pokazywać podsumowanie, ale bez pełnego edytora.

## Co zmieniono

- dodano wyraźne CTA `Ustaw wartość i prowizję`, gdy wartość transakcji wynosi 0,
- zmieniono nazwę akcji z samego `Edytuj prowizję` na `Edytuj wartość/prowizję`, gdy wartość już istnieje,
- dialog pokazuje wprost `Wartość transakcji / sprawy`,
- zapis prowizji zapisuje też `contractValue` i `expectedRevenue`,
- dodano check i diagnostykę dla pełnego edytora finansów.

## Meta automatycznej naprawy

- recordVar: caseData
- recordSetter: setCaseData
- paymentsVar: casePayments
- paymentsSetter: setCasePayments
- writeGuardDetected: tak

## Test ręczny

1. Wejdź w sprawę.
2. W sekcji `Rozliczenie sprawy` kliknij `Ustaw wartość i prowizję`.
3. Wpisz wartość transakcji, np. 100000.
4. Ustaw prowizję procentową, np. 3%.
5. Zapisz.
6. Sprawdź, czy `Wartość transakcji`, `Prowizja`, `Prowizja należna` i `Pozostało` przeliczyły się poprawnie.
7. Odśwież stronę i sprawdź, czy wartości wracają.
8. Dodaj wpłatę klienta i sprawdź, czy `Wpłacono od klienta` oraz `Pozostało` zmieniają się poprawnie.

## Kryterium zakończenia

Użytkownik może z poziomu sprawy jawnie ustawić i edytować wartość sprawy oraz prowizję. Klient i lead nie zawierają pełnego edytora rozliczeń.
