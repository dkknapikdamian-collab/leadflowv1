const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
test('Stage108 V2 selected-day rows keep title close to meta and remove orphan CSS warnings', () => {
  const css = fs.readFileSync('src/styles/closeflow-calendar-selected-day-new-tile-v9.css', 'utf8');
  assert.match(css, /STAGE108_V2_SELECTED_DAY_ROW_READABILITY_LOCAL_ONLY/);
  assert.match(css, /grid-template-columns:\s*max-content\s+minmax\(260px,\s*1fr\)\s+minmax\(90px,\s*0\.45fr\)/);
  assert.match(css, /letter-spacing:\s*0\s*!important/);
  assert.match(css, /\.cf-selected-day-v9-time::before/);
  assert.match(css, /\.cf-selected-day-v9-status::before/);
  assert.doesNotMatch(css, /#root \[data-cf-calendar-selected-day-entry-v9="true"\]::after,\s*@media/);
});
