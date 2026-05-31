/* CLOSEFLOW_STAGE160_MODAL_CENTER_AND_COMPACT_ALL_PATCHER */
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage160-modal-center-and-compact-all.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

const rel = 'src/App.tsx';
let app = read(rel);

const importLine = "import './styles/closeflow-modal-center-and-compact-all-stage160.css';";
if (!app.includes(importLine)) {
  const lines = app.split(/\r?\n/);
  let insertAfter = -1;

  const preferred = [
    "import './styles/closeflow-overlay-real-density-and-footer-stage159.css';",
    "import './styles/closeflow-overlay-portal-density-stage158.css';",
    "import './styles/closeflow-viewport-zoom-80-source-truth-stage157.css';",
    "import './styles/closeflow-real-density-tokens-no-zoom-stage156.css';",
    "import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';",
  ];

  for (const marker of preferred) {
    if (insertAfter >= 0) break;
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].includes(marker)) {
        insertAfter = i;
        break;
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
  console.log('UPDATED src/App.tsx: added Stage160 modal center and compact CSS import');
} else {
  console.log('SKIPPED src/App.tsx: Stage160 import already present');
}

write(rel, app);
console.log('DONE Stage160 modal center and compact all patcher.');
