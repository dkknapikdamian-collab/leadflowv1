const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage227F2 fixes LeadDetail copy chip clipping by using a two-column meta row grid', () => {
  const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
  assert.ok(css.includes('STAGE227F2_LEAD_HEADER_COPY_BUTTON_POLISH_START'));
  assert.ok(css.includes('[data-stage227e1-header-phone="true"]'));
  assert.ok(css.includes('[data-stage227e1-header-email="true"]'));
  assert.ok(css.includes('grid-template-columns: minmax(0, 1fr) auto'));
  assert.ok(css.includes('grid-row: 1 / span 2'));
  assert.ok(css.includes('min-height: 48px'));
});

test('Stage227F2 applies one shared shell contract for ClientDetail and CaseDetail', () => {
  const css = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
  assert.ok(css.includes('STAGE227F2_SHARED_DETAIL_SHELL_AND_CLIENT_CASE_WIDTH_POLISH_START'));
  assert.ok(css.includes('--cf-detail-shell-gutter-x: clamp(12px, 1.1vw, 18px)'));
  assert.ok(css.includes('.client-detail-shell'));
  assert.ok(css.includes('.case-detail-shell'));
  assert.ok(css.includes('max-width: none'));
  assert.ok(css.includes('grid-template-columns: var(--cf-detail-left-rail-width) minmax(0, 1fr) var(--cf-detail-right-rail-width)'));
  assert.ok(css.includes('grid-template-columns: minmax(0, 1fr) var(--cf-case-right-rail-width)'));
});

test('Stage227F2 keeps runtime scope to existing detail pages', () => {
  const clientDetail = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
  const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
  assert.ok(clientDetail.includes('className="client-detail-shell"'));
  assert.ok(caseDetail.includes('className="case-detail-shell"'));
});
