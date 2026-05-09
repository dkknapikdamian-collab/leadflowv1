/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_CHECK */
/* CLOSEFLOW_VS7_REPAIR4_FINAL_OPERATOR_METRIC_GUARD */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (msg) => { console.error('FAIL:', msg); process.exitCode = 1; };
const mustContain = (file, marker, label = marker) => {
  const content = read(file);
  if (!content.includes(marker)) fail(file + ' missing: ' + label);
};
const mustNotContain = (file, marker, label = marker) => {
  const content = read(file);
  if (content.includes(marker)) fail(file + ' should not contain: ' + label);
};
const mustNotExist = (file) => {
  if (fs.existsSync(path.join(root, file))) fail(file + ' should not remain from failed stage');
};
const mustImportOneOf = (marker, files, label) => {
  const ok = files.some((file) => exists(file) && read(file).includes(marker));
  if (!ok) fail('missing global import marker: ' + label);
};

mustContain('src/components/StatShortcutCard.tsx', 'StatShortcutCard delegates rendering to ui-system OperatorMetricTile', 'StatShortcutCard adapter contract');
mustContain('src/components/StatShortcutCard.tsx', 'OperatorMetricTile', 'final shared tile renderer');
mustContain('src/components/StatShortcutCard.tsx', 'resolveMetricTone', 'tone resolver adapter');
mustNotContain('src/components/StatShortcutCard.tsx', 'function MetricCard', 'legacy local MetricCard renderer');

mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3', 'final renderer stage marker');
mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-operator-metric-tile', 'tile data marker');
mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-operator-metric-tone', 'tile tone marker');
mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-operator-metric-value-tone', 'value tone marker');
mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-metric-source-truth', 'source truth marker');

mustContain('src/styles/closeflow-operator-metric-tiles.css', 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3', 'operator metric css marker');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '--cf-operator-metric-radius', 'operator css radius token');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '.cf-operator-metric-tile-content', 'operator tile content selector');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '[data-cf-operator-metric-tone="blue"]', 'blue tone selector');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '[data-cf-operator-metric-tone="red"]', 'red tone selector');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '.cf-operator-metric-value', 'value selector');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '.cf-operator-metric-icon', 'icon selector');

mustContain('src/styles/closeflow-metric-tiles.css', 'STAGE16AK_UNIFIED_TOP_METRIC_TILES_CSS', 'legacy css stage marker kept for compatibility');
mustContain('src/styles/closeflow-metric-tiles.css', '--cf-metric-tile-radius', 'legacy css shared token kept for compatibility');
mustImportOneOf('closeflow-metric-tiles.css', ['src/App.tsx', 'src/index.css'], 'legacy metric css import');
mustImportOneOf('closeflow-operator-metric-tiles.css', ['src/App.tsx', 'src/index.css'], 'operator metric css import');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:unified-top-metric-tiles'] !== 'node scripts/check-unified-top-metric-tiles.cjs') fail('package.json missing check:unified-top-metric-tiles script');
if (pkg.scripts?.['test:unified-top-metric-tiles'] !== 'node --test tests/unified-top-metric-tiles.test.cjs') fail('package.json missing test:unified-top-metric-tiles script');

mustNotExist('scripts/repair-stage16aj-unified-top-metric-tiles.cjs');
mustNotExist('docs/release/STAGE16AJ_UNIFIED_TOP_METRIC_TILES_2026-05-07.md');

if (!process.exitCode) console.log('OK: unified top metric tile final OperatorMetricTile contract passed.');

/* CLOSEFLOW_VS7_REPAIR5_REGEX_ESCAPE_UNIFIED_METRIC_TEST: data selector regex literals escaped after VS7 repair4. */
