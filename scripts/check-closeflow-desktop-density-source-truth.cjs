const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/closeflow-desktop-density-source-truth.css');
const layoutPath = path.join(root, 'src/components/Layout.tsx');
const packagePath = path.join(root, 'package.json');

for (const file of [cssPath, layoutPath, packagePath]) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${path.relative(root, file)}`);
}

const css = fs.readFileSync(cssPath, 'utf8');
const layout = fs.readFileSync(layoutPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const markers = [
  'CLOSEFLOW_DESKTOP_DENSITY_SOURCE_TRUTH_2026_05_12',
  '@media (min-width: 1280px) and (pointer: fine)',
  'font-size: 14px',
  '--cf-desktop-density-page-max',
  '.cf-html-shell .view.active',
  '.main-leads-html, .main-clients-html',
  '@media (max-width: 1279px)',
];

for (const marker of markers) {
  if (!css.includes(marker)) throw new Error(`Desktop density CSS missing marker: ${marker}`);
}

const importLine = "import '../styles/closeflow-desktop-density-source-truth.css';";
if (!layout.includes(importLine)) {
  throw new Error('Layout.tsx does not import closeflow-desktop-density-source-truth.css');
}

if (!pkg.scripts || pkg.scripts['check:closeflow-desktop-density-source-truth'] !== 'node scripts/check-closeflow-desktop-density-source-truth.cjs') {
  throw new Error('package.json missing check:closeflow-desktop-density-source-truth script');
}

console.log('OK closeflow-desktop-density-source-truth: desktop density contract is wired and mobile is left untouched.');
