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
expect('src/components/Layout.tsx', "../styles/closeflow-compact-top-shell-source-truth.css", 'current compact shell CSS import');
expect('src/components/Layout.tsx', "../styles/closeflow-operator-top-trim-source-truth.css", 'current operator shell trim CSS import');
expect('src/components/Layout.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Stage211C canvas import');
expect('src/components/Layout.tsx', 'VisualFoundationRuntimeStage212M', 'current Stage212M visual foundation runtime');
expect('src/components/Layout.tsx', 'cf-html-shell', 'current HTML shell class compatibility');
expect('src/pages/Cases.tsx', "../styles/closeflow-page-header-v2.css", 'current Cases page header CSS import');
expect('src/pages/Cases.tsx', "../styles/closeflow-record-list-source-truth.css", 'current Cases record-list CSS import');
expect('src/pages/Cases.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Cases Stage211C canvas import');
expect('src/pages/Cases.tsx', "../styles/closeflow-canvas-source-truth-stage211e.css", 'current Cases Stage211E canvas source import');
expect('src/pages/Cases.tsx', 'CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CASES', 'current Cases rebuild marker');
expect('src/styles/visual-html-theme-v14.css', 'VISUAL_HTML_THEME_V14_CSS', 'V14 reference CSS marker');
expect('src/styles/visual-html-theme-v14.css', '.app.cf-html-shell', 'historical HTML shell selector');
expect('src/styles/visual-html-theme-v14.css', '[data-visual-stage-cases="07-cases"]', 'historical Cases route selector');
expect('src/components/Layout.tsx', 'VISUAL_HTML_THEME_V14_LAYOUT', 'retained V14 historical trace marker');
expect('package.json', 'check:visual-html-theme-v14', 'V14 package guard script');
console.log('OK: Visual HTML theme V14 guard reconciled with current shell and Cases source truth.');
