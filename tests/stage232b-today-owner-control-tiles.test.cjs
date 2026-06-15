const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const app = fs.readFileSync(path.join(repo, 'src/App.tsx'), 'utf8');
const today = fs.readFileSync(path.join(repo, 'src/pages/TodayStable.tsx'), 'utf8');

test('active Today route uses TodayStable, not legacy Today', () => {
  assert.match(app, /import\(['"]\.\/pages\/TodayStable['"]\)/);
  assert.doesNotMatch(app, /const\s+Today\s*=\s*lazyPage\(\(\)\s*=>\s*import\(['"]\.\/pages\/Today['"]\)/);
});

test('owner-control tile keeps product copy only', () => {
  assert.match(today, /leads\s*:\s*['"]Wymaga ruchu['"]/);
  assert.match(today, /actionRequiredRows/);
  assert.doesNotMatch(today, /ownerControlBaseline\.items\.length/);
  assert.doesNotMatch(today, /To nie jest kalendarz/);
  assert.doesNotMatch(today, /data-stage232b-owner-control-helper/);
});

test('upcoming seven days has full count and preview disclosure', () => {
  assert.match(today, /upcomingRowsAll/);
  assert.match(today, /upcomingRowsPreview/);
  assert.match(today, /data-stage232b-upcoming-preview-disclosure/);
});

test('task tile label no longer lies about overdue tasks', () => {
  assert.match(today, /getStage232BTaskTileLabel/);
  assert.match(today, /Zadania dziś i zaległe/);
  assert.match(today, /Zaległe zadania/);
});
