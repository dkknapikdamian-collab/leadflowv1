const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = process.cwd();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const MOJIBAKE_PATTERN = new RegExp(['\\u00c5', '\\u00c4', '\\u0102', '\\u00e2\\u20ac', '\\uFFFD'].join('|'));

test('CZ2-012 card variant files exist', () => {
  for (const file of [
    'src/components/ui/metric-card.tsx',
    'src/components/ui/list-card.tsx',
    'src/components/ui/empty-state-card.tsx',
    'src/components/ui/detail-panel.tsx',
  ]) {
    assert.equal(exists(file), true, `${file} must exist`);
  }
});

test('CZ2-012 MetricCard exports stable API and uses icon registry', () => {
  const source = read('src/components/ui/metric-card.tsx');
  assert.match(source, /export type MetricCardProps/);
  assert.match(source, /label:\s*string/);
  assert.match(source, /value:\s*string \| number/);
  assert.match(source, /iconName:\s*IconName/);
  assert.match(source, /tone\?:/);
  assert.match(source, /meta\?:\s*ReactNode/);
  assert.match(source, /<AppIcon/);
  assert.match(source, /from '\.\/card'/);
  assert.doesNotMatch(source, /lucide-react/);
});

test('CZ2-012 ListCard exports stable API and uses Card primitive', () => {
  const source = read('src/components/ui/list-card.tsx');
  assert.match(source, /export type ListCardProps/);
  assert.match(source, /title:\s*ReactNode/);
  assert.match(source, /subtitle\?:\s*ReactNode/);
  assert.match(source, /badges\?:/);
  assert.match(source, /actions\?:/);
  assert.match(source, /href\?:\s*string/);
  assert.match(source, /from '\.\/card'/);
});

test('CZ2-012 EmptyStateCard exports stable API and uses icon registry', () => {
  const source = read('src/components/ui/empty-state-card.tsx');
  assert.match(source, /export type EmptyStateCardProps/);
  assert.match(source, /iconName:\s*IconName/);
  assert.match(source, /title:\s*ReactNode/);
  assert.match(source, /description\?:\s*ReactNode/);
  assert.match(source, /cta\?:\s*ReactNode/);
  assert.match(source, /<AppIcon/);
  assert.match(source, /from '\.\/card'/);
  assert.doesNotMatch(source, /lucide-react/);
});

test('CZ2-012 DetailPanel exports stable API and uses Card primitive', () => {
  const source = read('src/components/ui/detail-panel.tsx');
  assert.match(source, /export type DetailPanelProps/);
  assert.match(source, /title:\s*ReactNode/);
  assert.match(source, /description\?:\s*ReactNode/);
  assert.match(source, /actions\?:\s*ReactNode/);
  assert.match(source, /children\?:\s*ReactNode/);
  assert.match(source, /from '\.\/card'/);
});

test('CZ2-012 scoped migration routes StatShortcutCard through MetricCard', () => {
  const source = read('src/components/StatShortcutCard.tsx');
  assert.match(source, /import \{ MetricCard \} from '\.\/ui\/metric-card'/);
  assert.match(source, /<MetricCard/);
  assert.match(source, /resolveMetricIconName/);
});

test('CZ2-012 keeps Today-specific Card logic intact', () => {
  const source = read('src/components/ui/card.tsx');
  for (const marker of [
    'TODAY_VIEW_STORAGE_KEY_STAGE232T_R1A',
    'TODAY_SECTION_KEYS_STAGE232T_R1A',
    'readTodayViewSetStage232TR1A',
    'getTodayCardSectionKeyStage232TR1A',
    'applyTodayCardSectionVisibilityStage232TR1A',
  ]) {
    assert.match(source, new RegExp(marker));
  }
});

test('CZ2-012 source has no mojibake markers', () => {
  for (const file of [
    'src/components/ui/metric-card.tsx',
    'src/components/ui/list-card.tsx',
    'src/components/ui/empty-state-card.tsx',
    'src/components/ui/detail-panel.tsx',
    'src/components/StatShortcutCard.tsx',
    'scripts/guards/verify-lf-ui-sot-cz2-012-card-tile-panel-variants.cjs',
  ]) {
    assert.equal(MOJIBAKE_PATTERN.test(read(file)), false, `${file} contains mojibake marker`);
  }
});
