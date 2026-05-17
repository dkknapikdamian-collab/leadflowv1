# Stage104D - Stage94 guard compatibility hotfix

## Status
HOTFIX PO PUSHU 55b1a2.

## Fakt
Stage104D targeted guards i build przeszły, ale erify:closeflow:quiet padł na starym guardzie Stage94.

## Przyczyna
	ests/stage94-calendar-week-plan-full-entry-text.test.cjs nadal wymagał historycznego markera CLOSEFLOW_STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4, mimo że Stage100/104D celowo usuwają stare warstwy Stage94 V2/V3/V4.

## Zmiana
Stage94 guard został przeniesiony na aktualny marker STAGE104D_CALENDAR_WEEK_PLAN_COMPACT_ONE_ROW i aktualny selektor:
[data-cf-calendar-week-plan-entry-card="true"].

## Testy
- Stage94
- Stage98
- Stage100
- Stage104
- Stage104D
- build
- verify:closeflow:quiet

## Test ręczny
/calendar: wpis w Plan najbliższych dni ma zostać jednym kompaktowym wierszem.