const fs = require('fs');
const path = require('path');

const root = process.cwd();
let pass = 0;
let fail = 0;
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/^/, '');
}
function check(condition, message) {
  if (condition) {
    pass += 1;
    console.log('PASS ' + message);
  } else {
    fail += 1;
    console.error('FAIL ' + message);
  }
}
function includes(rel, needle, message) {
  check(read(rel).includes(needle), `${rel}: ${message || needle}`);
}
function notIncludes(rel, needle, message) {
  check(!read(rel).includes(needle), `${rel}: ${message || needle}`);
}

const today = read('src/pages/TodayStable.tsx');
const legacyToday = read('src/pages/Today.tsx');
const pkg = read('package.json');
const doc = read('docs/feedback/CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP_2026-05-09.md');

check(Boolean(today), 'TodayStable exists');
includes('src/pages/TodayStable.tsx', 'CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP', 'FB-4 marker present');
includes('src/pages/TodayStable.tsx', 'updateTaskInSupabase', 'uses existing update task helper');
includes('src/pages/TodayStable.tsx', "closeflow:today:mark-task-done", 'Zrobione task event wired');
includes('src/pages/TodayStable.tsx', 'Zrobione', 'task action copy present');
includes('src/pages/TodayStable.tsx', 'getFb4TodayTasksSectionTitle', 'dynamic task section title helper');
includes('src/pages/TodayStable.tsx', 'Zadania do wykonania dzi\u015B', 'today-only task title');
includes('src/pages/TodayStable.tsx', 'Zadania do obs\u0142ugi', 'today plus overdue task title');
includes('src/pages/TodayStable.tsx', 'Zaleg\u0142e zadania', 'overdue-only task title');
includes('src/pages/TodayStable.tsx', 'setCollapsedSections(TODAY_SECTION_KEYS.filter((key) => key !== section))', 'tile click collapses all other lists');
includes('src/pages/TodayStable.tsx', 'setActiveTodaySection(section)', 'tile click stores active section');
includes('src/pages/TodayStable.tsx', 'moveTodaySectionToTop(section)', 'opened list is moved under tiles first');
includes('src/pages/TodayStable.tsx', 'scrollToTodaySection(section)', 'section scroll stays explicit');
includes('src/pages/TodayStable.tsx', 'shouldFb4ScrollTodaySection', 'mobile-safe scroll gate present');
includes('src/pages/TodayStable.tsx', 'window.matchMedia', 'scroll gate checks viewport');
includes('src/pages/TodayStable.tsx', 'normalizeFb4TodayActionClusterOrder', 'Widok button action cluster order helper');
includes('src/pages/TodayStable.tsx', 'odswiez', 'refresh text normalized for action ordering');
includes('src/pages/TodayStable.tsx', 'widok', 'view text normalized for action ordering');
notIncludes('src/pages/Today.tsx', 'CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP', 'legacy Today.tsx untouched by FB-4 marker');
check(pkg.includes('check:closeflow-fb4-today-behavior-cleanup'), 'package.json has FB-4 check script');
check(Boolean(doc), 'FB-4 doc exists');
check(doc.includes('Today ma dzia\u0142a\u0107 jak centrum decyzyjne'), 'FB-4 doc states product goal');
check(doc.includes('Nie rusza\u0107 Today.tsx'), 'FB-4 doc preserves Today.tsx constraint');

console.log(`\nSummary: ${pass} pass, ${fail} fail.`);
if (fail > 0) {
  console.error(`FAIL CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP_FAILED`);
  process.exit(1);
}
console.log('CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP_OK');
