const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage164-cf-modal-top-anchor-light-surface.cjs <repo>');

const appPath = path.join(repo, 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

const importLine = "import './styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css';";
if (!app.includes(importLine)) {
  const lines = app.split(/\r?\n/);
  let insertAfter = -1;

  for (const marker of [
    "closeflow-cf-modal-main-center-tall-compact-stage163.css",
    "closeflow-cf-modal-surface-lower-smaller-stage162.css",
    "closeflow-cf-modal-surface-center-fix-stage161.css",
    "closeflow-modal-center-and-compact-all-stage160.css",
    "closeflow-viewport-zoom-80-source-truth-stage157.css"
  ]) {
    if (insertAfter >= 0) break;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(marker)) { insertAfter = i; break; }
    }
  }

  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i++) {
      if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfter = i;
    }
  }

  if (insertAfter < 0) throw new Error('App.tsx: no ./styles imports found');

  lines.splice(insertAfter + 1, 0, importLine);
  app = lines.join('\n');
  fs.writeFileSync(appPath, app, 'utf8');
  console.log('UPDATED src/App.tsx: added Stage164 CSS import');
} else {
  console.log('SKIPPED src/App.tsx: Stage164 import already present');
}
