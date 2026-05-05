const { fail, read, has, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE82_TODAY_NEXT_7_DAYS';
const today = read(label, 'src/pages/TodayStable.tsx');
['STAGE82_TODAY_NEXT_7_DAYS','upcomingActionRows','Następne 7 dni','getStage82UpcomingKindLabel','data-stage82-today-next-7-days="true"','Brak zaplanowanych akcji na kolejne 7 dni'].forEach(m => has(label, today, m, 'TodayStable.tsx'));
['data.tasks','data.leads','data.events'].forEach(m => has(label, today, m, 'TodayStable.tsx'));
if (!pkg(label).scripts['check:stage82-today-next-7-days']) fail(label, 'package script missing');
console.log('PASS ' + label);
