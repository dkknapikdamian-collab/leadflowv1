const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

function sliceBetween(text, start, end) {
  const s = text.indexOf(start);
  assert.notEqual(s, -1, 'Missing start marker: ' + start);
  const e = text.indexOf(end, s);
  assert.notEqual(e, -1, 'Missing end marker after: ' + end);
  return text.slice(s, e);
}

test('Stage96 Leads rail renders simple filters before top value card', () => {
  const leads = read('src/pages/Leads.tsx');
  const rail = sliceBetween(leads, 'className="lead-right-rail', '<div hidden data-leads-stage35-removed-ai-side-card');
  assert.ok(rail.indexOf('dataTestId="leads-simple-filters-card"') >= 0, 'Missing leads simple filters card.');
  assert.ok(rail.indexOf('dataTestId="leads-top-value-records-card"') >= 0, 'Missing leads top value card.');
  assert.ok(rail.indexOf('dataTestId="leads-simple-filters-card"') < rail.indexOf('dataTestId="leads-top-value-records-card"'), 'Simple filters must render before top value card.');
});

test('Stage96 Leads layout delegates right rail width to source truth', () => {
  const leads = read('src/pages/Leads.tsx');
  const layoutStart = leads.indexOf('data-stage25-leads-layout-list="true"');
  assert.notEqual(layoutStart, -1, 'Missing Leads layout marker.');
  const layoutOpen = leads.slice(Math.max(0, leads.lastIndexOf('<div', layoutStart)), leads.indexOf('>', layoutStart) + 1);
  assert.ok(layoutOpen.includes('className="layout-list"'), 'Leads layout-list should not carry a local rail width class.');
  assert.ok(!layoutOpen.includes('grid-cols-['), 'Leads layout-list should not carry Tailwind grid width override.');
  assert.ok(!layoutOpen.includes('_300px'), 'Leads layout-list should not carry a local 300px rail override.');

  const railOpenIndex = leads.indexOf('className="lead-right-rail');
  assert.notEqual(railOpenIndex, -1, 'Missing lead-right-rail.');
  const railOpen = leads.slice(leads.lastIndexOf('<div', railOpenIndex), leads.indexOf('>', railOpenIndex) + 1);
  assert.ok(railOpen.includes('data-cf-right-rail-source="shared"'), 'Lead right rail should mark shared source truth.');
  assert.ok(railOpen.includes('cf-operator-right-rail'), 'Lead right rail should use shared operator rail class.');
});

test('Stage96 right rail source truth defines shared Clients/Leads width', () => {
  const css = read('src/styles/closeflow-right-rail-source-truth.css');
  assert.ok(css.includes('CLOSEFLOW_RIGHT_RAIL_WIDTH_POSITION_STAGE96_2026_05_16'));
  assert.ok(css.includes('--cf-right-rail-width-min: 300px;'));
  assert.ok(css.includes('--cf-right-rail-width-preferred: 320px;'));
  assert.ok(css.includes('--cf-right-rail-width-max: 340px;'));
  assert.ok(css.includes('.main-leads-html, .main-clients-html'));
  assert.ok(!css.includes('195px'), 'Right rail source truth must not contain legacy narrow width literal.');
});

test('Stage96 Leads rail lock no longer moves top-value above filters', () => {
  const css = read('src/styles/closeflow-leads-right-rail-layout-lock.css');
  assert.ok(!css.includes('order: -10'), 'Leads rail lock must not move top-value above filters.');
  assert.ok(css.includes('order: 10'), 'Top value card should stay after simple filters.');
  assert.ok(!css.includes('minmax(280px, 315px)'), 'Leads rail lock must delegate width to shared source truth tokens.');
});

test('Stage96 SimpleFiltersCard has no recursive operator-rail import', () => {
  const simple = read('src/components/operator-rail/SimpleFiltersCard.tsx');
  assert.ok(!simple.includes("import { OperatorSideCard, SimpleFiltersCard } from '../components/operator-rail'"), 'SimpleFiltersCard must not import itself through operator-rail barrel.');
});

test('Stage96 guard is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes('tests/stage96-leads-right-rail-width-position.test.cjs'));
});
