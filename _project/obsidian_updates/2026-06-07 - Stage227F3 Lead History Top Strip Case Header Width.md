# Stage227F3 — Lead History Top Strip + Case Header Width

Data: 2026-06-07 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Typ wpisu: UI/layout correction

## Decyzja

Historia aktywności leada nie może siedzieć pod notatkami. LeadDetail ma mieć górny pasek 3 skrótów: Działania, Braki, Historia. CaseDetail ma utrzymywać pełną szerokość headera i zakładek w tym samym shared canvasie.

## Zakres

- LeadDetail: top strip, historia w lewym railu, marker usunięcia historii ze środka.
- CaseDetail: pełna szerokość header/top/tabs/shell.
- Guard/test F3.

## Poza zakresem

- SQL
- Supabase
- C2 runtime persistence
- finanse
- kalendarz
