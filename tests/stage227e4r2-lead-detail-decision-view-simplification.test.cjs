const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8').replace(/^\uFEFF/, '');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-lead-detail-sales-signal-stage227e4.css'), 'utf8').replace(/^\uFEFF/, '');

test('Stage227E4R2 uses compact sales context instead of heavy sales signal wall', () => {
  assert.ok(source.includes('Kontekst sprzedażowy'));
  assert.ok(source.includes('data-stage227e4r2-sales-context-section="true"'));
  assert.ok(source.includes('data-stage227e4r2-compact-context-grid="true"'));
  assert.ok(!source.includes('SYGNAŁ SPRZEDAŻOWY'));
});

test('Stage227E4R2 keeps only movement-driving fields', () => {
  for (const label of ['Potrzeba / problem', 'Termin / pilność', 'Budżet / potencjał', 'Decyzja', 'Blokada']) {
    assert.ok(source.includes(label), label);
  }
  assert.ok(!source.includes('Powód kontaktu'));
});

test('Stage227E4R2 does not duplicate source/status as decision context', () => {
  const helperStart = source.indexOf('function buildLeadSalesSignalStage227E4');
  const helperEnd = source.indexOf('export default function LeadDetail()', helperStart);
  assert.ok(helperStart > -1 && helperEnd > helperStart);
  const helper = source.slice(helperStart, helperEnd);
  assert.ok(!helper.includes('input.sourceLabel'));
  assert.ok(!helper.includes('lead.status'));
  assert.ok(!helper.includes("key: 'reason'"));
});

test('Stage227E4R2 remains before Work Action Center and has compact CSS', () => {
  const contextIndex = source.indexOf('data-stage227e4r2-sales-context-section="true"');
  const actionCenterIndex = source.indexOf('data-stage228b-lead-work-action-center="true"');
  assert.ok(contextIndex > -1 && actionCenterIndex > -1 && contextIndex < actionCenterIndex);
  assert.ok(css.includes('lead-detail-sales-context-grid'));
  assert.ok(css.includes('min-height: 92px'));
});
