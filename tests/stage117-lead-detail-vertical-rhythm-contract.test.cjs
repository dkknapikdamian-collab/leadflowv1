const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leadPath = path.join(root, 'src/pages/LeadDetail.tsx');
const cssPath = path.join(root, 'src/styles/owners/closeflow-page-adapters.css');
const quietPath = path.join(root, 'scripts/closeflow-release-check-quiet.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
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
  const css = read(cssPath);
  assert.match(css, /LF-UI-SOT-007_OWNER[\s\S]*"ownerId":"semantic:page-adapters"[\s\S]*"consumerRoots":\[[^\]]*"src\/pages\/LeadDetail\.tsx"[^\]]*\][\s\S]*"role":"scoped-adapter"/);
  assert.match(css, /\.lead-detail-vnext-page \.lead-detail-main-column,[\s\S]*display:\s*grid;[\s\S]*align-content:\s*start;[\s\S]*gap:\s*var\(--cf-vst-layout-gap,\s*18px\);/);
  assert.match(css, /\.lead-detail-vnext-page \.lead-detail-main-column,[\s\S]*\.case-detail-vnext-page \.case-detail-right-rail\s*\{[\s\S]*display:\s*grid;/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.lead-detail-vnext-page \.lead-detail-main-column,[\s\S]*gap:\s*14px;/);
  assert.doesNotMatch(css, /lead-detail-section-card[^{}]*\{[\s\S]*(?:padding|margin|background|color|border)\s*:/i, 'Route adapter must not own generic card semantics.');
  assert.doesNotMatch(css, /lead-detail-section-head[^{}]*\{[\s\S]*(?:padding|margin|background|color|border)\s*:/i, 'Route adapter must not own generic section-head semantics.');
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
