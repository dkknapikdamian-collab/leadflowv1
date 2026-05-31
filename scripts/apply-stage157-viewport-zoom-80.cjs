/* CLOSEFLOW_STAGE157_VIEWPORT_ZOOM_80_PATCHER */
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage157-viewport-zoom-80.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}
function removeFile(rel) {
  const full = path.join(repo, rel);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { force: true });
    console.log(`REMOVED rejected file: ${rel}`);
  }
}

{
  const rel = 'src/App.tsx';
  let app = read(rel);

  const rejectedImports = [
    "import './styles/closeflow-panel-zoom-density-stage153.css';",
    "import './styles/closeflow-revert-global-zoom-keep-card-density-stage154.css';",
    "import './styles/closeflow-main-panel-density-scale-stage155.css';",
  ];

  for (const line of rejectedImports) {
    if (app.includes(line)) {
      app = app.replace(line + '\n', '').replace(line + '\r\n', '').replace(line, '');
      console.log(`REMOVED ${rel}: ${line}`);
    }
  }

  const importLine = "import './styles/closeflow-viewport-zoom-80-source-truth-stage157.css';";
  if (!app.includes(importLine)) {
    const lines = app.split(/\r?\n/);
    let insertAfter = -1;

    // Put Stage157 after the latest accepted density file if it exists.
    const preferred = [
      "import './styles/closeflow-real-density-tokens-no-zoom-stage156.css';",
      "import './styles/closeflow-dense-cards-80-percent-target-stage152.css';",
      "import './styles/closeflow-compact-cards-source-truth-stage151.css';",
      "import './styles/closeflow-panel-typography-and-width-source-truth-stage150.css';",
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
    console.log('UPDATED src/App.tsx: added Stage157 viewport zoom source truth import');
  } else {
    console.log('SKIPPED src/App.tsx: Stage157 import already present');
  }

  write(rel, app);
}

// Remove rejected Stage155 frame if it survived locally.
{
  const rel = 'src/components/Layout.tsx';
  let layout = read(rel);
  const before = layout;

  layout = layout.replace(
    /(\s*)<div className="cf155-main-density-frame" data-cf155-main-density-frame="true">\s*\r?\n\s*\{children\}\s*\r?\n\s*<\/div>/m,
    '$1{children}'
  );
  layout = layout.replace(
    /<div className="cf155-main-density-frame" data-cf155-main-density-frame="true">\s*\{children\}\s*<\/div>/m,
    '{children}'
  );

  if (layout !== before) {
    write(rel, layout);
    console.log('UPDATED Layout.tsx: removed rejected Stage155 density frame');
  } else {
    console.log('SKIPPED Layout.tsx: no Stage155 frame found');
  }
}

[
  'src/styles/closeflow-panel-zoom-density-stage153.css',
  'scripts/apply-stage153-panel-zoom-density.cjs',
  'scripts/check-stage153-panel-zoom-density.cjs',
  'docs/ui/CLOSEFLOW_STAGE153_PANEL_ZOOM_DENSITY_SOURCE_TRUTH.md',
  'docs/ui/CLOSEFLOW_STAGE153_RUNTIME_PANEL_ZOOM_AUDIT.js',
  '_project/STAGE153_PANEL_ZOOM_DENSITY_SOURCE_TRUTH_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage153 panel zoom density source truth.md',

  'src/styles/closeflow-revert-global-zoom-keep-card-density-stage154.css',
  'scripts/apply-stage154-revert-global-zoom-keep-card-density.cjs',
  'scripts/check-stage154-revert-global-zoom-keep-card-density.cjs',
  'docs/ui/CLOSEFLOW_STAGE154_REVERT_GLOBAL_ZOOM_KEEP_CARD_DENSITY.md',
  'docs/ui/CLOSEFLOW_STAGE154_RUNTIME_DENSITY_AUDIT.js',
  '_project/STAGE154_REVERT_GLOBAL_ZOOM_KEEP_CARD_DENSITY_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage154 revert global zoom keep card density.md',

  'src/styles/closeflow-main-panel-density-scale-stage155.css',
  'scripts/apply-stage155-main-panel-density-scale.cjs',
  'scripts/check-stage155-main-panel-density-scale.cjs',
  'docs/ui/CLOSEFLOW_STAGE155_MAIN_PANEL_DENSITY_SCALE_SOURCE_TRUTH.md',
  'docs/ui/CLOSEFLOW_STAGE155_RUNTIME_MAIN_PANEL_DENSITY_AUDIT.js',
  '_project/STAGE155_MAIN_PANEL_DENSITY_SCALE_SOURCE_TRUTH_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage155 main panel density scale source truth.md',
].forEach(removeFile);

console.log('DONE Stage157 viewport zoom 80 source truth patcher.');
