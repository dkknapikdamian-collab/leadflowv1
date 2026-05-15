const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mainPath = path.join(root, 'src', 'main.tsx');

function fail(message) {
  console.error('REACT_STRICTMODE_RUNTIME_IMPORT_STAGE87_FAIL');
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(mainPath)) {
  fail('Missing src/main.tsx');
}

const main = fs.readFileSync(mainPath, 'utf8').replace(/^\uFEFF/, '');
const usesReactStrictMode = main.includes('React.StrictMode');
const hasDefaultReactImport = /import\s+React\s+from\s+["']react["']\s*;/.test(main);
const hasNamespaceReactImport = /import\s+\*\s+as\s+React\s+from\s+["']react["']\s*;/.test(main);

if (usesReactStrictMode && !hasDefaultReactImport && !hasNamespaceReactImport) {
  fail('src/main.tsx uses React.StrictMode but does not import React as a runtime binding. This can cause a white screen with React is not defined.');
}

console.log('OK React StrictMode runtime import guard stage87');
