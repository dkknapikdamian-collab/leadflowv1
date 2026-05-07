/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_CHECK */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (msg) => { console.error('FAIL:', msg); process.exitCode = 1; };
const mustContain = (file, marker, label = marker) => {
  const content = read(file);
  if (!content.includes(marker)) fail(`${file} missing: ${label}`);
};
const mustNotExist = (file) => {
  if (fs.existsSync(path.join(root, file))) fail(`${file} should not remain from failed stage`);
};

mustContain('src/components/StatShortcutCard.tsx', 'STAGE16AK_UNIFIED_TOP_METRIC_TILES', 'stage marker');
mustContain('src/components/StatShortcutCard.tsx', 'cf-top-metric-tile', 'unified tile class');
mustContain('src/components/StatShortcutCard.tsx', 'min-h-[92px]', 'Today-like tile height');
mustContain('src/components/StatShortcutCard.tsx', 'text-[28px]', 'Today-like value font');
mustContain('src/components/StatShortcutCard.tsx', 'h-4 w-4', 'Today-like icon size');
mustContain('src/components/StatShortcutCard.tsx', 'data-stat-shortcut-card', 'legacy card test marker');
mustContain('src/components/StatShortcutCard.tsx', 'data-unified-top-metric-tile="true"', 'new tile marker');

mustContain('src/styles/closeflow-metric-tiles.css', 'STAGE16AK_UNIFIED_TOP_METRIC_TILES_CSS', 'css stage marker');
mustContain('src/styles/closeflow-metric-tiles.css', '--cf-metric-tile-radius', 'shared css token');
mustContain('src/styles/closeflow-metric-tiles.css', '.cf-html-view .metric', 'legacy metric selector');
mustContain('src/styles/closeflow-metric-tiles.css', '.stat-card', 'stat card selector');
mustContain('src/styles/closeflow-metric-tiles.css', '.summary-card', 'summary card selector');
mustContain('src/styles/closeflow-metric-tiles.css', '.dashboard-stat-card', 'dashboard stat selector');
mustContain('src/styles/closeflow-metric-tiles.css', 'font-size: 28px', 'css value font');
mustContain('src/styles/closeflow-metric-tiles.css', 'border-radius: var(--cf-metric-tile-radius)', 'shared radius');

mustContain('src/App.tsx', "import './styles/closeflow-metric-tiles.css';", 'global css import');
const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:unified-top-metric-tiles'] !== 'node scripts/check-unified-top-metric-tiles.cjs') fail('package.json missing check:unified-top-metric-tiles script');
if (pkg.scripts?.['test:unified-top-metric-tiles'] !== 'node --test tests/unified-top-metric-tiles.test.cjs') fail('package.json missing test:unified-top-metric-tiles script');

mustNotExist('scripts/repair-stage16aj-unified-top-metric-tiles.cjs');
mustNotExist('docs/release/STAGE16AJ_UNIFIED_TOP_METRIC_TILES_2026-05-07.md');

if (!process.exitCode) console.log('OK: unified top metric tile contract passed.');
