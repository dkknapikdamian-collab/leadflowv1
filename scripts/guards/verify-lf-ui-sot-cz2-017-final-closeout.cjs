const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-017';
const forbiddenStage = `CZ2-${String(18).padStart(3, '0')}`;
const ALIAS = 'verify:lf-ui-sot-cz2-017-final-closeout';
const errors = [];
const warnings = [];

const MOJIBAKE_PATTERN = /\u00c5|\u00c4|\u0102|\u00e2\u20ac|\uFFFD/;

function filePath(rel) {
  return path.join(ROOT, rel);
}

function exists(rel) {
  return fs.existsSync(filePath(rel));
}

function read(rel) {
  if (!exists(rel)) {
    errors.push(`Missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(filePath(rel), 'utf8');
}

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    errors.push(`${rel} is not valid JSON: ${error.message}`);
    return {};
  }
}

function mustExist(file) {
  if (!exists(file)) errors.push(`Missing file: ${file}`);
}

function mustInclude(file, token, message) {
  if (!read(file).includes(token)) errors.push(message || `${file} missing ${token}`);
}

function assertNoMojibake(file) {
  const source = read(file);
  if (MOJIBAKE_PATTERN.test(source)) errors.push(`Mojibake marker found in ${file}`);
}

function currentChangedFiles() {
  try {
    const output = execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
    return output ? output.split(/\r?\n/).filter(Boolean) : [];
  } catch (error) {
    warnings.push(`Could not read git diff --name-only HEAD: ${error.message}`);
    return [];
  }
}

const packageAliases = [
  'verify:lf-ui-sot-cz2-009-activity-event-copy-source-of-truth',
  'verify:lf-ui-sot-cz2-010-action-button-semantics',
  'verify:lf-ui-sot-cz2-011-icon-registry',
  'verify:lf-ui-sot-cz2-012-card-tile-panel-variants',
  'verify:lf-ui-sot-cz2-013-form-control-variants',
  'verify:lf-ui-sot-cz2-014-filter-search-sort-controls',
  'verify:lf-ui-sot-cz2-015-layout-sidebar',
  'verify:lf-ui-sot-cz2-016-visual-smoke',
  ALIAS,
];

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

const coreFiles = [
  'AGENTS.md',
  'package.json',
  'src/App.tsx',
  'src/lib/routes.ts',
  'src/components/Layout.tsx',
  'src/pages/ResponseTemplates.tsx',
  '_project/lf-ui-sot-cz2-016-visual-smoke-manifest.json',
];

const packageSource = read('package.json');
if (packageSource.charCodeAt(0) === 0xFEFF) errors.push('package.json must not start with BOM');

let packageJson = {};
try {
  packageJson = JSON.parse(packageSource);
} catch (error) {
  errors.push(`package.json is not valid JSON: ${error.message}`);
}

for (const alias of packageAliases) {
  if (!packageJson.scripts || !packageJson.scripts[alias]) {
    errors.push(`package.json missing script alias: ${alias}`);
  }
}

for (const file of [...guardFiles, ...testFiles, ...sotFiles, ...coreFiles]) mustExist(file);

const manifest = readJson('_project/lf-ui-sot-cz2-016-visual-smoke-manifest.json');
if (manifest.stage !== 'LF-UI-SOT-CZ2-016') errors.push('CZ2-016 manifest must keep stage LF-UI-SOT-CZ2-016');
if (manifest.type !== 'visual-smoke') errors.push('CZ2-016 manifest must keep type visual-smoke');

mustInclude('src/components/Layout.tsx', 'className="app closeflow-visual-stage01 cf-html-shell"', 'Layout.tsx must render CloseFlow app shell');
mustInclude('src/components/Layout.tsx', 'data-shell-sidebar="true"', 'Layout.tsx must render shell sidebar');
mustInclude('src/components/Layout.tsx', 'data-shell-main="true"', 'Layout.tsx must render shell main');
mustInclude('src/components/Layout.tsx', 'data-shell-content="true"', 'Layout.tsx must render shell content wrapper');

mustInclude('src/pages/ResponseTemplates.tsx', "import Layout from '../components/Layout'", 'ResponseTemplates must keep Layout wrapper');
mustInclude('src/pages/ResponseTemplates.tsx', '<Layout>', 'ResponseTemplates must render Layout wrapper');
mustInclude('src/pages/ResponseTemplates.tsx', "import { PageShell } from '../components/layout/page-shell'", 'ResponseTemplates must import PageShell');
mustInclude('src/pages/ResponseTemplates.tsx', '<PageShell', 'ResponseTemplates must render PageShell');
mustInclude('src/pages/ResponseTemplates.tsx', 'data-cf-layout-scoped-migration', 'ResponseTemplates must keep scoped layout migration marker');

const changedFiles = currentChangedFiles();
const forbiddenChangedPatterns = [
  /\.css$/i,
  /^supabase\//i,
  /^migrations\//i,
  /^sql\//i,
  /(^|\/)schema\.sql$/i,
  /^src\/lib\/supabase-fallback\.ts$/i,
  /^src\/lib\/workspace-context\.ts$/i,
  /^src\/lib\/calendar-items\.ts$/i,
  /^src\/lib\/cases\.ts$/i,
  /^src\/App\.tsx$/i,
  /^src\/lib\/routes\.ts$/i,
];

for (const file of changedFiles) {
  if (forbiddenChangedPatterns.some((pattern) => pattern.test(file))) {
    errors.push(`CZ2-017 closeout must not change forbidden runtime/CSS/SQL/data-provider file: ${file}`);
  }
}

const allowedChangedFiles = new Set([
  'package.json',
  'scripts/guards/verify-lf-ui-sot-cz2-017-final-closeout.cjs',
  'tests/lf-ui-sot-cz2-017-final-closeout.test.cjs',
]);

for (const file of changedFiles) {
  if (!allowedChangedFiles.has(file)) {
    warnings.push(`Non-standard changed file during CZ2-017 closeout: ${file}`);
  }
}

const checkedFiles = [
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

for (const file of checkedFiles) {
  const source = read(file);
  if (source.includes(forbiddenStage)) errors.push(`${file} must not contain forbidden next-stage marker`);
  assertNoMojibake(file);
}

console.log(JSON.stringify({
  ok: errors.length === 0,
  stage: STAGE,
  decision: 'FINAL_AUDIT_AND_CLOSEOUT / NO_REDESIGN / NO_NEXT_CZ2_STAGE',
  manualVisualSmoke: 'DEFERRED_BY_DAMIAN',
  packageAliases,
  guards: guardFiles,
  tests: testFiles,
  sotFiles,
  changedFiles,
  historicalScopeGuards: {
    cz2_015: 'SKIPPED_AS_HISTORICAL_SCOPE_GUARD_IN_FINAL_CLOSEOUT / FALSE_POSITIVE_ON_CZ2_016_ARTIFACTS',
  },
  warnings,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
