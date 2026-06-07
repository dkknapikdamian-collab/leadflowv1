const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8').replace(/^\uFEFF/, '');
test('Stage227F2R1 prevents LeadDetail Telefon/Kopiuj clipping', () => {
  const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
  assert.ok(css.includes('STAGE227F2R1_LEAD_COPY_BUTTON_NO_CLIP_START'));
  assert.ok(css.includes('grid-template-columns: minmax(0, 1fr) auto !important;'));
  assert.ok(css.includes('grid-row: 1 / 3 !important;'));
  assert.ok(css.includes('min-height: 58px !important;'));
});
test('Stage227F2R1 stretches ClientDetail header and shell without auto moats', () => {
  const css = read('src/styles/visual-stage12-client-detail-vnext.css');
  assert.ok(css.includes('STAGE227F2R1_CLIENT_HEADER_STRETCH_START'));
  assert.ok(css.includes('.client-detail-header,'));
  assert.ok(css.includes('max-width: none !important;'));
  assert.ok(css.includes('margin-left: 0 !important;'));
  assert.ok(css.includes('grid-template-columns: minmax(260px, 300px) minmax(0, 1fr) minmax(280px, 310px) !important;'));
});
test('Stage227F2R1 stretches CaseDetail header and shell with the same shared rule', () => {
  const css = read('src/styles/visual-stage13-case-detail-vnext.css');
  const shared = read('src/styles/closeflow-unified-page-canvas-stage211c.css');
  assert.ok(css.includes('STAGE227F2R1_CASE_HEADER_STRETCH_START'));
  assert.ok(css.includes('.case-detail-header,'));
  assert.ok(css.includes('grid-template-columns: minmax(0, 1fr) minmax(300px, 320px) !important;'));
  assert.ok(shared.includes('STAGE227F2R1_SHARED_DETAIL_HEADER_STRETCH_START'));
  assert.ok(shared.includes(':where(.client-detail-header, .case-detail-header)'));
});
