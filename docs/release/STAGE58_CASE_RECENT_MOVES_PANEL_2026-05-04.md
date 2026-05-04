# STAGE58_CASE_RECENT_MOVES_PANEL

## Cel
DodaÄ‡ w widoku sprawy maĹ‚y panel `Ostatnie 5 ruchĂłw`, ĹĽeby operator po wejĹ›ciu w sprawÄ™ widziaĹ‚ ostatni kontekst pracy bez przechodzenia od razu do peĹ‚nej historii.

## Zakres
- `src/pages/CaseDetail.tsx`
- `src/styles/visual-stage13-case-detail-vnext.css`
- `scripts/check-stage58-case-recent-moves-panel.cjs`
- `tests/stage58-case-recent-moves-panel.test.cjs`
- `package.json`

## Co zmieniono
- Dodano selektor `recentCaseMoves` oparty o pierwsze 5 posortowanych aktywnoĹ›ci sprawy.
- Dodano panel `data-case-recent-moves-panel="true"` po hubie szybkich akcji sprawy.
- Panel pokazuje typ ruchu, datÄ™, opis z istniejÄ…cego `getActivityText` oraz skrĂłconÄ… notatkÄ™, jeĹ›li istnieje.
- Dodano akcjÄ™ `Zobacz caĹ‚Ä… aktywnoĹ›Ä‡`, ktĂłra przeĹ‚Ä…cza kartÄ™ na `history`.
- Dodano scoped CSS dla czytelnoĹ›ci panelu i mobilnej responsywnoĹ›ci.

## Czego nie zmieniono
- Nie dodano nowego moduĹ‚u.
- Nie zmieniono API.
- Nie zmieniono modelu danych.
- Nie zmieniono flow lead -> sprawa.
- Nie dodano automatycznego tworzenia zadaĹ„ ani wydarzeĹ„.

## Weryfikacja
```powershell
npm.cmd run check:stage58-case-recent-moves-panel
npm.cmd run test:stage58-case-recent-moves-panel
npm.cmd run verify:case-operational-ui
npm.cmd run build
```

## Kryterium zakoĹ„czenia
Widok sprawy pokazuje kompaktowy kontekst ostatnich 5 ruchĂłw, bez przeciÄ…ĹĽania UI i bez ryzyka automatycznego zapisu danych.