#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_VS5T';
const outJson = path.join(root, 'docs/ui/closeflow-metric-tiles-deep-source-map.generated.json');
const outMd = path.join(root, 'docs/ui/CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_2026-05-09.md');

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function safeRead(rel) { return exists(rel) ? read(rel) : ''; }
function walk(dir, exts, acc = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, exts, acc);
    else if (exts.some((ext) => rel.endsWith(ext))) acc.push(rel);
  }
  return acc;
}
function count(text, re) { return [...text.matchAll(re)].length; }
function includesAny(text, arr) { return arr.some((item) => text.includes(item)); }
function lineOf(text, needle) {
  const index = text.indexOf(needle);
  if (index < 0) return null;
  return text.slice(0, index).split(/\r?\n/).length;
}
function extractImports(cssRel, seen = new Set(), stack = []) {
  if (!exists(cssRel) || seen.has(cssRel)) return [];
  seen.add(cssRel);
  const text = read(cssRel);
  const base = path.dirname(cssRel);
  const imports = [...text.matchAll(/@import\s+['"]([^'"]+)['"]/g)].map((match) => {
    const target = path.normalize(path.join(base, match[1])).replace(/\\/g, '/');
    return target.endsWith('.css') ? target : target + '.css';
  });
  const rows = [{ rel: cssRel, stack, imports }];
  for (const imported of imports) rows.push(...extractImports(imported, seen, [...stack, cssRel]));
  return rows;
}

const componentFiles = walk('src', ['.tsx', '.ts']).filter((rel) => !rel.endsWith('.d.ts'));
const cssFiles = walk('src', ['.css']);
const scriptFiles = walk('scripts', ['.cjs', '.mjs', '.js']);

const metricComponentSignals = [
  'StatShortcutCard',
  'MetricTile',
  'MetricGrid',
  'data-stat-shortcut-card',
  'data-cf-metric-tile-contract',
  'data-cf-metric-grid-contract',
  'cf-top-metric-tile',
  'notifications-stats-grid',
  'data-eliteflow-task-stat-grid',
  'function MetricCard',
  '<MetricCard',
  'grid-4',
  'grid-5',
  'stats-grid',
  'stat-grid',
  'metric-grid',
];

const cssSignals = [
  'cf-top-metric-tile',
  'data-stat-shortcut-card',
  'data-cf-metric-tile-contract',
  'eliteflow-metric',
  'notifications-stat-card',
  'notifications-stats-grid',
  'data-p0-tasks-stable-rebuild',
  'data-eliteflow-task-stat-grid',
  'section.grid > button',
  '.grid-4',
  '.grid-5',
  '.stats-grid',
  '.stat-grid',
  '.metric-grid',
  '.stat-card',
  '.summary-card',
  '.dashboard-stat-card',
  '.metric',
];

const componentMap = componentFiles.map((rel) => {
  const text = read(rel);
  const signals = metricComponentSignals.filter((signal) => text.includes(signal));
  if (!signals.length) return null;
  return {
    rel,
    signals,
    counts: {
      statShortcutCard: count(text, /<StatShortcutCard\b/g),
      metricTile: count(text, /<MetricTile\b/g),
      metricGrid: count(text, /<MetricGrid\b/g),
      localMetricCardFunction: count(text, /function\s+MetricCard\s*\(/g),
      localMetricCardUsage: count(text, /<MetricCard\b/g),
      dataStatShortcutCard: count(text, /data-stat-shortcut-card/g),
    },
    imports: {
      statShortcutCard: text.includes("../components/StatShortcutCard") || text.includes('./StatShortcutCard') || text.includes('StatShortcutCard'),
      uiSystem: text.includes('../components/ui-system') || text.includes('./ui-system'),
    },
  };
}).filter(Boolean).sort((a, b) => a.rel.localeCompare(b.rel));

const cssMap = cssFiles.map((rel) => {
  const text = read(rel);
  const signals = cssSignals.filter((signal) => text.includes(signal));
  if (!signals.length) return null;
  return {
    rel,
    signals,
    lineHints: Object.fromEntries(signals.slice(0, 12).map((signal) => [signal, lineOf(text, signal)])),
    size: text.length,
  };
}).filter(Boolean).sort((a, b) => a.rel.localeCompare(b.rel));

const indexCss = safeRead('src/index.css');
const designIndexCss = safeRead('src/styles/design-system/index.css');
const importGraph = extractImports('src/index.css').map((entry, index) => ({ order: index + 1, rel: entry.rel, importedBy: entry.stack.at(-1) || null, imports: entry.imports }));
const importedCssSet = new Set(importGraph.map((entry) => entry.rel));
const metricCssImported = importedCssSet.has('src/styles/closeflow-metric-tiles.css') || indexCss.includes('closeflow-metric-tiles.css');

function pageInfo(rel) {
  const text = safeRead(rel);
  return {
    rel,
    exists: Boolean(text),
    importsStatShortcutCard: text.includes('../components/StatShortcutCard'),
    importsMetricGrid: text.includes('MetricGrid') && text.includes('../components/ui-system'),
    importsMetricTile: text.includes('MetricTile') && text.includes('../components/ui-system'),
    statShortcutCardCount: count(text, /<StatShortcutCard\b/g),
    metricGridCount: count(text, /<MetricGrid\b/g),
    metricTileCount: count(text, /<MetricTile\b/g),
    localMetricCardFunctionCount: count(text, /function\s+MetricCard\s*\(/g),
    localMetricCardUsageCount: count(text, /<MetricCard\b/g),
    hasLegacyGrid4Marker: text.includes('grid-4'),
    hasNotificationsStatsGrid: text.includes('notifications-stats-grid'),
    hasTasksGridMarker: text.includes('data-eliteflow-task-stat-grid'),
    hasTodayStableMarker: text.includes('data-p0-today-stable-rebuild') || text.includes('P0_TODAY_STABLE_REBUILD'),
  };
}

const pages = [
  pageInfo('src/pages/TodayStable.tsx'),
  pageInfo('src/pages/TasksStable.tsx'),
  pageInfo('src/pages/NotificationsCenter.tsx'),
  pageInfo('src/pages/Leads.tsx'),
  pageInfo('src/pages/Clients.tsx'),
  pageInfo('src/pages/Cases.tsx'),
  pageInfo('src/pages/Calendar.tsx'),
  pageInfo('src/pages/AiDrafts.tsx'),
  pageInfo('src/pages/Activity.tsx'),
];

const blockingFindings = [];
const today = pages.find((page) => page.rel === 'src/pages/TodayStable.tsx');
if (today && today.exists && today.statShortcutCardCount === 0 && today.metricTileCount === 0) {
  blockingFindings.push({
    id: 'today-not-on-metric-tile-source',
    severity: 'blocker',
    rel: today.rel,
    reason: 'Today is the visual reference, but it is not rendered through StatShortcutCard/MetricTile. Pixel parity cannot be guaranteed while the reference screen uses a separate local tile implementation.',
  });
}
if (!metricCssImported) {
  blockingFindings.push({ id: 'metric-css-not-imported', severity: 'blocker', rel: 'src/index.css', reason: 'Central closeflow-metric-tiles.css is not imported into the active CSS cascade.' });
}
const eliteHardLock = safeRead('src/styles/eliteflow-final-metric-tiles-hard-lock.css');
if (eliteHardLock.includes('section.grid > button') || eliteHardLock.includes('button > div')) {
  blockingFindings.push({ id: 'legacy-hard-lock-targets-raw-buttons', severity: 'high', rel: 'src/styles/eliteflow-final-metric-tiles-hard-lock.css', reason: 'Legacy hard-lock selectors still target generic section.grid > button / button > div and can override component-owned MetricTile markup.' });
}
const notificationsCss = safeRead('src/styles/visual-stage10-notifications-vnext.css');
if (notificationsCss.includes('.notifications-stat-card') || notificationsCss.includes('.notifications-stat-label') || notificationsCss.includes('.notifications-stat-icon')) {
  blockingFindings.push({ id: 'notifications-local-stat-css', severity: 'high', rel: 'src/styles/visual-stage10-notifications-vnext.css', reason: 'Notifications still has local stat tile CSS classes that compete with MetricTile.' });
}
for (const page of pages) {
  if (!page.exists) continue;
  if (page.localMetricCardFunctionCount || page.localMetricCardUsageCount) {
    blockingFindings.push({ id: 'local-metric-card-' + page.rel.replace(/[^a-z0-9]+/gi, '-').toLowerCase(), severity: 'high', rel: page.rel, reason: 'Page contains local MetricCard implementation/usage.' });
  }
}

const summary = {
  marker: STAGE,
  generatedAt: new Date().toISOString(),
  totals: {
    scannedComponentFiles: componentFiles.length,
    scannedCssFiles: cssFiles.length,
    componentFilesWithMetricSignals: componentMap.length,
    cssFilesWithMetricSignals: cssMap.length,
    blockingFindings: blockingFindings.length,
  },
  conclusion: blockingFindings.some((f) => f.id === 'today-not-on-metric-tile-source')
    ? 'NOT_PIXEL_LOCKED: Today is still not on the same MetricTile source as Tasks/Notifications.'
    : 'READY_FOR_PIXEL_LOCK: active reference and target screens use the same metric tile source.',
  thesis: 'Do not add another CSS patch. First make Today, Tasks and Notifications use the same MetricGrid -> StatShortcutCard -> MetricTile chain, then delete or quarantine legacy selectors that target generic grid/buttons.',
  pages,
  blockingFindings,
  cssImport: {
    metricCssImported,
    indexCssHasMetricImport: indexCss.includes('closeflow-metric-tiles.css'),
    designSystemImportsMetricCss: designIndexCss.includes('closeflow-metric-tiles.css'),
    importGraph,
  },
  componentMap,
  cssMap,
};

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(summary, null, 2) + '\n', 'utf8');

const md = [];
md.push('# CloseFlow metric tiles deep source map — VS5T');
md.push('');
md.push('Marker: \`' + STAGE + '\`');
md.push('');
md.push('## Verdict');
md.push('');
md.push('- Conclusion: \`' + summary.conclusion + '\`');
md.push('- Metric CSS imported: \`' + metricCssImported + '\`');
md.push('- Blocking/high findings: \`' + blockingFindings.length + '\`');
md.push('');
md.push('## Main thesis');
md.push('');
md.push(summary.thesis);
md.push('');
md.push('## Blocking findings');
md.push('');
if (!blockingFindings.length) md.push('No blocking findings detected.');
for (const finding of blockingFindings) {
  md.push('- \`' + finding.severity + '\` \`' + finding.id + '\` in \`' + finding.rel + '\`: ' + finding.reason);
}
md.push('');
md.push('## Active page metric source map');
md.push('');
md.push('| page | StatShortcutCard | MetricGrid | MetricTile | local MetricCard | legacy grid markers |');
md.push('|---|---:|---:|---:|---:|---|');
for (const page of pages) {
  md.push('| \`' + page.rel + '\` | ' + page.statShortcutCardCount + ' | ' + page.metricGridCount + ' | ' + page.metricTileCount + ' | ' + (page.localMetricCardFunctionCount + page.localMetricCardUsageCount) + ' | ' + [page.hasLegacyGrid4Marker ? 'grid-4' : '', page.hasNotificationsStatsGrid ? 'notifications-stats-grid' : '', page.hasTasksGridMarker ? 'tasks-grid' : ''].filter(Boolean).join(', ') + ' |');
}
md.push('');
md.push('## CSS files influencing metric tiles');
md.push('');
for (const css of cssMap) {
  md.push('- \`' + css.rel + '\` — signals: ' + css.signals.map((s) => '\`' + s + '\`').join(', '));
}
md.push('');
md.push('## Next implementation direction');
md.push('');
md.push('1. Treat \`MetricTile\` as the only renderer of metric tile markup.');
md.push('2. Migrate \`TodayStable.tsx\` top decision tiles to \`MetricGrid -> StatShortcutCard -> MetricTile\`, because Today is the visual reference but currently uses a separate local implementation.');
md.push('3. Remove or neutralize old generic selectors in \`eliteflow-final-metric-tiles-hard-lock.css\` that target \`section.grid > button\` and \`button > div\`.');
md.push('4. Keep \`/tasks\` and \`/notifications\` on \`MetricGrid\`, not local \`section.grid\` / \`notifications-stats-grid\` ownership.');
md.push('5. Only after the same source chain is active, tune exact font size, label casing, value/icon gap and width in \`MetricTile\` once.');
md.push('');
md.push('## Generated JSON');
md.push('');
md.push('See \`docs/ui/closeflow-metric-tiles-deep-source-map.generated.json\`.');

fs.writeFileSync(outMd, md.join('\n') + '\n', 'utf8');

console.log('CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_VS5T_AUDIT_OK');
console.log('component_files_with_metric_signals=' + componentMap.length);
console.log('css_files_with_metric_signals=' + cssMap.length);
console.log('blocking_findings=' + blockingFindings.length);
console.log('conclusion=' + summary.conclusion);
