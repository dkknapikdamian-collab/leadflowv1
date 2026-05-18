const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leadPath = path.join(root, 'src/pages/LeadDetail.tsx');
const cssPath = path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css');
const quietPath = path.join(root, 'scripts/closeflow-release-check-quiet.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function stageBlock(css) {
  const start = css.indexOf('/* STAGE117_LEAD_DETAIL_VERTICAL_RHYTHM_START */');
  const end = css.indexOf('/* STAGE117_LEAD_DETAIL_VERTICAL_RHYTHM_END */');
  assert.notEqual(start, -1, 'Stage117 CSS start marker missing.');
  assert.notEqual(end, -1, 'Stage117 CSS end marker missing.');
  assert.ok(end > start, 'Stage117 CSS marker order is invalid.');
  return css.slice(start, end);
}

test('Stage117 LeadDetail main column is explicitly marked for vertical rhythm', () => {
  const lead = read(leadPath);
  assert.match(
    lead,
    /<section\s+className="lead-detail-main-column"\s+data-stage117-lead-detail-vertical-rhythm="true">/,
    'LeadDetail main column must carry the Stage117 vertical rhythm marker.',
  );
});

test('Stage117 LeadDetail CSS tightens only vertical rhythm primitives', () => {
  const block = stageBlock(read(cssPath));
  assert.match(block, /lead-detail-main-column\[data-stage117-lead-detail-vertical-rhythm="true"\][\s\S]*gap:\s*12px\s*!important/);
  assert.match(block, /lead-detail-main-column\[data-stage117-lead-detail-vertical-rhythm="true"\][\s\S]*align-content:\s*start\s*!important/);
  assert.match(block, /lead-detail-section-card[\s\S]*padding:\s*16px\s*!important/);
  assert.match(block, /lead-detail-section-head[\s\S]*margin-bottom:\s*10px\s*!important/);
  assert.match(block, /lead-detail-light-empty[\s\S]*padding:\s*12px\s+14px\s*!important/);
});

test('Stage117 does not hide lead operational sections', () => {
  const lead = read(leadPath);
  for (const required of ['Notatki leada', 'Zadania i wydarzenia', 'Historia kontaktu']) {
    assert.ok(lead.includes(required), `LeadDetail must still render section: ${required}`);
  }
  assert.doesNotMatch(lead, /display:\s*none[^\n]*lead-detail-section-card/i);
});

test('Stage117 is wired into the quiet release gate', () => {
  const quiet = read(quietPath);
  assert.ok(
    quiet.includes('tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs'),
    'Stage117 guard must be part of closeflow-release-check-quiet.',
  );
});
