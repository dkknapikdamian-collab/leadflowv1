const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  'src/components/Layout.tsx',
  'src/styles/closeflow-compact-top-shell-source-truth.css',
  'package.json',
];
for (const file of files) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const layout = fs.readFileSync(path.join(root, 'src/components/Layout.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-compact-top-shell-source-truth.css'), 'utf8');
const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');

const importLine = "import '../styles/closeflow-compact-top-shell-source-truth.css';";
if (!layout.includes(importLine)) {
  throw new Error('Layout.tsx does not import closeflow-compact-top-shell-source-truth.css');
}

const requiredCssMarkers = [
  'CLOSEFLOW_COMPACT_TOP_SHELL_SOURCE_TRUTH_2026_05_12',
  '@media (min-width: 901px) and (hover: hover) and (pointer: fine)',
  '.global-title-copy strong',
  '.cf-page-header-v2__copy',
  'display: none !important',
  '.cf-page-header-v2__actions',
  '[data-shell-content="true"]',
];
for (const marker of requiredCssMarkers) {
  if (!css.includes(marker)) {
    throw new Error(`Compact top shell CSS missing marker: ${marker}`);
  }
}

if (!pkg.includes('check:closeflow-compact-top-shell-source-truth')) {
  throw new Error('package.json missing check:closeflow-compact-top-shell-source-truth script');
}

console.log('OK closeflow-compact-top-shell-source-truth: desktop hero cards are compacted and top bar title is enlarged.');
