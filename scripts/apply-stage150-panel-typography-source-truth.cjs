/* CLOSEFLOW_STAGE150_PANEL_TYPOGRAPHY_SOURCE_TRUTH_PATCHER */
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage150-panel-typography-source-truth.cjs <repo>');

const appPath = path.join(repo, 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

const importLine = "import './styles/closeflow-panel-typography-and-width-source-truth-stage150.css';";
if (!app.includes(importLine)) {
  const lines = app.split(/\r?\n/);
  let insertAfter = -1;

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes("import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';")) {
      insertAfter = i;
    }
  }

  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i += 1) {
      if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfter = i;
    }
  }

  if (insertAfter < 0) throw new Error('App.tsx: no ./styles imports found');
  lines.splice(insertAfter + 1, 0, importLine);
  app = lines.join('\n');
  fs.writeFileSync(appPath, app, 'utf8');
  console.log('UPDATED src/App.tsx: added Stage150 typography source truth CSS import');
} else {
  console.log('SKIPPED src/App.tsx: Stage150 import already present');
}

console.log('DONE Stage150 panel typography source truth patcher.');
