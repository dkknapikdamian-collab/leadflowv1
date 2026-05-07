const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const failures = [];

function mustContain(rel, marker, label = marker) {
  const content = read(rel);
  if (!content.includes(marker)) failures.push(`${rel} missing: ${label}`);
}

function mustMatch(rel, regex, label) {
  const content = read(rel);
  if (!regex.test(content)) failures.push(`${rel} missing: ${label}`);
}

function mustOrder(rel, first, second, label) {
  const content = read(rel);
  const a = content.indexOf(first);
  const b = content.indexOf(second);
  if (a < 0 || b < 0 || a >= b) failures.push(`${rel} wrong order: ${label}`);
}

mustContain('src/components/StatShortcutCard.tsx', 'STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE', 'Stage16AL marker');
mustContain('src/components/StatShortcutCard.tsx', 'cf-top-metric-tile-value-row', 'value row wrapper');
mustContain('src/components/StatShortcutCard.tsx', 'data-metric-icon-next-to-value="true"', 'icon next to value data marker');
mustMatch('src/components/StatShortcutCard.tsx', /cf-top-metric-tile-value-row[\s\S]*cf-top-metric-tile-value[\s\S]*cf-top-metric-tile-icon/, 'icon inside value row after value');
mustOrder('src/components/StatShortcutCard.tsx', 'cf-top-metric-tile-value-row', 'cf-top-metric-tile-helper', 'value row before helper');
mustContain('src/styles/closeflow-metric-tiles.css', 'STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE_CSS', 'Stage16AL CSS marker');
mustContain('src/styles/closeflow-metric-tiles.css', '.cf-top-metric-tile-value-row', 'value row CSS');
mustContain('src/styles/closeflow-metric-tiles.css', ':not(:has(.metric-icon)):not(:has(svg))::after', 'fallback icon for older metric cards');
mustContain('src/styles/closeflow-metric-tiles.css', 'background-image: url("data:image/svg+xml', 'fallback icon svg');
mustContain('package.json', 'check:metric-tile-icons-next-to-value', 'package check script');
mustContain('package.json', 'test:metric-tile-icons-next-to-value', 'package test script');

if (failures.length) {
  console.error('Metric tile icon/value guard failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: metric tile icons next to value guard passed.');
