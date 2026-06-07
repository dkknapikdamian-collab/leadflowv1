const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const unified = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

test('Stage227E0 adds one shared detail shell width contract', () => {
  assert.ok(unified.includes('STAGE227E0_DETAIL_SHELL_WIDTH_AUDIT'));
  assert.ok(unified.includes('--cf-detail-shell-gutter-x'));
  assert.ok(unified.includes('clamp(16px, 1.6vw, 24px)'));
});

test('Stage227E0 covers LeadDetail, ClientDetail and CaseDetail shells', () => {
  for (const token of ['.lead-detail-vnext-page', '.client-detail-vnext-page', '.case-detail-vnext-page', '.lead-detail-shell', '.client-detail-shell', '.case-detail-shell']) {
    assert.ok(unified.includes(token), 'missing ' + token);
  }
});

test('Stage227E0 prevents growing side moats with explicit overrides', () => {
  assert.ok(unified.includes('max-width: none !important'));
  assert.ok(unified.includes('margin-left: 0 !important'));
  assert.ok(unified.includes('margin-right: 0 !important'));
  assert.ok(unified.includes('padding-left: var(--cf-detail-shell-gutter-x) !important'));
  assert.ok(unified.includes('padding-right: var(--cf-detail-shell-gutter-x) !important'));
});

test('Stage227E0 keeps routing through the existing Layout shell', () => {
  assert.ok(layout.includes('data-shell-content="true"'));
  assert.ok(layout.includes('data-current-section={currentSection}'));
});
