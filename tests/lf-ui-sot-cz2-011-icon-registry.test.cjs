const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = process.cwd();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

test('CZ2-011 icon registry exports required API and active icons', () => {
  const registry = read('src/lib/source-of-truth/icon-registry.ts');

  assert.match(registry, /export type IconName/);
  assert.match(registry, /export const APP_ICONS/);
  assert.match(registry, /export function getIcon/);
  assert.match(registry, /export function getIconLabel/);

  for (const iconName of ['add', 'alert', 'calendar', 'check', 'chevronRight', 'clock', 'fileText', 'loading', 'search', 'trash']) {
    assert.match(registry, new RegExp(`${iconName}:`));
  }
});

test('CZ2-011 AppIcon wrapper resolves from registry', () => {
  const icon = read('src/components/ui/icon.tsx');

  assert.match(icon, /getIcon/);
  assert.match(icon, /getIconLabel/);
  assert.match(icon, /data-cf-app-icon/);
  assert.match(icon, /decorative = true/);
});

test('CZ2-011 IconButton wrapper requires accessible label', () => {
  const iconButton = read('src/components/ui/icon-button.tsx');

  assert.match(iconButton, /label:\s*string/);
  assert.match(iconButton, /aria-label=\{label\}/);
  assert.match(iconButton, /title=\{title \|\| label\}/);
  assert.match(iconButton, /<AppIcon/);
});

test('CZ2-011 scoped migration uses registry wrapper', () => {
  const confirmDialog = read('src/components/confirm-dialog.tsx');

  assert.doesNotMatch(confirmDialog, /lucide-react/);
  assert.match(confirmDialog, /<AppIcon name="loading"/);
});

test('CZ2-011 source has no mojibake markers', () => {
  const files = [
    'src/lib/source-of-truth/icon-registry.ts',
    'src/components/ui/icon.tsx',
    'src/components/ui/icon-button.tsx',
    'src/components/confirm-dialog.tsx',
    'scripts/guards/verify-lf-ui-sot-cz2-011-icon-registry.cjs',
  ];

  for (const file of files) {
    const content = read(file);
    assert.equal(/[ÅÄĂ]|â€|�/.test(content), false, `${file} contains mojibake marker`);
  }
});
