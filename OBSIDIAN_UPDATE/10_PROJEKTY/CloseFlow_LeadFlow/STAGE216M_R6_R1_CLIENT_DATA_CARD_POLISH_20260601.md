# CloseFlow / LeadFlow - Stage216M-R6-R1 - Dane klienta polish

## FAKTY

- Stage216M-R6 został wypchnięty na `dev-rollout-freeze`.
- Karta `Dane klienta` jest już w układzie wierszy jak `Dane leada`.
- Do poprawy zostały: opisowa wstawka pod tytułem i dopasowanie wysokości/szerokości przycisku `Edytuj dane`.

## DECYZJE DAMIANA

- Usunąć w obu kartach opis:
  - `Status, źródło, kontakt, wartość i ostatnia aktywność w jednym miejscu.`
  - `Status, źródło, kontakt, wartość i ostatni kontakt w jednym miejscu.`
- Przycisk `Edytuj dane` w karcie klienta ma mieć wysokość i zachowanie jak w karcie leada.
- Prawą szynę odkładamy na później.

## ZAKRES

- `LeadDetail.tsx`
- `ClientDetail.tsx`
- `stage216m-r6-r1-client-data-card-polish.css`
- guard R6-R1
- raport `_project`

## TESTY

- guard Stage216M-R6-R1,
- `git diff --check`,
- `npm run build`.

## NASTĘPNY KROK

Po deployu porównać tylko kartę `Dane klienta` vs `Dane leada`.
