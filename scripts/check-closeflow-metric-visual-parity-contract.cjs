const fs = require('fs');
const path = require('path');

const root = process.cwd();
const metricRel = 'src/styles/closeflow-metric-tiles.css';
const pageRel = 'src/styles/closeflow-page-header.css';
const tasksRel = 'src/pages/TasksStable.tsx';
const statRel = 'src/components/StatShortcutCard.tsx';
const guardRel = 'scripts/check-closeflow-metric-visual-parity-contract.cjs';
const docRel = 'docs/ui/CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A_2026-05-08.md';
const pkgRel = 'package.json';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) {
    console.error('[closeflow-metric-visual-parity-contract] FAIL: ' + message);
    process.exit(1);
  }
}

function noControl(rel, text) {
  assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text), rel + ' contains control chars');
}

function noMojibake(rel, text) {
  const sequences = [
    [0x0139],
    [0x00c4, 0x2026],
    [0x00c4, 0x2021],
    [0x00c5, 0x201a],
    [0xfffd],
  ].map((chars) => String.fromCharCode(...chars));
  const hit = sequences.find((item) => text.includes(item));
  assert(!hit, rel + ' contains mojibake marker');
}

function assertBalancedCss(rel, text) {
  let depth = 0;
  for (const char of text) {
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    assert(depth >= 0, rel + ' has closing brace without opening brace');
  }
  assert(depth === 0, rel + ' has unbalanced CSS braces');
  assert(!/,\s*}\s*(?:\n|$)/.test(text), rel + ' contains a dangling selector before closing brace');
  assert(!/,\s*\.cf-top-metric-tile-content,\s*\n\s*main\[data-p0-tasks-stable-rebuild/.test(text), rel + ' contains broken mobile selector chain');
}

function assertBlockContains(text, selector, requiredTokens) {
  const start = text.indexOf(selector);
  assert(start >= 0, 'Missing selector block: ' + selector);
  const open = text.indexOf('{', start);
  assert(open >= 0, 'Missing opening brace for selector: ' + selector);
  let depth = 0;
  for (let index = open; index < text.length; index += 1) {
    if (text[index] === '{') depth += 1;
    if (text[index] === '}') depth -= 1;
    if (depth === 0) {
      const block = text.slice(open, index + 1);
      for (const token of requiredTokens) assert(block.includes(token), selector + ' missing token: ' + token);
      return;
    }
  }
  assert(false, 'Unclosed selector block: ' + selector);
}

for (const rel of [metricRel, pageRel, tasksRel, statRel, guardRel, docRel, pkgRel]) {
  assert(exists(rel), 'Missing required file: ' + rel);
}

const metric = read(metricRel);
const page = read(pageRel);
const tasks = read(tasksRel);
const stat = read(statRel);
const doc = read(docRel);
const pkg = JSON.parse(read(pkgRel));

assert(stat.includes('data-eliteflow-metric-tone'), 'StatShortcutCard must expose data-eliteflow-metric-tone');
assert(stat.includes('cf-top-metric-tile'), 'StatShortcutCard must remain the top metric tile source');
assert(stat.includes('data-metric-icon-next-to-value'), 'StatShortcutCard must keep value and icon in one row');
assert(metric.includes('STAGE16A_METRIC_VISUAL_PARITY_REPAIR'), 'metric CSS missing Stage16A marker');
assert(metric.includes('CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A'), 'metric CSS missing Stage16A contract marker');
assert(!metric.includes('overflow-wrap: anywhere'), 'metric labels must not use overflow-wrap:anywhere');
assert(metric.includes('white-space: nowrap'), 'metric labels must avoid breaking short labels');
assert(metric.includes('text-overflow: ellipsis'), 'metric labels need safe overflow handling');
assertBalancedCss(metricRel, metric);
assertBalancedCss(pageRel, page);

for (const token of [
  '--cf-metric-tile-min-height',
  '--cf-metric-tile-radius',
  '--cf-metric-tile-padding-y',
  '--cf-metric-tile-padding-x',
  '--cf-metric-tile-label-size',
  '--cf-metric-tile-value-size',
  '--cf-metric-tile-icon-size',
  '--cf-metric-tile-icon-svg-size',
]) {
  assert(metric.includes(token), 'metric CSS missing token ' + token);
}

assertBlockContains(metric, '.cf-top-metric-tile-label', [
  'white-space: nowrap !important',
  'overflow-wrap: normal !important',
  'word-break: keep-all !important',
  'hyphens: none !important',
  'text-overflow: ellipsis !important',
]);

assertBlockContains(metric, '.cf-top-metric-tile-content', [
  'min-height: var(--cf-metric-tile-min-height) !important',
  'border-radius: var(--cf-metric-tile-radius) !important',
  'box-shadow: var(--cf-metric-tile-shadow) !important',
]);

assert(metric.includes('button:not([data-stat-shortcut-card]):not(.cf-top-metric-tile)'), 'TasksStable fallback must not override real StatShortcutCard buttons');
assert(!metric.includes('> section.grid > button:not([data-stat-shortcut-card]):not(.cf-top-metric-tile) p:first-of-type'), 'Old TasksStable label fallback must not restyle StatShortcutCard metrics');
assert(!metric.includes('> section.grid > button:not([data-stat-shortcut-card]):not(.cf-top-metric-tile) p:last-of-type'), 'Old TasksStable value fallback must not restyle StatShortcutCard metrics');
assert(tasks.includes('<StatShortcutCard'), 'TasksStable top metrics must use StatShortcutCard');
assert(tasks.includes('data-eliteflow-task-stat-grid="true"'), 'TasksStable stat grid marker missing');
assert(tasks.includes('data-stage16a-metric-visual-parity="true"'), 'TasksStable metric visual parity marker missing');
assert(tasks.includes('cf-page-hero'), 'TasksStable page hero/header must use cf-page-hero');
assert(tasks.includes('cf-page-hero-title'), 'TasksStable header title must join page hero title contract');
assert(tasks.includes('cf-page-hero-kicker'), 'TasksStable header badge must join page hero kicker contract');
assert(page.includes('.cf-page-hero'), 'page header CSS missing cf-page-hero');
assert(page.includes('CLOSEFLOW_PAGE_HERO_VISUAL_PARITY_STAGE16A'), 'page header CSS missing Stage16A marker');
for (const token of ['--cf-page-hero-bg', '--cf-page-hero-border', '--cf-page-hero-shadow', '--cf-page-hero-radius']) {
  assert(page.includes(token), 'page header CSS missing token ' + token);
}
assert(doc.includes('CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A'), 'Stage16A document missing marker');
assert(doc.includes('AKTYWNE'), 'Stage16A document must mention AKTYWNE no-break acceptance');
assert(pkg.scripts && pkg.scripts['check:closeflow-metric-visual-parity-contract'] === 'node scripts/check-closeflow-metric-visual-parity-contract.cjs', 'package.json missing Stage16A command');
const forbiddenParts = ['metric' + '-fix', 'task-tile' + '-repair', 'visual' + '-v2'];
const forbidden = new RegExp(forbiddenParts.join('|'), 'i');
for (const rel of [metricRel, pageRel, tasksRel, statRel, guardRel, docRel]) {
  const text = read(rel);
  assert(!forbidden.test(text), rel + ' contains forbidden local one-off class/name');
  noControl(rel, text);
  noMojibake(rel, text);
}
console.log('CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A_OK: metric tiles and page hero parity locked');
