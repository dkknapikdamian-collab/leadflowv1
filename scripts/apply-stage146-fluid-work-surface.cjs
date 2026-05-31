/* CLOSEFLOW_STAGE146_FLUID_WORK_SURFACE_PATCHER */
const fs = require('fs');
const path = require('path');
const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage146-fluid-work-surface.cjs <repo>');
const appPath = path.join(repo, 'src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');
const importLine = "import './styles/closeflow-fluid-work-surface-stage146.css';";
if (!app.includes(importLine)) {
  const lines = app.split(/\r?\n/);
  let lastStyleImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import ['"]\.\/styles\//.test(lines[i])) lastStyleImport = i;
  }
  if (lastStyleImport < 0) throw new Error('App.tsx: no ./styles imports found');
  lines.splice(lastStyleImport + 1, 0, importLine);
  app = lines.join('\n');
  fs.writeFileSync(appPath, app, 'utf8');
  console.log('UPDATED src/App.tsx: inserted Stage146 CSS import after last ./styles import');
} else {
  console.log('SKIPPED src/App.tsx: Stage146 CSS import already present');
}
console.log('DONE Stage146 fluid work surface patcher.');
