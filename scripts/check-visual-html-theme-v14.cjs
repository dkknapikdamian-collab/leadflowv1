const fs = require('fs');
const path = require('path');
const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function expect(file, text, label) {
  const body = read(file);
  if (!body.includes(text)) throw new Error(`${file}: missing ${label || text}`);
  console.log(`OK: ${file} contains ${label || text}`);
}

function reject(file, text, label) {
  const body = read(file);
  if (body.includes(text)) throw new Error(`${file}: forbidden ${label || text}`);
  console.log(`OK: ${file} excludes ${label || text}`);
}

reject('src/index.css', 'visual-html-theme-v14.css', 'inactive V14 global theme import');
expect('src/components/Layout.tsx', 'OperatorTopBarRuntime', 'current operator shell runtime');
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual owner entrypoint');
expect('src/components/Layout.tsx', 'VisualFoundationRuntimeStage212M', 'current Stage212M visual foundation runtime');
expect('src/components/Layout.tsx', 'cf-html-shell', 'current HTML shell class compatibility');
expect('src/pages/Cases.tsx', "../styles/closeflow-page-header-runtime.css", 'current Cases page header adapter');
expect('src/pages/Cases.tsx', "../styles/closeflow-record-list-source-truth.css", 'current Cases record-list CSS import');
expect('src/styles/owners/closeflow-page-header-responsive.css', 'page-header', 'canonical page-header owner');
expect('src/styles/closeflow-record-list-source-truth.css', 'table-card', 'scoped record-list adapter');
expect('src/styles/owners/closeflow-page-adapters.css', 'cf-html-shell', 'canonical HTML shell adapter');
expect('package.json', 'check:visual-html-theme-v14', 'V14 package guard script');
console.log('OK: Visual HTML theme V14 guard reconciled with current shell and Cases source truth.');
