const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leads = fs.readFileSync(path.join(root, 'src/pages/Leads.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-leads-right-rail-layout-lock.css'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function requireSource(source, fragment, message = fragment) {
  assert.ok(source.includes(fragment), 'Missing source fragment: ' + message);
}

test('Stage117 Leads right rail starts at search anchor with simple filters before top value', () => {
  requireSource(leads, 'STAGE117_LEADS_RIGHT_RAIL_LAYOUT_CONTRACT');
  requireSource(leads, 'data-stage117-leads-right-rail-layout="true"');
  requireSource(leads, 'data-stage117-leads-search-anchor="true"');
  requireSource(leads, 'data-stage117-leads-search-suggestions="true"');
  requireSource(leads, 'data-stage117-leads-list="true"');
  requireSource(leads, 'data-stage117-leads-right-rail="true"');
  requireSource(leads, 'STAGE117_RAIL_ORDER_SIMPLE_FILTERS_FIRST');
  requireSource(leads, 'STAGE117_RAIL_ORDER_TOP_VALUE_BELOW_FILTERS');

  const simpleFiltersIndex = leads.indexOf('<SimpleFiltersCard');
  const topValueIndex = leads.indexOf('<TopValueRecordsCard');
  assert.ok(simpleFiltersIndex > -1, 'SimpleFiltersCard must exist on /leads');
  assert.ok(topValueIndex > -1, 'TopValueRecordsCard must exist on /leads');
  assert.ok(simpleFiltersIndex < topValueIndex, 'Filtry proste must render before Najcenniejsze leady');

  requireSource(css, 'STAGE117_LEADS_RIGHT_RAIL_LAYOUT_CONTRACT');
  requireSource(css, "grid-template-areas:");
  requireSource(css, '"search rail"');
  requireSource(css, '"suggestions rail"');
  requireSource(css, '"list rail"');
  requireSource(css, 'display: contents !important;');
  requireSource(css, "[data-stage117-leads-search-anchor='true']");
  requireSource(css, "[data-stage117-leads-right-rail='true']");
  requireSource(css, 'grid-area: rail !important;');
  requireSource(css, 'grid-row: 1 / span 3 !important;');
  requireSource(css, 'order: 0 !important;');
  requireSource(css, 'order: 1 !important;');
  requireSource(css, '@media (max-width: 1079px)');
  requireSource(css, '"search"');
  requireSource(css, '"rail"');
  requireSource(css, '"list"');
  assert.doesNotMatch(css, /STAGE117[\s\S]*translateY\(/, 'Stage117 must not use translateY hacks');

  assert.equal(
    pkg.scripts['check:stage117-leads-right-rail-layout-contract'],
    'node --test tests/stage117-leads-right-rail-layout-contract.test.cjs',
  );
});
