# Stage104C BOM hotfix - calendar week plan guard

## Status
HOTFIX PO COMMIT 9fa4d75.

## Fakt
erify:closeflow:quiet padł na Stage98, bo 	ests/stage104-calendar-rendered-week-plan-smoke.test.cjs miał raw BOM na początku pliku.

## Zmiana
Usunięto BOM z pliku Stage104 smoke guard bez zmiany logiki UI.

## Testy do wykonania
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- npm run build
- npm run verify:closeflow:quiet

## Test ręczny
Po zielonym gate: /calendar, dzień z 1 wpis nie może być mikro-chipem.