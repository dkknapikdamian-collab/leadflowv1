const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
const today = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');

test('active Today route uses TodayStable, not legacy Today', () => {
  const usesTodayStable = /lazyPage\(\s*\(\)\s*=>\s*import\(['"]\.\/pages\/TodayStable['"]\)\s*,\s*['"]TodayStable['"]\s*\)/s.test(app) || /from ['"]\.\/pages\/TodayStable['"]/.test(app);
  const usesLegacyToday = /lazyPage\(\s*\(\)\s*=>\s*import\(['"]\.\/pages\/Today['"]\)/s.test(app) || /from ['"]\.\/pages\/Today['"]/.test(app);
  assert.equal(usesTodayStable, true);
  assert.equal(usesLegacyToday, false);
});

test('owner-control tile uses truthful Wymaga ruchu contract', () => {
  assert.match(today, /STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH/);
  assert.match(today, /leads:\s*'Wymaga ruchu'/);
  assert.doesNotMatch(today, /leads:\s*'Co masz zrobić dzisiaj'/);
  assert.match(today, /data-stage232b-owner-control-helper="true"/);
  assert.match(today, /const\s+actionRequiredRows\s*=\s*useMemo\(\(\) => ownerControlBaseline\.items/);
  assert.match(today, /count:\s*actionRequiredRows\.length/);
  assert.match(today, /<SectionHeader title=\{todaySectionLabels\.leads\} count=\{actionRequiredRows\.length\}/);
  assert.match(today, /actionRequiredRows\.length \? actionRequiredRows\.map/);
  assert.doesNotMatch(today, /count:\s*ownerControlBaseline\.items\.length/);
});

test('upcoming seven days has full count and preview disclosure', () => {
  assert.match(today, /const\s+upcomingRowsAll\s*=\s*useMemo<UpcomingRow\[\]>/);
  assert.match(today, /const\s+upcomingRowsPreview\s*=\s*useMemo<UpcomingRow\[\]>\(\(\) => upcomingRowsAll\.slice\(0, 10\), \[upcomingRowsAll\]\);/);
  assert.match(today, /count:\s*upcomingRowsAll\.length/);
  assert.match(today, /<SectionHeader title=\{todaySectionLabels\.upcoming\} count=\{upcomingRowsAll\.length\}/);
  assert.match(today, /data-stage232b-upcoming-preview-disclosure="true"/);
  assert.match(today, /pokazano \{upcomingRowsPreview\.length\} z \{upcomingRowsAll\.length\}/);
});

test('task tile label no longer lies about overdue tasks', () => {
  assert.match(today, /function getStage232BTaskTileLabel/);
  assert.match(today, /if \(todayCount > 0 && overdueCount > 0\) return 'Zadania dziś i zaległe';/);
  assert.match(today, /if \(overdueCount > 0\) return 'Zaległe zadania';/);
  assert.match(today, /if \(todayCount > 0\) return 'Zadania dziś';/);
  assert.match(today, /tasks:\s*taskTileLabel/);
});
