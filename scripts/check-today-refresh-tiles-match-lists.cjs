const fs = require('fs');
const assert = require('assert/strict');

const file = 'src/pages/TodayStable.tsx';
const src = fs.readFileSync(file, 'utf8');
const failures = [];
function check(condition, message) { if (!condition) failures.push(message); }

check(src.includes('STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE'), 'missing manual refresh marker');
check(src.includes('STAGE16AI_TODAY_TILES_MATCH_LISTS'), 'missing tile/list marker');
check(src.includes('const [manualRefreshing, setManualRefreshing]'), 'missing manualRefreshing state');
check(src.includes('refreshData({ manual: true })'), 'refresh button must call manual refresh path');
check(src.includes("manualRefreshing ? 'Odświeżanie...' : 'Odśwież dane'"), 'refresh button must show manual loading copy');
check(src.includes('const todaySectionLabels = {'), 'missing single source of truth labels');
check(src.includes('const todayTiles:'), 'missing todayTiles model');
check(src.includes('data-stage16ai-today-tiles-match-lists="true"'), 'missing tile section marker');

const expected = {
  no_action: 'noActionLeads.length',
  risk: 'highValueAtRiskRows.length',
  waiting: 'waitingLeadRows.length',
  leads: 'operatorLeads.length',
  tasks: 'operatorTasks.length',
  events: 'todayEvents.length',
  upcoming: 'upcomingRows.length',
  drafts: 'pendingDrafts.length',
};

for (const [key, countExpr] of Object.entries(expected)) {
  check(src.includes(`title: todaySectionLabels.${key}`), `tile ${key} must use shared label`);
  check(src.includes(`count: ${countExpr}`), `tile ${key} must use list count ${countExpr}`);
  check(src.includes(`title={todaySectionLabels.${key}}`), `SectionHeader ${key} must use shared label`);
}

assert.deepEqual(failures, []);
console.log('OK: Today refresh button and tile/list counter contract passed.');
