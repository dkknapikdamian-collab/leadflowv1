# CLOSEFLOW_CASE_HISTORY_VISUAL_SOURCE_TRUTH_2026-05-12

## Cel

Ujednolicić wizualnie historię sprawy w `/cases/:id`.

## Problem wejściowy

Górna karta `Historia sprawy` ma dobry, czytelny rytm: kompaktowy wiersz, typ po lewej, opis w środku, data po prawej.

Niżej historia była renderowana jak duże karty operacyjne: ikona, piguła `Notatka`, tytuł, opis, termin, piguła `Historia`, a czasem jeszcze przyciski akcji. To mieszało dwa źródła prawdy wizualnej.

## Decyzja

Nie zmieniamy danych ani logiki historii. Dokładamy osobny CSS source truth dla historii w CaseDetail:

- historia ma wyglądać jak kompaktowy ledger,
- ikony i akcje robocze są ukryte w kontekście historii,
- etykieta typu, treść i data są ustawione w jednym rytmie,
- mobile zostaje responsywne, ale bez osobnej przebudowy telefonu.

## Zakres

- `src/pages/CaseDetail.tsx`
- `src/styles/closeflow-case-history-visual-source-truth.css`
- `scripts/check-closeflow-case-history-visual-source-truth.cjs`
- `package.json`

## Kryterium zakończenia

- `npm run check:closeflow-case-history-visual-source-truth` przechodzi.
- `npm run build` przechodzi.
- Dolna historia sprawy wizualnie pasuje do górnej kompaktowej karty `Historia sprawy`.
