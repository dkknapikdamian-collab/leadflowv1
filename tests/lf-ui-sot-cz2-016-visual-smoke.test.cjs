const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-016';
const NEXT_STAGE = `CZ2-${String(17).padStart(3, '0')}`;
const MOJIBAKE_PATTERN = /\u00c5|\u00c4|\u0102|\u00e2\u20ac|\uFFFD/;

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

const manifestPath = '_project/lf-ui-sot-cz2-016-visual-smoke-manifest.json';
const requiredRoutes = ['/today', '/leads', '/clients', '/cases', '/tasks', '/calendar', '/billing', '/response-templates'];
const requiredChecks = [
  'layout-shell-present',
  'sidebar-present',
  'page-header-present',
  'no-mojibake',
  'no-runtime-crash-marker',
  'cards-render',
  'icons-render-through-sot',
  'forms-render-through-sot-where-migrated',
  'filters-render-through-sot-where-migrated',
  'layout-sot-marker-present-where-migrated',
];

const sotFiles = [
  'src/components/layout/app-shell.tsx',
  'src/components/layout/page-shell.tsx',
  'src/components/layout/page-header.tsx',
  'src/components/layout/content-rail-layout.tsx',
  'src/components/layout/sidebar-nav.tsx',
  'src/components/ui/search-field.tsx',
  'src/components/ui/filter-select.tsx',
  'src/components/ui/sort-select.tsx',
  'src/components/ui/filter-chip-group.tsx',
  'src/components/ui/filter-toolbar.tsx',
  'src/components/ui/form-field.tsx',
  'src/components/ui/form-section.tsx',
  'src/components/ui/select-field.tsx',
  'src/components/ui/textarea-field.tsx',
  'src/components/ui/metric-card.tsx',
  'src/components/ui/list-card.tsx',
  'src/components/ui/empty-state-card.tsx',
  'src/components/ui/detail-panel.tsx',
  'src/components/ui/icon.tsx',
  'src/components/ui/icon-button.tsx',
  'src/lib/source-of-truth/icon-registry.ts',
];

test('CZ2-016 manifest exists and is valid JSON', () => {
  assert.equal(exists(manifestPath), true, `${manifestPath} must exist`);
  const manifest = JSON.parse(read(manifestPath));
  assert.equal(manifest.stage, STAGE);
  assert.equal(manifest.type, 'visual-smoke');
});

test('CZ2-016 manifest has required routes and checks', () => {
  const manifest = JSON.parse(read(manifestPath));
  for (const route of requiredRoutes) assert.equal(manifest.routes.includes(route), true, `manifest missing route ${route}`);
  for (const route of ['/leads/:id', '/clients/:id', '/cases/:id']) assert.equal(manifest.detailRoutes.includes(route), true, `manifest missing detail route ${route}`);
  for (const check of requiredChecks) assert.equal(manifest.checks.includes(check), true, `manifest missing check ${check}`);
});

test('CZ2-016 App.tsx and routes.ts contain manifest views', () => {
  const app = read('src/App.tsx');
  const routes = read('src/lib/routes.ts');
  for (const token of ['CLOSEFLOW_ROUTES.today', 'CLOSEFLOW_ROUTES.leads', 'CLOSEFLOW_ROUTES.clients', 'CLOSEFLOW_ROUTES.cases', 'CLOSEFLOW_ROUTES.tasks', 'CLOSEFLOW_ROUTES.calendar', 'CLOSEFLOW_ROUTES.billing', 'CLOSEFLOW_ROUTES.responseTemplates']) {
    assert.equal(app.includes(token), true, `App.tsx missing ${token}`);
  }
  for (const token of ["today: '/today'", "leads: '/leads'", "clients: '/clients'", "cases: '/cases'", "tasks: '/tasks'", "calendar: '/calendar'", "billing: '/billing'", "responseTemplates: '/response-templates'"]) {
    assert.equal(routes.includes(token), true, `routes.ts missing ${token}`);
  }
});

test('CZ2-016 SOT components from CZ2-011..015 exist', () => {
  for (const file of sotFiles) assert.equal(exists(file), true, `${file} must exist`);
});

test('CZ2-016 shell/layout smoke anchors are present', () => {
  const layout = read('src/components/Layout.tsx');
  for (const token of ['className="app closeflow-visual-stage01 cf-html-shell"', 'data-shell-sidebar="true"', 'data-shell-main="true"', 'data-shell-content="true"']) {
    assert.equal(layout.includes(token), true, `Layout missing ${token}`);
  }
});

test('CZ2-016 ResponseTemplates keeps Layout and PageShell marker', () => {
  const source = read('src/pages/ResponseTemplates.tsx');
  for (const token of ["import Layout from '../components/Layout'", '<Layout>', "import { PageShell } from '../components/layout/page-shell'", '<PageShell', 'data-cf-layout-scoped-migration']) {
    assert.equal(source.includes(token), true, `ResponseTemplates missing ${token}`);
  }
});

test('CZ2-016 files do not contain next stage marker', () => {
  for (const file of [manifestPath, 'scripts/guards/verify-lf-ui-sot-cz2-016-visual-smoke.cjs', 'tests/lf-ui-sot-cz2-016-visual-smoke.test.cjs']) {
    assert.equal(read(file).includes(NEXT_STAGE), false, `${file} must not contain next-stage marker`);
  }
});

test('CZ2-016 source has no mojibake markers', () => {
  for (const file of [manifestPath, 'scripts/guards/verify-lf-ui-sot-cz2-016-visual-smoke.cjs', 'tests/lf-ui-sot-cz2-016-visual-smoke.test.cjs', 'src/App.tsx', 'src/lib/routes.ts', 'src/components/Layout.tsx', 'src/pages/ResponseTemplates.tsx', ...sotFiles]) {
    assert.equal(MOJIBAKE_PATTERN.test(read(file)), false, `${file} contains mojibake marker`);
  }
});
