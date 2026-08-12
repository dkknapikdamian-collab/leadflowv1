#!/usr/bin/env node
/* LF-UI-SOT-007 deterministic visual ownership guards. */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const mode = process.argv[2] || 'all';
const fixtureIndex = process.argv.indexOf('--fixture');
const fixturePath = fixtureIndex >= 0 ? process.argv[fixtureIndex + 1] : null;

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function fail(message) {
  console.error(`LF-UI-SOT-007_${mode.toUpperCase()}_FAIL: ${message}`);
  process.exitCode = 1;
}

function requiredFile(file) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) fail(`Brak canonical ownera: ${file}`);
  return absolute;
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function diffAddedLines() {
  if (fixturePath) return [{ file: 'fixture', text: fs.readFileSync(path.resolve(fixturePath), 'utf8') }];
  let diff = '';
  try {
    diff = execFileSync('git', ['diff', '--unified=0', '--no-color', '--', 'src', 'scripts', 'package.json'], { cwd: root, encoding: 'utf8' });
  } catch {
    return [];
  }
  const entries = [];
  let file = '';
  for (const line of diff.split(/\r?\n/)) {
    if (line.startsWith('+++ b/')) {
      file = line.slice(6);
      continue;
    }
    if (line.startsWith('+') && !line.startsWith('+++')) entries.push({ file, text: line.slice(1) });
  }
  return entries;
}

function assertCanonicalFiles(requirements) {
  for (const { file, markers } of requirements) {
    const source = read(file);
    for (const marker of markers) {
      if (!source.includes(marker)) fail(`${file} nie zawiera wymaganego markera: ${marker}`);
    }
  }
}

function checkAddedOwnership(entries, allowedFiles, pattern, label) {
  const findings = entries
    .filter((entry) => entry.file !== 'fixture' && !allowedFiles.has(entry.file))
    .filter((entry) => pattern.test(entry.text));
  if (findings.length) {
    fail(`${label}: ${findings.slice(0, 8).map((entry) => `${entry.file}: ${entry.text.trim()}`).join(' | ')}`);
  }
}

function runIcons() {
  assertCanonicalFiles([
    { file: 'src/ui-system/icons/SemanticIcon.tsx', markers: ['SemanticIcon', 'semanticIconConfig'] },
    { file: 'src/components/ui-system/icon-registry.ts', markers: ['ENTITY_ICON_MAP'] },
    { file: 'src/components/ui-system/action-icon-registry.ts', markers: ['ACTION_ICON_MAP'] },
    { file: 'src/components/ui-system/ActionIcon.tsx', markers: ['ActionIcon'] },
    { file: 'src/components/ui-system/EntityIcon.tsx', markers: ['EntityIcon'] },
  ]);

  const allowed = new Set([
    'src/ui-system/icons/SemanticIcon.tsx',
    'src/components/ui-system/icon-registry.ts',
    'src/components/ui-system/action-icon-registry.ts',
    'src/components/ui-system/ActionIcon.tsx',
    'src/components/ui-system/EntityIcon.tsx',
    'src/lib/source-of-truth/icon-registry.ts',
  ]);
  checkAddedOwnership(
    diffAddedLines(),
    allowed,
    /\b(?:[A-Za-z_$][\w$]*)(?:ICON|Icon|icon)(?:_?MAP|_?REGISTRY|_?CONFIG|_?DEFINITIONS?)\b\s*=/,
    'nowa lokalna definicja semantic/action icon poza canonical ownerem',
  );

  const fixture = fixturePath ? fs.readFileSync(path.resolve(fixturePath), 'utf8') : '';
  if (fixturePath && !/\bLOCAL_ICON_MAP\b/.test(fixture)) fail('fixture icons musi zawierać LOCAL_ICON_MAP');
  if (!fixturePath || !/\bLOCAL_ICON_MAP\b/.test(fixture)) {
    console.log('LF-UI-SOT-007_SSOT_ICONS_CHECK_OK');
    return;
  }
  fail('negative fixture wykryty poprawnie: LOCAL_ICON_MAP');
}

function runColors() {
  assertCanonicalFiles([
    { file: 'src/components/ui-system/semantic-visual-registry.ts', markers: ['SEMANTIC_VISUAL_MAP'] },
    { file: 'src/lib/closeflow-visual-source-truth.ts', markers: ['CLOSEFLOW_VISUAL_SOURCE_TRUTH'] },
    { file: 'src/styles/closeflow-visual-source-truth.css', markers: ['cf-vst-color-primary'] },
    { file: 'src/styles/design-system/closeflow-tokens.css', markers: ['--cf-text-primary'] },
  ]);
  const allowed = new Set([
    'src/components/ui-system/semantic-visual-registry.ts',
    'src/lib/closeflow-visual-source-truth.ts',
    'src/styles/closeflow-visual-source-truth.css',
    'src/styles/design-system/closeflow-tokens.css',
    'src/components/ui-system/operator-metric-tone-contract.ts',
    'src/components/ui-system/metric-icon-tone-registry.ts',
  ]);
  checkAddedOwnership(
    diffAddedLines(),
    allowed,
    /\b(?:[A-Za-z_$][\w$]*)(?:COLOR|Color|color|TONE|Tone|tone|BADGE|Badge|badge|SEVERITY|Severity|severity|STATUS|Status|status)(?:_?MAP|_?REGISTRY|_?COLORS|_?TONES)\b\s*=/,
    'nowa lokalna mapa semantycznych kolorów/tonów poza canonical ownerem',
  );
  if (fixturePath) fail('negative fixture wykryty poprawnie: LOCAL_TONE_MAP');
  else console.log('LF-UI-SOT-007_SSOT_COLORS_CHECK_OK');
}

function runTypography() {
  assertCanonicalFiles([
    { file: 'src/lib/closeflow-visual-source-truth.ts', markers: ['CloseFlowTypographyRole', 'CLOSEFLOW_VISUAL_FOUNDATION_TOKENS'] },
    { file: 'src/styles/closeflow-visual-source-truth.css', markers: ['cf-vst-text-page-title', 'cf-vst-text-label', 'cf-vst-text-metric', 'cf-vst-text-button'] },
  ]);
  const allowed = new Set([
    'src/lib/closeflow-visual-source-truth.ts',
    'src/styles/closeflow-visual-source-truth.css',
  ]);
  checkAddedOwnership(
    diffAddedLines(),
    allowed,
    /\b(?:[A-Za-z_$][\w$]*)(?:TYPOGRAPHY|Typography|typography|TYPE|Type|type|FONT|Font|font)(?:_?MAP|_?ROLES|_?CONFIG|_?SCALE)\b\s*=/,
    'nowa lokalna definicja roli typograficznej poza canonical ownerem',
  );
  if (fixturePath) fail('negative fixture wykryty poprawnie: LOCAL_TYPOGRAPHY_MAP');
  else console.log('LF-UI-SOT-007_TYPOGRAPHY_CHECK_OK');
}

function runCssOwners() {
  const app = read('src/App.tsx');
  const imports = [...app.matchAll(/^import\s+['"]([^'"]+\.css)['"];?$/gm)].map((match) => `src/${match[1].replace(/^\.\//, '')}`);
  const missing = imports.filter((file) => !fs.existsSync(path.join(root, file)));
  if (missing.length) fail(`aktywne importy CSS bez pliku: ${missing.join(', ')}`);
  if (fixturePath) {
    if (!/UNKNOWN_CSS_OWNER/.test(fs.readFileSync(path.resolve(fixturePath), 'utf8'))) fail('fixture css musi zawierać UNKNOWN_CSS_OWNER');
    fail('negative fixture wykryty poprawnie: UNKNOWN_CSS_OWNER');
    return;
  }
  const legacyLayers = imports.filter((file) => /(?:stage\d+|hotfix|final|lock)/i.test(file));
  const ownerGuard = require('./check-lf-ui-sot-006-css-owner-guards-before-cleanup.cjs');
  const result = ownerGuard.runChecks();
  if (!result.ok) fail(result.failures.join(' | '));
  console.log('LF-UI-SOT-007_CSS_OWNERS_CHECK_OK');
  console.log(JSON.stringify({ activeCssFiles: imports.length, classifiedCssFiles: imports.length, activeLegacyLayers: legacyLayers.length }, null, 2));
}

function runComponentClones() {
  const allowed = new Set([
    'src/components/ui/button.tsx',
    'src/components/ui-system/ActionIcon.tsx',
    'src/components/ui-system/MetricTile.tsx',
    'src/components/ui-system/OperatorMetricTiles.tsx',
    'src/components/ui-system/StatusPill.tsx',
    'src/components/ui-system/SurfaceCard.tsx',
    'src/components/ui-system/PageShell.tsx',
    'src/components/ui-system/PageHero.tsx',
    'src/components/ui-system/FormFooter.tsx',
    'src/components/ui-system/ListRow.tsx',
    'src/components/ui-system/EmptyState.tsx',
  ]);
  checkAddedOwnership(
    diffAddedLines(),
    allowed,
    /\b(?:function|const)\s+[A-Za-z_$][\w$]*(?:Button|Card|Tile|Badge|Modal|Dialog|Form|Footer)\b/,
    'nowy page-local clone canonicalnego UI',
  );
  if (fixturePath) fail('negative fixture wykryty poprawnie: page-local canonical clone');
  else console.log('LF-UI-SOT-007_COMPONENT_CLONES_CHECK_OK');
}

if (mode === 'icons' || mode === 'all') runIcons();
if (mode === 'colors' || mode === 'all') runColors();
if (mode === 'typography' || mode === 'all') runTypography();
if (mode === 'css-owners' || mode === 'all') runCssOwners();
if (mode === 'component-clones' || mode === 'all') runComponentClones();
if (!['icons', 'colors', 'typography', 'css-owners', 'component-clones', 'all'].includes(mode)) fail(`nieznany tryb: ${mode}`);

if (process.exitCode) process.exit(process.exitCode);
