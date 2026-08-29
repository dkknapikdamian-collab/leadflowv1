const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const rightRailOwnerPath = 'src/styles/owners/closeflow-records-and-rails.css';

test('Stage96 Leads rail renders simple filters before top value card', () => {
  const leads = read('src/pages/Leads.tsx');
  const simpleFiltersIndex = leads.indexOf('dataTestId="leads-simple-filters-card"');
  const topValueIndex = leads.indexOf('dataTestId="leads-top-value-records-card"');
  assert.notEqual(simpleFiltersIndex, -1, 'Missing leads simple filters card.');
  assert.notEqual(topValueIndex, -1, 'Missing leads top value card.');
  assert.ok(simpleFiltersIndex < topValueIndex, 'Simple filters must render before top value card.');
});

test('Stage96 Leads layout delegates right rail width to source truth', () => {
  const leads = read('src/pages/Leads.tsx');
  const layoutStart = leads.indexOf('data-stage25-leads-layout-list="true"');
  assert.notEqual(layoutStart, -1, 'Missing Leads layout marker.');
  const layoutOpen = leads.slice(Math.max(0, leads.lastIndexOf('<div', layoutStart)), leads.indexOf('>', layoutStart) + 1);
  assert.ok(layoutOpen.includes('className="layout-list"'), 'Leads layout-list should not carry a local rail width class.');
  assert.ok(!layoutOpen.includes('grid-cols-['), 'Leads layout-list should not carry Tailwind grid width override.');
  assert.ok(!layoutOpen.includes('_300px'), 'Leads layout-list should not carry a local 300px rail override.');

  assert.ok(layoutOpen.includes('data-cf-right-rail-layout-source="shared"'), 'Leads layout should mark shared rail source truth.');
  assert.ok(layoutOpen.includes('data-stage96-leads-right-rail-source-truth="true"'), 'Leads layout should expose the Stage96 shared rail contract.');
});

test('Stage96 right rail source truth defines shared Clients/Leads width', () => {
  const css = read(rightRailOwnerPath);
  assert.match(css, /LF-UI-SOT-007_OWNER .*"ownerId":"semantic:records-rails"/);
  assert.ok(css.includes('--cf-right-rail-width-min: 300px;'));
  assert.ok(css.includes('--cf-right-rail-width-preferred: 320px;'));
  assert.ok(css.includes('--cf-right-rail-width-max: 340px;'));
  assert.match(css, /:is\(\.main-leads-html, \.main-clients-html\)/);
  assert.ok(!css.includes('195px'), 'Right rail source truth must not contain legacy narrow width literal.');
});

test('Stage96 Leads rail lock no longer moves top-value above filters', () => {
  const css = read(rightRailOwnerPath);
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
