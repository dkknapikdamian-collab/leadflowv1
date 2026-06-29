const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-011';
const errors = [];
const warnings = [];
const MOJIBAKE_PATTERN = new RegExp(['\\u00c5', '\\u00c4', '\\u0102', '\\u00e2\\u20ac', '\\uFFFD'].join('|'));

function read(rel) {
  const absolute = path.join(ROOT, rel);
  if (!fs.existsSync(absolute)) {
    errors.push(`Missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(absolute, 'utf8');
}

function requireIncludes(file, text, message = `${file} must include ${text}`) {
  const content = read(file);
  if (!content.includes(text)) errors.push(message);
}

function assertNoMojibake(file) {
  const content = read(file);
  if (MOJIBAKE_PATTERN.test(content)) errors.push(`Mojibake marker found in ${file}`);
}

const files = [
  'src/lib/source-of-truth/icon-registry.ts',
  'src/components/ui/icon.tsx',
  'src/components/ui/icon-button.tsx',
  'src/components/confirm-dialog.tsx',
  'package.json',
  'scripts/guards/verify-lf-ui-sot-cz2-011-icon-registry.cjs',
  'tests/lf-ui-sot-cz2-011-icon-registry.test.cjs',
];

for (const file of files) read(file);

requireIncludes('src/lib/source-of-truth/icon-registry.ts', 'export type IconName', 'icon-registry must export IconName');
requireIncludes('src/lib/source-of-truth/icon-registry.ts', 'export const APP_ICONS', 'icon-registry must export APP_ICONS');
requireIncludes('src/lib/source-of-truth/icon-registry.ts', 'export function getIcon', 'icon-registry must export getIcon');
requireIncludes('src/lib/source-of-truth/icon-registry.ts', 'export function getIconLabel', 'icon-registry must export getIconLabel');

for (const iconName of ['add', 'alert', 'calendar', 'check', 'chevronRight', 'clock', 'fileText', 'loading', 'search', 'trash']) {
  requireIncludes('src/lib/source-of-truth/icon-registry.ts', `${iconName}:`, `APP_ICONS must include ${iconName}`);
}

requireIncludes('src/components/ui/icon.tsx', 'getIcon', 'AppIcon must resolve icons from registry');
requireIncludes('src/components/ui/icon.tsx', 'getIconLabel', 'AppIcon must resolve fallback labels from registry');
requireIncludes('src/components/ui/icon.tsx', 'data-cf-app-icon', 'AppIcon must expose stable data attr');

const iconButton = read('src/components/ui/icon-button.tsx');
if (!/label:\s*string/.test(iconButton)) errors.push('IconButton must require label: string');
if (!iconButton.includes('aria-label={label}')) errors.push('IconButton must pass label to aria-label');
if (!iconButton.includes('data-cf-icon-button')) errors.push('IconButton must expose data-cf-icon-button');
if (!iconButton.includes('<AppIcon')) errors.push('IconButton must render AppIcon');

const confirmDialog = read('src/components/confirm-dialog.tsx');
if (confirmDialog.includes('lucide-react')) errors.push('Scoped migration file confirm-dialog must not import lucide-react directly');
if (!confirmDialog.includes('<AppIcon name="loading"')) errors.push('ConfirmDialog pending icon must come from AppIcon registry wrapper');

const packageJson = read('package.json');
if (!packageJson.includes('verify:lf-ui-sot-cz2-011-icon-registry')) {
  warnings.push('package.json script verify:lf-ui-sot-cz2-011-icon-registry is not registered yet; add it before closing the stage.');
}

let changedFiles = [];
try {
  changedFiles = execSync('git diff --name-only HEAD~6..HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
} catch (error) {
  warnings.push('Could not inspect recent changed files with git diff HEAD~6..HEAD.');
}

for (const file of changedFiles) {
  if (/\.(css|sql)$/i.test(file)) errors.push(`CZ2-011 must not touch CSS/SQL: ${file}`);
  if (/supabase|data-provider|card-variants|tile|form|layout/i.test(file) && !files.includes(file)) {
    errors.push(`CZ2-011 must not touch data-provider/card/tile/form/layout scope: ${file}`);
  }
}

for (const file of files) assertNoMojibake(file);

const result = {
  ok: errors.length === 0,
  stage: STAGE,
  decision: 'ICON_REGISTRY_SOURCE_OF_TRUTH / SCOPED_NO_MASS_MIGRATION',
  canonical: 'src/lib/source-of-truth/icon-registry.ts',
  checked: files,
  changedFiles,
  warnings,
  errors,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length) process.exit(1);
