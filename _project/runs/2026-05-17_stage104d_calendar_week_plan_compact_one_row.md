# Stage104D - Calendar week plan compact one-row

## Status
WDRAŻANE Z DIRECT HOTFIX PO BŁĘDZIE PATCHERA ZIP.

## Fakty
- Stage104C został ręcznie potwierdzony: karta działa, nie ma mikro-chipa.
- Stage104D ZIP patcher nie wystartował przez błąd składni JS w template literal.
- Ten direct hotfix omija JS patcher i zmienia CSS/testy bezpośrednio.

## Zakres
- src/styles/closeflow-calendar-selected-day-new-tile-v9.css
- 	ests/stage100-calendar-week-plan-entry-visible.test.cjs
- 	ests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- 	ests/stage104d-calendar-week-plan-compact-one-row.test.cjs
- scripts/closeflow-release-check-quiet.cjs

## Decyzja
Nie ruszać logiki Google Calendar/delete/done w tym etapie. Stage104D to tylko layout + guard freeze.

## Testy
Do wykonania w skrypcie:
- Stage98
- Stage99
- Stage100
- Stage104
- Stage104D
- build
- verify:closeflow:quiet

## Test ręczny
/calendar: wpis w Plan najbliższych dni ma być jednym kompaktowym wierszem na desktopie.