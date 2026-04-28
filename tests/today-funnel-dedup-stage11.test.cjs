const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const todayPath = path.join(root, 'src', 'pages', 'Today.tsx');

test('Stage11 Today funnel uses lead/client dedup value model', () => {
  const source = fs.readFileSync(todayPath, 'utf8');

  assert.match(source, /TODAY_FUNNEL_DEDUP_VALUE_STAGE11/);
  assert.match(source, /function buildTodayDedupedFunnelSummary/);
  assert.match(source, /todayPipelineClientAmount/);
  assert.match(source, /todayPipelineBuildPersonKey/);
  assert.match(source, /Math\.max\(existing\.amount, amount\)/);
  assert.match(source, /<TodayFunnelDedupValueCard leads=\{leads\} clients=\{clients\} \/>/);
});

test('Stage11 removes the dead Najcenniejsze block label from Today', () => {
  const source = fs.readFileSync(todayPath, 'utf8');

  assert.doesNotMatch(source, /Najcenniejsze/i);
});
