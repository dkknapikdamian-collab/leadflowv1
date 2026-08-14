const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
test('Stage108 V2 selected-day rows keep title close to meta and remove orphan CSS warnings', () => {
  const css = fs.readFileSync('src/styles/owners/closeflow-calendar.css', 'utf8');
  assert.match(css, /LF-UI-SOT-007_OWNER .*"ownerId":"semantic:calendar"/);
  assert.match(css, /grid-template-columns:\s*max-content\s+minmax\(260px,\s*1fr\)\s+minmax\(90px,\s*0\.45fr\)/);
  assert.match(css, /letter-spacing:\s*0\s*!important/);
  assert.match(css, /\.cf-selected-day-v9-time::before/);
  assert.match(css, /\.cf-selected-day-v9-status::before/);
  assert.doesNotMatch(css, /#root \[data-cf-calendar-selected-day-entry-v9="true"\]::after,\s*@media/);
});
