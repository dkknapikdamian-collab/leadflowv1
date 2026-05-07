const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { spawnSync } = require('child_process');

test('Today refresh button has manual state and tiles match expandable list labels/counts', () => {
  const src = fs.readFileSync('src/pages/TodayStable.tsx', 'utf8');
  assert.match(src, /STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE/);
  assert.match(src, /STAGE16AI_TODAY_TILES_MATCH_LISTS/);
  assert.match(src, /refreshData\(\{ manual: true \}\)/);
  assert.match(src, /manualRefreshing \? 'Odświeżanie\.\.\.' : 'Odśwież dane'/);
  assert.match(src, /const todaySectionLabels = \{/);
  assert.match(src, /data-stage16ai-today-tiles-match-lists="true"/);

  const pairs = [
    ['no_action', 'noActionLeads.length'],
    ['risk', 'highValueAtRiskRows.length'],
    ['waiting', 'waitingLeadRows.length'],
    ['leads', 'operatorLeads.length'],
    ['tasks', 'operatorTasks.length'],
    ['events', 'todayEvents.length'],
    ['upcoming', 'upcomingRows.length'],
    ['drafts', 'pendingDrafts.length'],
  ];

  for (const [key, countExpr] of pairs) {
    assert.match(src, new RegExp(`title: todaySectionLabels\\.${key}`));
    assert.match(src, new RegExp(`count: ${countExpr.replace('.', '\\.')}`));
    assert.match(src, new RegExp(`title=\\{todaySectionLabels\\.${key}\\}`));
  }
});

test('Today refresh/tile guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-today-refresh-tiles-match-lists.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
