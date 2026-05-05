# STAGE58_CASE_RECENT_MOVES_PANEL

## Cel
Dodać w widoku sprawy mały panel `Ostatnie 5 ruchów`, żeby operator po wejściu w sprawę widział ostatni kontekst pracy bez przechodzenia od razu do pełnej historii.

## Zakres
- `src/pages/CaseDetail.tsx`
- `src/styles/visual-stage13-case-detail-vnext.css`
- `scripts/check-stage58-case-recent-moves-panel.cjs`
- `tests/stage58-case-recent-moves-panel.test.cjs`
- `package.json`

## Co zmieniono
- Dodano selektor `recentCaseMoves` oparty o pierwsze 5 posortowanych aktywności sprawy.
- Dodano panel `data-case-recent-moves-panel="true"` po hubie szybkich akcji sprawy.
- Panel pokazuje typ ruchu, datę, opis z istniejącego `getActivityText` oraz skróconą notatkę, jeśli istnieje.
- Dodano akcję `Zobacz całą aktywność`, która przełącza kartę na `history`.
- Dodano scoped CSS dla czytelności panelu i mobilnej responsywności.

## Czego nie zmieniono
- Nie dodano nowego modułu.
- Nie zmieniono API.
- Nie zmieniono modelu danych.
- Nie zmieniono flow lead -> sprawa.
- Nie dodano automatycznego tworzenia zadań ani wydarzeń.

## Weryfikacja
```powershell
npm.cmd run check:stage58-case-recent-moves-panel
npm.cmd run test:stage58-case-recent-moves-panel
npm.cmd run verify:case-operational-ui
npm.cmd run build
```

## Kryterium zakończenia
Widok sprawy pokazuje kompaktowy kontekst ostatnich 5 ruchów, bez przeciążania UI i bez ryzyka automatycznego zapisu danych.