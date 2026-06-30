const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const forbiddenStage = `CZ2-${String(18).padStart(3, '0')}`;
const MOJIBAKE_PATTERN = /\u00c5|\u00c4|\u0102|\u00e2\u20ac|\uFFFD/;

function filePath(rel) {
  return path.join(ROOT, rel);
}

function read(rel) {
  return fs.readFileSync(filePath(rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(filePath(rel));
}

const guardFiles = [
  'scripts/guards/verify-lf-ui-sot-cz2-009-activity-event-copy-source-of-truth.cjs',
  'scripts/guards/verify-lf-ui-sot-cz2-010-action-button-semantics.cjs',
  'scripts/guards/verify-lf-ui-sot-cz2-011-icon-registry.cjs',
  'scripts/guards/verify-lf-ui-sot-cz2-012-card-tile-panel-variants.cjs',
  'scripts/guards/verify-lf-ui-sot-cz2-013-form-control-variants.cjs',
  'scripts/guards/verify-lf-ui-sot-cz2-014-filter-search-sort-controls.cjs',
  'scripts/guards/verify-lf-ui-sot-cz2-015-layout-sidebar.cjs',
  'scripts/guards/verify-lf-ui-sot-cz2-016-visual-smoke.cjs',
  'scripts/guards/verify-lf-ui-sot-cz2-017-final-closeout.cjs',
];

const testFiles = [
  'tests/lf-ui-sot-cz2-011-icon-registry.test.cjs',
  'tests/lf-ui-sot-cz2-012-card-tile-panel-variants.test.cjs',
  'tests/lf-ui-sot-cz2-013-form-control-variants.test.cjs',
  'tests/lf-ui-sot-cz2-014-filter-search-sort-controls.test.cjs',
  'tests/lf-ui-sot-cz2-015-layout-sidebar.test.cjs',
  'tests/lf-ui-sot-cz2-016-visual-smoke.test.cjs',
  'tests/lf-ui-sot-cz2-017-final-closeout.test.cjs',
];

const sotFiles = [
  'src/lib/source-of-truth/icon-registry.ts',
  'src/components/ui/icon.tsx',
  'src/components/ui/icon-button.tsx',
  'src/components/ui/metric-card.tsx',
  'src/components/ui/list-card.tsx',
  'src/components/ui/empty-state-card.tsx',
  'src/components/ui/detail-panel.tsx',
  'src/components/ui/form-field.tsx',
  'src/components/ui/form-section.tsx',
  'src/components/ui/select-field.tsx',
  'src/components/ui/textarea-field.tsx',
  'src/components/ui/search-field.tsx',
  'src/components/ui/filter-select.tsx',
  'src/components/ui/sort-select.tsx',
  'src/components/ui/filter-chip-group.tsx',
  'src/components/ui/filter-toolbar.tsx',
  'src/components/layout/app-shell.tsx',
  'src/components/layout/page-shell.tsx',
  'src/components/layout/page-header.tsx',
  'src/components/layout/content-rail-layout.tsx',
  'src/components/layout/sidebar-nav.tsx',
];

test('CZ2-017 package alias is registered without BOM', () => {
  const raw = read('package.json');
  assert.notEqual(raw.charCodeAt(0), 0xFEFF);
  const pkg = JSON.parse(raw);
  assert.equal(
    pkg.scripts['verify:lf-ui-sot-cz2-017-final-closeout'],
    'node scripts/guards/verify-lf-ui-sot-cz2-017-final-closeout.cjs'
  );
});

test('CZ2-017 guard and previous CZ2 guards exist', () => {
  for (const file of guardFiles) assert.equal(exists(file), true, `${file} should exist`);
});

test('CZ2-017 test and required previous tests exist', () => {
  for (const file of testFiles) assert.equal(exists(file), true, `${file} should exist`);
});

test('CZ2-016 visual smoke manifest remains valid', () => {
  const manifest = JSON.parse(read('_project/lf-ui-sot-cz2-016-visual-smoke-manifest.json'));
  assert.equal(manifest.stage, 'LF-UI-SOT-CZ2-016');
  assert.equal(manifest.type, 'visual-smoke');
  assert.ok(manifest.routes.includes('/today'));
  assert.ok(manifest.routes.includes('/response-templates'));
  assert.ok(manifest.detailRoutes.includes('/cases/:id'));
});

test('CZ2-011..015 source-of-truth components exist', () => {
  for (const file of sotFiles) assert.equal(exists(file), true, `${file} should exist`);
});

test('CZ2-017 core route and shell files remain present', () => {
  for (const file of ['src/App.tsx', 'src/lib/routes.ts', 'src/components/Layout.tsx']) {
    assert.equal(exists(file), true, `${file} should exist`);
  }

  const layout = read('src/components/Layout.tsx');
  assert.ok(layout.includes('className="app closeflow-visual-stage01 cf-html-shell"'));
  assert.ok(layout.includes('data-shell-sidebar="true"'));
  assert.ok(layout.includes('data-shell-main="true"'));
  assert.ok(layout.includes('data-shell-content="true"'));
});

test('CZ2-017 ResponseTemplates keeps scoped PageShell migration marker', () => {
  const source = read('src/pages/ResponseTemplates.tsx');
  assert.ok(source.includes("import Layout from '../components/Layout'"));
  assert.ok(source.includes('<Layout>'));
  assert.ok(source.includes("import { PageShell } from '../components/layout/page-shell'"));
  assert.ok(source.includes('<PageShell'));
  assert.ok(source.includes('data-cf-layout-scoped-migration'));
});

test('CZ2-017 source files do not contain forbidden next-stage marker', () => {
  const files = [
    'package.json',
    '_project/lf-ui-sot-cz2-016-visual-smoke-manifest.json',
    'scripts/guards/verify-lf-ui-sot-cz2-017-final-closeout.cjs',
    'tests/lf-ui-sot-cz2-017-final-closeout.test.cjs',
  ];

  for (const file of files) assert.equal(read(file).includes(forbiddenStage), false, `${file} must not include forbidden next-stage marker`);
});

test('CZ2-017 checked source has no mojibake markers', () => {
  const files = [
    'package.json',
    '_project/lf-ui-sot-cz2-016-visual-smoke-manifest.json',
    'src/App.tsx',
    'src/lib/routes.ts',
    'src/components/Layout.tsx',
    'src/pages/ResponseTemplates.tsx',
    'scripts/guards/verify-lf-ui-sot-cz2-017-final-closeout.cjs',
    'tests/lf-ui-sot-cz2-017-final-closeout.test.cjs',
    ...sotFiles,
  ];

  for (const file of files) assert.equal(MOJIBAKE_PATTERN.test(read(file)), false, `${file} must not contain mojibake`);
});
