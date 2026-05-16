const assert = require('assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const repo = path.resolve(__dirname, '..');

test('Today view customizer has one storage key and controls tiles plus lists', () => {
  const today = fs.readFileSync(path.join(repo, 'src/pages/TodayStable.tsx'), 'utf8');
  assert.strictEqual((today.match(/const TODAY_VIEW_STORAGE_KEY\s*=/g) || []).length, 1);
  assert.match(today, /STAGE16AN_TODAY_VIEW_CUSTOMIZER/);
  assert.match(today, /Widok/);
  assert.match(today, /Poka\u017C wszystko|Pokaz wszystko/);
  assert.match(today, /localStorage\.getItem\(TODAY_VIEW_STORAGE_KEY\)/);
  assert.match(today, /localStorage\.setItem\(TODAY_VIEW_STORAGE_KEY/);
  assert.match(today, /type=["']checkbox["']/);
  assert.match(today, /sectionVisible\(['"]no_action['"]\)/);
});

test('Today view customizer guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-today-view-customizer.cjs'], {
    cwd: repo,
    encoding: 'utf8',
  });
  assert.strictEqual(result.status, 0, result.stdout + result.stderr);
});
