const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = path.resolve(__dirname, '..');
const todayPath = path.join(repo, 'src/pages/TodayStable.tsx');
const src = fs.readFileSync(todayPath, 'utf8');

test('Today view panel keeps hidden sections available for re-enable', () => {
  assert.match(src, /STAGE16AR_TODAY_VIEW_ALL_OPTIONS_FIXED/);
  assert.match(src, /\{todayTiles\.map\(\(tile\) => \{/);
  assert.match(src, /const checked = visibleTodaySectionSet\.has\(tile\.key\);/);
  assert.match(src, /checked=\{checked\}/);
  assert.match(src, /writeTodayVisibleSections\(next\);/);
  assert.match(src, /Poka\u017C wszystko/);
  assert.doesNotMatch(src, /visibleTodaySections\.map\s*\(/);
  assert.doesNotMatch(src, /todayTiles\.filter\s*\([^\)]*visibleTodaySectionSet\.has[\s\S]{0,120}?\.map\s*\(/);
});

test('Today all-options guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-today-view-customizer-all-options.cjs'], {
    cwd: repo,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
