const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const today = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-canvas-runtime-source-truth-stage211j.css'), 'utf8');

function changedFiles() {
  return execSync('git diff --name-only HEAD', { cwd: root, encoding: 'utf8' })
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\\/g, '/'))
    .filter(Boolean);
}

test('Today final UI has no technical Ruch helper copy', () => {
  assert.doesNotMatch(today, /Ruch:/);
  assert.match(today, /Zaplanowane zadanie/);
  assert.match(today, /Zaplanowane wydarzenie/);
  assert.match(today, /Zaplanowany kontakt/);
});

test('Today section cards use one source array and one grid map', () => {
  assert.match(today, /STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH/);
  assert.match(today, /const\s+todaySectionCards:\s*Array<\{\s*key:\s*TodaySectionKey;\s*node:\s*ReactNode\s*\}>/);
  assert.match(today, /visibleSectionCards\s*=\s*todaySectionCards\.filter/);
  assert.match(today, /visibleSectionCards\.map\(\(\{\s*key,\s*node\s*\}\)/);
  assert.match(today, /data-stage232t-r1c-today-section-grid="true"/);
});

test('Upcoming is a normal section card, not a full-width exception', () => {
  assert.match(today, /key:\s*'upcoming'/);
  assert.doesNotMatch(today, /<div\s+hidden=\{!sectionVisible\('upcoming'\)\}/);
  assert.doesNotMatch(today, /xl:grid-cols-2/);
});

test('Today grid contract is scoped and responsive 3/2/1', () => {
  assert.match(css, /STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH/);
  assert.match(css, /\[data-p0-today-stable-rebuild="true"\][\s\S]*\[data-stage232t-r1c-today-section-grid="true"\]/);
  assert.match(css, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)\s*!important/);
  assert.match(css, /max-width:\s*1279px[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)\s*!important/);
  assert.match(css, /max-width:\s*767px[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/);
});

test('Refresh and View contracts remain wired to the same source', () => {
  assert.match(today, /const TODAY_VIEW_STORAGE_KEY = 'closeflow:today:view-sections:v1'/);
  assert.match(today, /writeTodayVisibleSections/);
  assert.match(today, /manualRefreshing/);
  assert.match(today, /refreshData\(\{\s*manual:\s*true,\s*force:\s*true,\s*reason:\s*'manual'\s*\}\)/);
});

test('Stage did not change SQL, finance, commission, or Calendar runtime files', () => {
  const files = changedFiles();
  assert.equal(files.some((file) => /\.sql$/i.test(file) || file.includes('/migrations/')), false);
  assert.equal(files.some((file) => /(^|\/)(finance|commission)(\/|\.|$)/i.test(file)), false);
  assert.equal(files.some((file) => file === 'src/pages/Calendar.tsx' || file.includes('/calendar-runtime')), false);
});
