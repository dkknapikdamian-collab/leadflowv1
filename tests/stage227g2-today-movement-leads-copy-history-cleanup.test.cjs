const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Stage227G2 makes movement/helper row visually card-like in WorkItemCard', () => {
  const css = fs.readFileSync('src/styles/work-item-card.css', 'utf8');
  assert.match(css, /STAGE227G2_TODAY_MOVEMENT_HELPER_VISUAL/);
  assert.match(css, /\.cf-work-item-card-helper\s*\{/);
  assert.match(css, /background:\s*#f9fafb/);
  assert.match(css, /border-radius:\s*12px/);
  assert.match(css, /padding:\s*6px 10px/);
});

test('Stage227G2 removes Leads runtime helper copy called out by owner', () => {
  const leads = fs.existsSync('src/pages/Leads.tsx') ? fs.readFileSync('src/pages/Leads.tsx', 'utf8') : '';
  assert.match(leads, /STAGE227G2_LEADS_RUNTIME_COPY_CLEANUP/);
  assert.doesNotMatch(leads, /Bez przesady, tylko najpotrzebniejsze\./);
  assert.doesNotMatch(leads, /5 leadów z największą wartością\./);
  assert.doesNotMatch(leads, /5 leadow z najwieksza wartoscia\./);
});

test('Stage227G2 suppresses legacy lead history top tile selectors only', () => {
  const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
  assert.match(css, /STAGE227G2_LEAD_HISTORY_TILE_SUPPRESSION/);
  assert.match(css, /\[data-stage227f3-top-card="history"\]/);
  assert.match(css, /\[data-stage227f5-top-card="history"\]/);
  assert.match(css, /display:\s*none !important/);
});
