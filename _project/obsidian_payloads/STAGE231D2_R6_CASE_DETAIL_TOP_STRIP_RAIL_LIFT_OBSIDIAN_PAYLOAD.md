# CloseFlow / LeadFlow — STAGE231D2-R6 CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: UI layout hotfix po D2-R5
- status: przygotowane w ZIP

## Decyzja

Górny pasek karty sprawy z nazwą klienta/sprawy nie powinien zajmować pełnej szerokości. Ma zostać skrócony do lewej kolumny, a boczne kafelki/rail mają być podciągnięte do zwolnionego miejsca po prawej stronie u góry.

## Zakres

- CaseDetail: marker i atrybuty źródła layoutu.
- CSS: top strip left card + side rail top lift.
- Guard/test: STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT.

## Testy

Guardy i build zgodnie z run reportem. Brak SQL. Brak nowego API.

## Audyt ryzyk po etapie

- Na produkcji sprawdzić szerokość headera oraz czy prawy rail nie nachodzi na kartę główną.
- Wąskie ekrany mają reset do pełnej szerokości.
- Limit Vercel 12/12 nie może zostać naruszony.

## Następny krok

Push po PASS i produkcyjny test wizualny.
