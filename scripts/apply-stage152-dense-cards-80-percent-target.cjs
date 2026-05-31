/* CLOSEFLOW_STAGE152_DENSE_CARDS_80_PERCENT_TARGET_PATCHER */
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage152-dense-cards-80-percent-target.cjs <repo>');

const appPath = path.join(repo, 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

const importLine = "import './styles/closeflow-dense-cards-80-percent-target-stage152.css';";
if (!app.includes(importLine)) {
  const lines = app.split(/\r?\n/);
  let insertAfter = -1;

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes("import './styles/closeflow-compact-cards-source-truth-stage151.css';")) {
      insertAfter = i;
    }
  }
  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].includes("import './styles/closeflow-panel-typography-and-width-source-truth-stage150.css';")) {
        insertAfter = i;
      }
    }
  }
  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].includes("import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';")) {
        insertAfter = i;
      }
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
  console.log('UPDATED src/App.tsx: added Stage152 dense cards CSS import after previous visual source truth imports');
} else {
  console.log('SKIPPED src/App.tsx: Stage152 import already present');
}

console.log('DONE Stage152 dense cards 80 percent target patcher.');
