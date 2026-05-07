const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (msg) => {
  console.error('[eliteflow-metric-tiles] FAIL:', msg);
  process.exitCode = 1;
};
const ok = (msg) => console.log('[eliteflow-metric-tiles] OK:', msg);

const componentPath = 'src/components/StatShortcutCard.tsx';
const cssPath = 'src/styles/closeflow-metric-tiles.css';

if (!fs.existsSync(path.join(root, componentPath))) fail(`${componentPath} missing`);
if (!fs.existsSync(path.join(root, cssPath))) fail(`${cssPath} missing`);

if (!process.exitCode) {
  const component = read(componentPath);
  const css = read(cssPath);

  [
    'ELITEFLOW_TODAY_METRIC_TILE_LOCK',
    'data-eliteflow-today-metric-lock',
    'cf-top-metric-tile-label',
    'cf-top-metric-tile-value-row',
    'data-unified-top-metric-tile',
    'data-metric-icon-next-to-value',
  ].forEach((needle) => {
    if (!component.includes(needle)) fail(`component missing marker ${needle}`);
  });

  [
    '--cf-metric-tile-radius: 22px',
    '--cf-metric-tile-min-height: 72px',
    'grid-template-columns: repeat(4, minmax(0, 1fr))',
    '.main-leads-html',
    '.main-clients-html',
    '.main-cases-html',
    '.main-templates-html',
    '.main-response-templates-html',
    '.main-ai-drafts-html',
    '.main-activity-html',
    'data-p0-tasks-stable-rebuild',
    'cf-top-metric-tile-content',
    'cf-top-metric-tile-icon',
  ].forEach((needle) => {
    if (!css.includes(needle)) fail(`css missing lock ${needle}`);
  });

  const app = read('src/App.tsx');
  if (!app.includes("./styles/closeflow-metric-tiles.css")) {
    fail('App.tsx does not import closeflow-metric-tiles.css');
  }

  const pageExpectations = [
    ['src/pages/Leads.tsx', 'StatShortcutCard'],
    ['src/pages/Clients.tsx', 'StatShortcutCard'],
    ['src/pages/Cases.tsx', 'StatShortcutCard'],
    ['src/pages/Templates.tsx', 'StatShortcutCard'],
  ];

  for (const [file, marker] of pageExpectations) {
    if (!fs.existsSync(path.join(root, file))) {
      fail(`${file} missing`);
      continue;
    }
    const content = read(file);
    if (!content.includes(marker)) fail(`${file} does not use ${marker}`);
  }
}

if (!process.exitCode) ok('metric tile lock covers shared component, global CSS, task stable top grid and routed metric screens');
