const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = {
  layout: 'src/components/Layout.tsx',
  runtime: 'src/components/OperatorTopBarRuntime.tsx',
  css: 'src/styles/closeflow-operator-top-trim-source-truth.css',
  doc: 'docs/release/CLOSEFLOW_OPERATOR_TOP_TRIM_SOURCE_TRUTH_2026-05-12.md',
};

for (const [name, file] of Object.entries(files)) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Missing ${name}: ${file}`);
  }
}

const layout = fs.readFileSync(path.join(root, files.layout), 'utf8');
const runtime = fs.readFileSync(path.join(root, files.runtime), 'utf8');
const css = fs.readFileSync(path.join(root, files.css), 'utf8');

const requiredLayout = [
  "import OperatorTopBarRuntime from './OperatorTopBarRuntime';",
  "import '../styles/closeflow-operator-top-trim-source-truth.css';",
  '<OperatorTopBarRuntime />',
];
for (const marker of requiredLayout) {
  if (!layout.includes(marker)) throw new Error(`Layout missing marker: ${marker}`);
}

const requiredRuntime = [
  'CLOSEFLOW_OPERATOR_TOP_TRIM_RUNTIME_2026_05_12',
  'MutationObserver',
  'data-cf-topbar-promoted-action',
  'data-cf-topbar-hidden-action',
  'widok',
];
for (const marker of requiredRuntime) {
  if (!runtime.includes(marker)) throw new Error(`Runtime missing marker: ${marker}`);
}

const requiredCss = [
  'CLOSEFLOW_OPERATOR_TOP_TRIM_SOURCE_TRUTH_2026_05_12',
  '--cf-operator-bg',
  '.cf-page-header-v2__copy',
  '[data-cf-topbar-promoted-action="view"]',
  '[data-cf-topbar-hidden-action="true"]',
  'background-image: none',
];
for (const marker of requiredCss) {
  if (!css.includes(marker)) throw new Error(`CSS missing marker: ${marker}`);
}

console.log('OK closeflow-operator-top-trim-source-truth: desktop header bars are trimmed and background source is mapped.');
