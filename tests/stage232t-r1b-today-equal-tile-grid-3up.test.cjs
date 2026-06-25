const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-canvas-runtime-source-truth-stage211j.css'), 'utf8');
const today = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');

test('Today equal grid R1B is scoped to the Today route root', () => {
  assert.match(css, /STAGE232T_R1B_TODAY_EQUAL_TILE_GRID_3UP/);
  assert.match(css, /\[data-p0-today-stable-rebuild="true"\]/);
});

test('Today section cards use 3/2/1 responsive equal columns', () => {
  assert.match(css, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)\s*!important/);
  assert.match(css, /max-width:\s*1279px[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)\s*!important/);
  assert.match(css, /max-width:\s*767px[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/);
});

test('Upcoming 7 days is not allowed to stay full-width on desktop', () => {
  assert.match(today, /sectionVisible\('upcoming'\)/);
  assert.match(css, /max-width:\s*calc\(\(100% - \(2 \* var\(--stage232t-r1b-today-card-gap\)\)\) \/ 3\)\s*!important/);
  assert.match(css, /> div:not\(\[hidden\]\)/);
});

test('Today card sizing contract is common and does not touch data layers', () => {
  assert.match(css, /--stage232t-r1b-today-card-min-height/);
  assert.match(css, /height:\s*100%\s*!important/);
  assert.doesNotMatch(css, /commission|finance|ALTER TABLE|CREATE POLICY|DROP TABLE/i);
});
