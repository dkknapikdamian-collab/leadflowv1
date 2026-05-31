const fs = require('fs');
const path = require('path');
const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage166-modal-footer-in-flow-no-overlay.cjs <repo>');
const appPath = path.join(repo, 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');
const importLine = "import './styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css';";
if (!app.includes(importLine)) {
  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    "closeflow-modal-unified-event-motif-source-truth-stage165.css",
    "closeflow-cf-modal-top-anchor-light-surface-stage164.css",
    "closeflow-cf-modal-main-center-tall-compact-stage163.css"
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
  fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
  console.log('UPDATED src/App.tsx: added Stage166 footer no-overlay CSS import');
} else {
  console.log('SKIPPED src/App.tsx: Stage166 import already present');
}
