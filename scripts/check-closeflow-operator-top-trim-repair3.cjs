const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = {
  layout: 'src/components/Layout.tsx',
  runtime: 'src/components/OperatorTopBarRuntime.tsx',
  css: 'src/styles/closeflow-operator-top-trim-source-truth.css',
  doc: 'docs/release/CLOSEFLOW_OPERATOR_TOP_TRIM_REPAIR3_2026-05-12.md',
};

for (const [name, file] of Object.entries(files)) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing ${name}: ${file}`);
}

const layout = fs.readFileSync(path.join(root, files.layout), 'utf8');
const runtime = fs.readFileSync(path.join(root, files.runtime), 'utf8');
const css = fs.readFileSync(path.join(root, files.css), 'utf8');

for (const marker of [
  "import OperatorTopBarRuntime from './OperatorTopBarRuntime';",
  "import '../styles/closeflow-operator-top-trim-source-truth.css';",
  '<OperatorTopBarRuntime />',
]) {
  if (!layout.includes(marker)) throw new Error(`Layout missing marker: ${marker}`);
}

for (const marker of [
  'CLOSEFLOW_OPERATOR_TOP_TRIM_RUNTIME_REPAIR3_2026_05_12',
  'cf-global-promoted-page-actions',
  'cf-global-promoted-view-action',
  'findOriginalViewAction',
  'originalViewAction.click()',
  'MutationObserver',
]) {
  if (!runtime.includes(marker)) throw new Error(`Runtime missing marker: ${marker}`);
}

for (const marker of [
  'CLOSEFLOW_OPERATOR_TOP_TRIM_SOURCE_TRUTH_REPAIR3_2026_05_12',
  '--cf-operator-bg',
  '.cf-page-header-v2',
  'display: none !important',
  '.cf-global-promoted-page-actions',
  '[data-cf-global-view-proxy="true"]',
  'background-image: none',
]) {
  if (!css.includes(marker)) throw new Error(`CSS missing marker: ${marker}`);
}

console.log('OK closeflow-operator-top-trim-repair3: old page header is removed and Widok is promoted to global bar.');
