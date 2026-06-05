const fs = require('fs');

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
}

function write(path, value) {
  fs.writeFileSync(path, value, 'utf8');
}

function unique(items) {
  return [...new Set(items)];
}

const indexPath = 'src/index.css';
const layoutPath = 'src/components/Layout.tsx';
const shellPath = 'src/styles/visual-stage01-shell.css';
const adminPath = 'src/styles/admin-tools.css';
const foundationPath = 'src/styles/closeflow-visual-foundation-stage212m.css';

let index = read(indexPath);

// 1) index.css: import order + jedno visual source truth.
{
  const lines = index.replaceAll('\r', '').split('\n');
  const importLines = [];
  const restLines = [];

  for (const line of lines) {
    const trim = line.trim();
    if (trim.startsWith('@import ')) {
      if (
        trim.includes('closeflow-canvas-layer-source-truth-stage211h.css') ||
        trim.includes('closeflow-canvas-runtime-source-truth-stage211j.css') ||
        trim.includes('closeflow-canvas-final-source-truth-stage211k.css') ||
        trim.includes('closeflow-canvas-source-truth-stage211e.css') ||
        trim.includes('closeflow-visual-foundation-stage212b.css') ||
        trim.includes('closeflow-visual-foundation-stage212g.css')
      ) {
        continue;
      }
      importLines.push(trim);
    } else {
      restLines.push(line);
    }
  }

  const imports = unique([
    '@import "tailwindcss";',
    '@import "./styles/closeflow-visual-foundation-stage212m.css";',
    ...importLines.filter((line) => line !== '@import "tailwindcss";' && !line.includes('closeflow-visual-foundation-stage212m.css')),
  ]);

  index = `${imports.join('\n')}\n${restLines.join('\n').replace(/^\s+/, '')}`;
  write(indexPath, index);
}

// 2) Visual foundation: jeden punkt prawdy dla canvasu, Dziś, debug toolbar i sidebar icon.
const foundationCss = `/*
  STAGE212O_TODAY_VISUAL_SOURCE_TRUTH
  Jeden punkt prawdy dla tła/canvasu i podstawowych surface.
  Canvas: #f1f5f9
  Surface: #ffffff
  Surface soft: #f8fafc
  Border: #e2e8f0
*/

:root {
  --cf-canvas: #f1f5f9;
  --cf-surface: #ffffff;
  --cf-surface-soft: #f8fafc;
  --cf-border: #e2e8f0;
  --cf-admin-dark: rgba(15, 23, 42, 0.92);
  --cf-admin-dark-solid: #0f172a;
}

/* L0-L3: document, app shell, content shell, route root */
html,
body,
#root,
.app.closeflow-visual-stage01,
.cf-html-shell,
main.main,
.view.active,
[data-shell-main="true"],
[data-shell-content="true"],
.cf-route-work-root,
main.cf-route-work-root,
.main-today,
.main-today .view.active {
  background: var(--cf-canvas) !important;
  background-color: var(--cf-canvas) !important;
  background-image: none !important;
}

/* Dziś: sekcje złapane w admin feedbacku jako problem tła */
main.cf-route-work-root > section,
main.cf-route-work-root section.grid,
main.cf-route-work-root section[data-cf-semantic-section-card="true"],
#today-section-ai-drafts,
section#today-section-ai-drafts,
section.grid.gap-4,
section.grid.gap-3 {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
}

/* Karty zostają białe, żeby canvas nie robił mlecznej mgły */
.bg-card,
.card,
[data-cf-card="true"],
.cf-operator-metric-tile,
.cf-semantic-card,
[class*="right-card"],
[class*="list-card"],
[class*="toolbar-card"] {
  background-color: var(--cf-surface) !important;
}

/* Soft surfaces: pola, filtry, puste stany */
input,
textarea,
select,
[role="searchbox"],
.empty-state,
[class*="filter"],
[class*="toolbar"] input {
  background-color: var(--cf-surface-soft);
}

/* Admin debug toolbar: nie może dziedziczyć białych buttonów aplikacji */
.admin-debug-toolbar {
  background: var(--cf-admin-dark) !important;
  color: #f8fafc !important;
  border-color: rgba(148, 163, 184, 0.42) !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.22) !important;
}

.admin-debug-toolbar > button,
.admin-debug-toolbar button,
.admin-debug-toolbar select {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #f8fafc !important;
  border-color: rgba(226, 232, 240, 0.22) !important;
}

.admin-debug-toolbar > button.active,
.admin-debug-toolbar button.active {
  background: rgba(37, 99, 235, 0.9) !important;
  color: #ffffff !important;
  border-color: rgba(147, 197, 253, 0.95) !important;
}

.admin-tool-popover,
.admin-tool-dialog {
  background: var(--cf-admin-dark-solid) !important;
  color: #f8fafc !important;
}

/* Sidebar active icon: koniec białego kwadratu przy Dziś */
.sidebar .nav-btn.active .nav-ico,
.nav-btn.active .nav-ico {
  background: rgba(255, 255, 255, 0.12) !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  background-image: none !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.18) !important;
  box-shadow: none !important;
  border-radius: 10px !important;
}

.sidebar .nav-btn.active .nav-ico svg,
.nav-btn.active .nav-ico svg {
  color: currentColor !important;
  stroke: currentColor !important;
  fill: none !important;
}
`;

write(foundationPath, foundationCss);

// 3) Layout: upewnij się, że runtime Stage212M jest podpięty, bez starych runtime'ów.
let layout = read(layoutPath);

layout = layout
  .split("import VisualFoundationRuntimeStage212B from './VisualFoundationRuntimeStage212B';").join('')
  .split("import VisualFoundationRuntimeStage212G from './VisualFoundationRuntimeStage212G';").join('');

if (!layout.includes("VisualFoundationRuntimeStage212M")) {
  const anchor = "import OperatorTopBarRuntime from './OperatorTopBarRuntime';";
  layout = layout.replace(anchor, `${anchor}\nimport VisualFoundationRuntimeStage212M from './VisualFoundationRuntimeStage212M';`);
}

layout = layout
  .split('<VisualFoundationRuntimeStage212B />').join('')
  .split('<VisualFoundationRuntimeStage212G />').join('');

if (!layout.includes('<VisualFoundationRuntimeStage212M />')) {
  layout = layout.replace('<OperatorTopBarRuntime />', '<OperatorTopBarRuntime />\n      <VisualFoundationRuntimeStage212M />');
}

write(layoutPath, layout);

// 4) Admin CSS: dodaj ostatnią warstwę obrony.
let admin = read(adminPath);
if (!admin.includes('STAGE212O_ADMIN_DEBUG_DARK_SOURCE_TRUTH')) {
  admin += `

/* STAGE212O_ADMIN_DEBUG_DARK_SOURCE_TRUTH */
.admin-debug-toolbar {
  background: rgba(15, 23, 42, 0.92) !important;
  color: #f8fafc !important;
}
.admin-debug-toolbar > button,
.admin-debug-toolbar button {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #f8fafc !important;
}
`;
}
write(adminPath, admin);

// 5) Sidebar CSS: ostatnia warstwa obrony bez białej ikonki.
let shell = read(shellPath);
if (!shell.includes('STAGE212O_ACTIVE_NAV_ICON_NO_WHITE_SQUARE')) {
  shell += `

/* STAGE212O_ACTIVE_NAV_ICON_NO_WHITE_SQUARE */
.sidebar .nav-btn.active .nav-ico,
.nav-btn.active .nav-ico {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.18) !important;
  box-shadow: none !important;
  border-radius: 10px !important;
}
.sidebar .nav-btn.active .nav-ico svg,
.nav-btn.active .nav-ico svg {
  stroke: currentColor !important;
  fill: none !important;
}
`;
}
write(shellPath, shell);

console.log('STAGE212O_PATCH_PASS');
