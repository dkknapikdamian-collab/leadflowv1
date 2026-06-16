const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');

test('STAGE232A R10-R1 marks blockers empty state and rows for amber tone', () => {
  assert.match(lead, /STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE/);
  assert.match(lead, /data-stage232a-r10-r1-empty-tone=\{group\.key === 'blockers' \? 'missing' : String\(group\.key\)\}/);
  assert.match(lead, /data-stage232a-r10-r1-missing-tone-row=\{group\.key === 'blockers' \? 'true' : 'false'\}/);
});

test('STAGE232A R10-R1 styles inner blockers cards as missing amber, not neutral white', () => {
  assert.match(css, /STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE/);
  assert.match(css, /\.lead-detail-action-accordion-group--blockers \.lead-detail-action-empty/);
  assert.match(css, /\[data-stage232a-r10-r1-missing-tone-row="true"\]/);
  assert.match(css, /background: #fffaeb !important/);
  assert.match(css, /background: #fff7df !important/);
  assert.match(css, /border-color: #fedf89 !important/);
});

test('STAGE232A R10-R1 keeps previous blockers behavior intact', () => {
  assert.match(lead, /data-stage232a-r9-row-actions=\{group\.key === 'blockers' \? 'missing-only' : 'default'\}/);
  assert.match(lead, /data-stage228r13-lead-missing-resolve-action="true"/);
  assert.match(lead, /data-stage228r15-lead-missing-delete-action="true"/);
});
