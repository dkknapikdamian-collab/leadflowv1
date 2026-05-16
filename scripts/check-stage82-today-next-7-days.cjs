const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE82_TODAY_NEXT_7_DAYS", "src/pages/TodayStable.tsx", ["STAGE82_TODAY_NEXT_7_DAYS", "type UpcomingRow", "next7EndKey", "upcomingRows", "Nast\u0119pne 7 dni", "data-stage82-today-next-7-days=\"true\""]);
requireScript("STAGE82_TODAY_NEXT_7_DAYS", "check:stage82-today-next-7-days", "node scripts/check-stage82-today-next-7-days.cjs");
console.log('PASS STAGE82_TODAY_NEXT_7_DAYS');
