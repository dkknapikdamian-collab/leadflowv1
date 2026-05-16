#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = path.resolve(process.argv[2] || process.cwd());
function p(rel) { return path.join(repo, rel); }
function write(rel, content) {
  const file = p(rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.replace(/\r\n/g, '\n'), 'utf8');
  console.log('wrote ' + rel);
}
function read(rel) { return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), 'utf8') : ''; }

if (!fs.existsSync(p('package.json')) || !fs.existsSync(p('src/index.css'))) {
  throw new Error('Repo root not found: ' + repo);
}

const tokensCss = `/* CLOSEFLOW_DESIGN_SYSTEM_TOKENS_VS1
   Foundation only. Do not remove legacy visual-stage/hotfix CSS in this step.
   New tokens reference current app variables where possible to avoid visual jumps.
*/
:root {
  /* spacing */
  --cf-space-0: 0;
  --cf-space-1: 0.25rem;
  --cf-space-2: 0.5rem;
  --cf-space-3: 0.75rem;
  --cf-space-4: 1rem;
  --cf-space-5: 1.25rem;
  --cf-space-6: 1.5rem;
  --cf-space-8: 2rem;
  --cf-space-10: 2.5rem;
  --cf-space-12: 3rem;
  --cf-space-16: 4rem;

  /* radius */
  --cf-radius-xs: 0.375rem;
  --cf-radius-sm: 0.5rem;
  --cf-radius-md: 0.75rem;
  --cf-radius-lg: 1rem;
  --cf-radius-xl: 1.25rem;
  --cf-radius-2xl: 1.5rem;
  --cf-radius-full: 999px;

  /* shadows */
  --cf-shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.06);
  --cf-shadow-sm: 0 8px 20px rgba(15, 23, 42, 0.07);
  --cf-shadow-md: 0 16px 36px rgba(15, 23, 42, 0.09);
  --cf-shadow-lg: 0 24px 60px rgba(15, 23, 42, 0.12);
  --cf-shadow-focus: 0 0 0 3px color-mix(in srgb, var(--color-primary, #2563eb) 22%, transparent);

  /* text */
  --cf-text-primary: var(--app-text, #0f172a);
  --cf-text-secondary: var(--app-muted, #475569);
  --cf-text-muted: var(--app-muted-soft, #94a3b8);
  --cf-text-inverse: #ffffff;
  --cf-text-link: var(--color-primary, #2563eb);
  --cf-text-danger: #be123c;

  /* surfaces */
  --cf-surface-canvas: var(--app-bg, #f8fafc);
  --cf-surface-page: var(--app-surface, #f8fafc);
  --cf-surface-card: var(--app-surface-strong, #ffffff);
  --cf-surface-muted: var(--app-surface-muted, #f1f5f9);
  --cf-surface-elevated: #ffffff;
  --cf-surface-hover: #f8fafc;
  --cf-surface-selected: color-mix(in srgb, var(--color-primary, #2563eb) 10%, #ffffff);

  /* borders */
  --cf-border-subtle: var(--app-border, #e2e8f0);
  --cf-border-strong: #cbd5e1;
  --cf-border-focus: var(--color-primary, #2563eb);
  --cf-border-danger: #fecdd3;

  /* metrics */
  --cf-metric-bg: var(--cf-surface-card);
  --cf-metric-bg-active: var(--cf-surface-selected);
  --cf-metric-border: var(--cf-border-subtle);
  --cf-metric-text: var(--cf-text-primary);
  --cf-metric-muted: var(--cf-text-secondary);
  --cf-metric-radius: var(--cf-radius-2xl);
  --cf-metric-shadow: var(--cf-shadow-sm);

  /* icons */
  --cf-icon-size-xs: 0.875rem;
  --cf-icon-size-sm: 1rem;
  --cf-icon-size-md: 1.25rem;
  --cf-icon-size-lg: 1.5rem;
  --cf-icon-color: var(--cf-text-secondary);
  --cf-icon-bg: var(--cf-surface-muted);
  --cf-icon-radius: var(--cf-radius-lg);

  /* forms */
  --cf-form-bg: var(--cf-surface-card);
  --cf-form-text: var(--cf-text-primary);
  --cf-form-placeholder: var(--cf-text-muted);
  --cf-form-border: var(--cf-border-strong);
  --cf-form-border-focus: var(--cf-border-focus);
  --cf-form-radius: var(--cf-radius-md);
  --cf-form-height: 2.5rem;
  --cf-form-shadow-focus: var(--cf-shadow-focus);

  /* modals */
  --cf-modal-bg: var(--cf-surface-card);
  --cf-modal-text: var(--cf-text-primary);
  --cf-modal-muted: var(--cf-text-secondary);
  --cf-modal-border: var(--cf-border-subtle);
  --cf-modal-radius: var(--cf-radius-2xl);
  --cf-modal-shadow: var(--cf-shadow-lg);
  --cf-modal-backdrop: rgba(15, 23, 42, 0.48);

  /* lists */
  --cf-list-bg: var(--cf-surface-card);
  --cf-list-row-bg: var(--cf-surface-card);
  --cf-list-row-bg-hover: var(--cf-surface-hover);
  --cf-list-row-border: var(--cf-border-subtle);
  --cf-list-row-radius: var(--cf-radius-xl);
  --cf-list-row-text: var(--cf-text-primary);
  --cf-list-row-muted: var(--cf-text-secondary);

  /* status */
  --cf-status-info-bg: #eff6ff;
  --cf-status-info-text: #1d4ed8;
  --cf-status-info-border: #bfdbfe;
  --cf-status-success-bg: #ecfdf5;
  --cf-status-success-text: #047857;
  --cf-status-success-border: #a7f3d0;
  --cf-status-warning-bg: #fffbeb;
  --cf-status-warning-text: #b45309;
  --cf-status-warning-border: #fde68a;
  --cf-status-danger-bg: #fff1f2;
  --cf-status-danger-text: #be123c;
  --cf-status-danger-border: #fecdd3;
  --cf-status-neutral-bg: #f1f5f9;
  --cf-status-neutral-text: #475569;
  --cf-status-neutral-border: #cbd5e1;

  /* finance */
  --cf-finance-income-bg: #ecfdf5;
  --cf-finance-income-text: #047857;
  --cf-finance-income-border: #a7f3d0;
  --cf-finance-pending-bg: #fffbeb;
  --cf-finance-pending-text: #92400e;
  --cf-finance-pending-border: #fde68a;
  --cf-finance-overdue-bg: #fff1f2;
  --cf-finance-overdue-text: #be123c;
  --cf-finance-overdue-border: #fecdd3;
  --cf-finance-neutral-bg: #f8fafc;
  --cf-finance-neutral-text: #334155;
  --cf-finance-neutral-border: #cbd5e1;

  /* legacy bridge aliases: old contracts can opt in without screen rewrites */
  --cf-legacy-app-bg: var(--cf-surface-canvas);
  --cf-legacy-app-surface: var(--cf-surface-page);
  --cf-legacy-app-surface-strong: var(--cf-surface-card);
  --cf-legacy-app-border: var(--cf-border-subtle);
  --cf-legacy-action-neutral-text: var(--cf-text-secondary);
  --cf-legacy-action-danger-text: var(--cf-status-danger-text);
  --cf-legacy-metric-surface: var(--cf-metric-bg);
}

[data-skin="forteca-dark"],
[data-skin="midnight"] {
  --cf-surface-elevated: var(--app-surface-strong, #111827);
  --cf-surface-hover: color-mix(in srgb, var(--app-surface-muted, #334155) 72%, transparent);
  --cf-surface-selected: color-mix(in srgb, var(--color-primary, #60a5fa) 22%, var(--app-surface-strong, #111827));
  --cf-shadow-xs: 0 1px 2px rgba(2, 6, 23, 0.28);
  --cf-shadow-sm: 0 8px 24px rgba(2, 6, 23, 0.32);
  --cf-shadow-md: 0 16px 40px rgba(2, 6, 23, 0.38);
  --cf-shadow-lg: 0 28px 70px rgba(2, 6, 23, 0.48);
}
`;

const layoutCss = `/* CLOSEFLOW_DESIGN_SYSTEM_LAYOUT_VS1
   Layout primitives for future migration. Not wired into pages yet.
*/
.cf-page-shell {
  width: min(100%, 1440px);
  margin-inline: auto;
  padding: var(--cf-space-6);
}

.cf-page-stack {
  display: grid;
  gap: var(--cf-space-6);
}

.cf-page-grid {
  display: grid;
  gap: var(--cf-space-4);
}

.cf-page-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.cf-page-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.cf-page-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.cf-page-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--cf-space-4);
  border: 1px solid var(--cf-border-subtle);
  border-radius: var(--cf-radius-2xl);
  background: var(--cf-surface-card);
  color: var(--cf-text-primary);
  box-shadow: var(--cf-shadow-sm);
  padding: var(--cf-space-5);
}

.cf-page-hero-title {
  margin: 0;
  color: var(--cf-text-primary);
  font-size: 1.875rem;
  line-height: 1.15;
  font-weight: 800;
}

.cf-page-hero-kicker,
.cf-page-hero-description {
  color: var(--cf-text-secondary);
}

@media (max-width: 900px) {
  .cf-page-shell {
    padding: var(--cf-space-4);
  }

  .cf-page-grid-2,
  .cf-page-grid-3,
  .cf-page-grid-4 {
    grid-template-columns: 1fr;
  }

  .cf-page-hero {
    flex-direction: column;
  }
}
`;

const componentsCss = `/* CLOSEFLOW_DESIGN_SYSTEM_COMPONENTS_VS1
   Component contracts for future migration. Existing screens are not rewired in VS-1.
*/
.cf-surface-card {
  border: 1px solid var(--cf-border-subtle);
  border-radius: var(--cf-radius-2xl);
  background: var(--cf-surface-card);
  color: var(--cf-text-primary);
  box-shadow: var(--cf-shadow-sm);
}

.cf-metric-card {
  border: 1px solid var(--cf-metric-border);
  border-radius: var(--cf-metric-radius);
  background: var(--cf-metric-bg);
  color: var(--cf-metric-text);
  box-shadow: var(--cf-metric-shadow);
  padding: var(--cf-space-4);
}

.cf-metric-card[data-active="true"],
.cf-metric-card.is-active {
  background: var(--cf-metric-bg-active);
  border-color: var(--cf-border-focus);
}

.cf-icon-badge {
  display: inline-flex;
  width: calc(var(--cf-icon-size-lg) + var(--cf-space-3));
  height: calc(var(--cf-icon-size-lg) + var(--cf-space-3));
  align-items: center;
  justify-content: center;
  border-radius: var(--cf-icon-radius);
  background: var(--cf-icon-bg);
  color: var(--cf-icon-color);
}

.cf-form-control {
  min-height: var(--cf-form-height);
  border: 1px solid var(--cf-form-border);
  border-radius: var(--cf-form-radius);
  background: var(--cf-form-bg);
  color: var(--cf-form-text);
}

.cf-form-control:focus,
.cf-form-control:focus-visible {
  border-color: var(--cf-form-border-focus);
  box-shadow: var(--cf-form-shadow-focus);
  outline: none;
}

.cf-modal-surface {
  border: 1px solid var(--cf-modal-border);
  border-radius: var(--cf-modal-radius);
  background: var(--cf-modal-bg);
  color: var(--cf-modal-text);
  box-shadow: var(--cf-modal-shadow);
}

.cf-list-card {
  border: 1px solid var(--cf-border-subtle);
  border-radius: var(--cf-radius-2xl);
  background: var(--cf-list-bg);
}

.cf-list-row {
  border: 1px solid var(--cf-list-row-border);
  border-radius: var(--cf-list-row-radius);
  background: var(--cf-list-row-bg);
  color: var(--cf-list-row-text);
}

.cf-list-row:hover {
  background: var(--cf-list-row-bg-hover);
}

.cf-status-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--cf-space-1);
  border-radius: var(--cf-radius-full);
  border: 1px solid var(--cf-status-neutral-border);
  background: var(--cf-status-neutral-bg);
  color: var(--cf-status-neutral-text);
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.cf-status-pill[data-tone="info"] {
  border-color: var(--cf-status-info-border);
  background: var(--cf-status-info-bg);
  color: var(--cf-status-info-text);
}

.cf-status-pill[data-tone="success"] {
  border-color: var(--cf-status-success-border);
  background: var(--cf-status-success-bg);
  color: var(--cf-status-success-text);
}

.cf-status-pill[data-tone="warning"] {
  border-color: var(--cf-status-warning-border);
  background: var(--cf-status-warning-bg);
  color: var(--cf-status-warning-text);
}

.cf-status-pill[data-tone="danger"] {
  border-color: var(--cf-status-danger-border);
  background: var(--cf-status-danger-bg);
  color: var(--cf-status-danger-text);
}
`;

const utilitiesCss = `/* CLOSEFLOW_DESIGN_SYSTEM_UTILITIES_VS1 */
.cf-text-primary { color: var(--cf-text-primary); }
.cf-text-secondary { color: var(--cf-text-secondary); }
.cf-text-muted { color: var(--cf-text-muted); }
.cf-surface-page { background: var(--cf-surface-page); }
.cf-surface-muted { background: var(--cf-surface-muted); }
.cf-border-subtle { border-color: var(--cf-border-subtle); }
.cf-shadow-sm { box-shadow: var(--cf-shadow-sm); }
.cf-shadow-md { box-shadow: var(--cf-shadow-md); }
.cf-radius-xl { border-radius: var(--cf-radius-xl); }
.cf-radius-2xl { border-radius: var(--cf-radius-2xl); }
.cf-gap-2 { gap: var(--cf-space-2); }
.cf-gap-3 { gap: var(--cf-space-3); }
.cf-gap-4 { gap: var(--cf-space-4); }
.cf-gap-6 { gap: var(--cf-space-6); }
`;

const indexCss = `/* CLOSEFLOW_DESIGN_SYSTEM_INDEX_VS1 */
@import './closeflow-tokens.css';
@import './closeflow-layout.css';
@import './closeflow-components.css';
@import './closeflow-utilities.css';
`;

const docMd = `# CloseFlow Design System Tokens \u2014 VS-1

**Data:** 2026-05-09
**Status:** fundament tokenow, bez migracji ekranow
**Import:** \`src/styles/design-system/index.css\` w \`src/index.css\`

## Cel

VS-1 tworzy jedno miejsce na tokeny UI. To nie jest redesign i nie przepina jeszcze ekranow.

## Dodane pliki

- \`src/styles/design-system/closeflow-tokens.css\`
- \`src/styles/design-system/closeflow-layout.css\`
- \`src/styles/design-system/closeflow-components.css\`
- \`src/styles/design-system/closeflow-utilities.css\`
- \`src/styles/design-system/index.css\`
- \`scripts/check-closeflow-design-system-tokens.cjs\`

## Tokeny minimum

- \`--cf-space-*\`
- \`--cf-radius-*\`
- \`--cf-shadow-*\`
- \`--cf-text-*\`
- \`--cf-surface-*\`
- \`--cf-border-*\`
- \`--cf-metric-*\`
- \`--cf-icon-*\`
- \`--cf-form-*\`
- \`--cf-modal-*\`
- \`--cf-list-*\`
- \`--cf-status-*\`
- \`--cf-finance-*\`

## Zasada kompatybilnosci

Nowe tokeny odczytuja obecne zmienne \`--app-*\` tam, gdzie to mozliwe. Dzieki temu stare kontrakty moga stopniowo korzystac z nowych tokenow bez wizualnego big-banga.

## Czego VS-1 nie robi

- Nie przepina ekranow.
- Nie usuwa \`visual-stage*\`, \`hotfix-*\`, \`eliteflow-*\` ani \`stage*.css\`.
- Nie zmienia routingu.
- Nie robi migracji layoutu.

## Kryterium zakonczenia

- \`npm run check:closeflow-design-system-tokens\` przechodzi.
- \`npm run build\` przechodzi.
- \`src/index.css\` importuje \`src/styles/design-system/index.css\`.
- Kazda grupa tokenow minimum istnieje w \`closeflow-tokens.css\`.
`;

const checkScript = `#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) {
  const file = path.join(repo, rel);
  if (!fs.existsSync(file)) fail('Missing file: ' + rel);
  return fs.readFileSync(file, 'utf8');
}
function fail(message) {
  console.error('CLOSEFLOW_DESIGN_SYSTEM_TOKENS_VS1_FAIL: ' + message);
  process.exit(1);
}
function assert(condition, message) {
  if (!condition) fail(message);
}

const files = [
  'src/styles/design-system/closeflow-tokens.css',
  'src/styles/design-system/closeflow-layout.css',
  'src/styles/design-system/closeflow-components.css',
  'src/styles/design-system/closeflow-utilities.css',
  'src/styles/design-system/index.css',
  'docs/ui/CLOSEFLOW_DESIGN_SYSTEM_TOKENS_2026-05-09.md',
];
for (const file of files) assert(fs.existsSync(path.join(repo, file)), 'Missing file: ' + file);

const rootIndex = read('src/index.css');
assert(rootIndex.includes("@import './styles/design-system/index.css';") || rootIndex.includes('@import "./styles/design-system/index.css";'), 'src/index.css does not import design-system/index.css');

const dsIndex = read('src/styles/design-system/index.css');
for (const importName of ['closeflow-tokens.css', 'closeflow-layout.css', 'closeflow-components.css', 'closeflow-utilities.css']) {
  assert(dsIndex.includes(importName), 'design-system/index.css missing import: ' + importName);
}

const tokens = read('src/styles/design-system/closeflow-tokens.css');
for (const prefix of [
  '--cf-space-',
  '--cf-radius-',
  '--cf-shadow-',
  '--cf-text-',
  '--cf-surface-',
  '--cf-border-',
  '--cf-metric-',
  '--cf-icon-',
  '--cf-form-',
  '--cf-modal-',
  '--cf-list-',
  '--cf-status-',
  '--cf-finance-',
]) {
  assert(tokens.includes(prefix), 'Missing token prefix: ' + prefix);
}

for (const bridge of ['--cf-legacy-app-bg', '--cf-legacy-action-neutral-text', '--cf-legacy-metric-surface']) {
  assert(tokens.includes(bridge), 'Missing legacy bridge alias: ' + bridge);
}

const components = read('src/styles/design-system/closeflow-components.css');
for (const className of ['.cf-surface-card', '.cf-metric-card', '.cf-form-control', '.cf-modal-surface', '.cf-list-row', '.cf-status-pill']) {
  assert(components.includes(className), 'Missing component contract: ' + className);
}

const layout = read('src/styles/design-system/closeflow-layout.css');
for (const className of ['.cf-page-shell', '.cf-page-grid', '.cf-page-hero']) {
  assert(layout.includes(className), 'Missing layout contract: ' + className);
}

const utilities = read('src/styles/design-system/closeflow-utilities.css');
for (const className of ['.cf-text-primary', '.cf-surface-page', '.cf-border-subtle']) {
  assert(utilities.includes(className), 'Missing utility contract: ' + className);
}

const doc = read('docs/ui/CLOSEFLOW_DESIGN_SYSTEM_TOKENS_2026-05-09.md');
for (const phrase of ['Tokeny minimum', 'Nie przepina ekranow', 'Nie usuwa', 'npm run check:closeflow-design-system-tokens']) {
  assert(doc.includes(phrase), 'Doc missing phrase: ' + phrase);
}

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:closeflow-design-system-tokens'] === 'node scripts/check-closeflow-design-system-tokens.cjs', 'package.json missing check:closeflow-design-system-tokens');

console.log('CLOSEFLOW_DESIGN_SYSTEM_TOKENS_VS1_CHECK_OK');
console.log('token_groups=13');
console.log('design_system_files=' + files.length);
`;

write('src/styles/design-system/closeflow-tokens.css', tokensCss);
write('src/styles/design-system/closeflow-layout.css', layoutCss);
write('src/styles/design-system/closeflow-components.css', componentsCss);
write('src/styles/design-system/closeflow-utilities.css', utilitiesCss);
write('src/styles/design-system/index.css', indexCss);
write('docs/ui/CLOSEFLOW_DESIGN_SYSTEM_TOKENS_2026-05-09.md', docMd);
write('scripts/check-closeflow-design-system-tokens.cjs', checkScript);

const importLine = "@import './styles/design-system/index.css';";
let rootIndex = read('src/index.css');
if (!rootIndex.includes("./styles/design-system/index.css")) {
  rootIndex = importLine + '\n' + rootIndex;
  write('src/index.css', rootIndex);
  console.log('patched src/index.css import');
} else {
  console.log('SKIP: src/index.css already imports design system index');
}

const pkgPath = p('package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-design-system-tokens'] = 'node scripts/check-closeflow-design-system-tokens.cjs';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('patched package.json');

console.log('CLOSEFLOW_DESIGN_SYSTEM_TOKENS_VS1_PATCH_OK');
