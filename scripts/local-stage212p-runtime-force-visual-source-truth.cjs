const fs = require('fs');

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
}

function write(path, value) {
  fs.writeFileSync(path, value, 'utf8');
}

const layoutPath = 'src/components/Layout.tsx';
const runtimePath = 'src/components/VisualFoundationRuntimeStage212M.tsx';
const shellPath = 'src/styles/visual-stage01-shell.css';

const runtime = `import { useEffect } from 'react';

const STAGE212P_VISUAL_RUNTIME_FORCE = 'STAGE212P_RUNTIME_FORCE_VISUAL_SOURCE_TRUTH';

const css = \`
:root {
  --cf-canvas: #f1f5f9;
  --cf-surface: #ffffff;
  --cf-surface-soft: #f8fafc;
  --cf-border: #e2e8f0;
}

/* STAGE212P_FORCE_APP_CANVAS */
html,
body,
#root,
body #root,
body #root .app,
body #root .app.closeflow-visual-stage01,
body #root .app.closeflow-visual-stage01.cf-html-shell,
body #root .app.closeflow-visual-stage01.cf-html-shell main.main,
body #root .app.closeflow-visual-stage01.cf-html-shell .view,
body #root .app.closeflow-visual-stage01.cf-html-shell .view.active,
body #root .app.closeflow-visual-stage01.cf-html-shell [data-shell-main="true"],
body #root .app.closeflow-visual-stage01.cf-html-shell [data-shell-content="true"],
body #root .app.closeflow-visual-stage01.cf-html-shell main.cf-route-work-root,
body #root .app.closeflow-visual-stage01.cf-html-shell .cf-route-work-root,
body #root .app.closeflow-visual-stage01.cf-html-shell .main-today,
body #root .app.closeflow-visual-stage01.cf-html-shell .main-today .view.active {
  background: var(--cf-canvas) !important;
  background-color: var(--cf-canvas) !important;
  background-image: none !important;
}

/* Sekcje layoutu Dziś są canvasem, nie kartą */
body #root main.cf-route-work-root > section.grid,
body #root main.cf-route-work-root section.grid.gap-3,
body #root main.cf-route-work-root section.grid.gap-4 {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
}

/* Realne karty zostają białe */
body #root .bg-card:not(section),
body #root .card,
body #root [data-cf-card="true"],
body #root .cf-operator-metric-tile,
body #root [class*="right-card"],
body #root [class*="list-card"],
body #root [class*="toolbar-card"] {
  background: var(--cf-surface) !important;
  background-color: var(--cf-surface) !important;
}

/* Admin toolbar ma być ciemny, niezależnie od globalnych buttonów */
body .admin-debug-toolbar {
  background: rgba(15, 23, 42, 0.96) !important;
  color: #f8fafc !important;
  border-color: rgba(148, 163, 184, 0.42) !important;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.28) !important;
}

body .admin-debug-toolbar > button,
body .admin-debug-toolbar button {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #f8fafc !important;
  border-color: rgba(226, 232, 240, 0.22) !important;
}

/* Aktywna ikonka w sidebarze: bez białego kwadratu */
body .sidebar .nav-btn.active .nav-ico,
body .nav-btn.active .nav-ico {
  width: 22px !important;
  height: 22px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(255, 255, 255, 0.10) !important;
  background-color: rgba(255, 255, 255, 0.10) !important;
  background-image: none !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}

body .sidebar .nav-btn.active .nav-ico svg,
body .nav-btn.active .nav-ico svg {
  width: 14px !important;
  height: 14px !important;
  color: currentColor !important;
  stroke: currentColor !important;
  fill: none !important;
}
\`;

export default function VisualFoundationRuntimeStage212M() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.documentElement.style.setProperty('--cf-canvas', '#f1f5f9');
    document.documentElement.style.setProperty('--cf-surface', '#ffffff');
    document.documentElement.style.setProperty('--cf-surface-soft', '#f8fafc');
    document.documentElement.style.setProperty('--cf-border', '#e2e8f0');

    let style = document.querySelector('style[data-stage212m-visual-foundation-runtime="true"]') as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement('style');
      style.setAttribute('data-stage212m-visual-foundation-runtime', 'true');
      style.setAttribute('data-stage212p-runtime-force', STAGE212P_VISUAL_RUNTIME_FORCE);
      document.head.appendChild(style);
    }

    style.textContent = css;
  }, []);

  return null;
}
`;

write(runtimePath, runtime);

let layout = read(layoutPath);

layout = layout
  .split("import VisualFoundationRuntimeStage212B from './VisualFoundationRuntimeStage212B';").join('')
  .split("import VisualFoundationRuntimeStage212G from './VisualFoundationRuntimeStage212G';").join('')
  .split("import VisualFoundationRuntimeStage212M from './VisualFoundationRuntimeStage212M';").join('');

const importAnchor = "import OperatorTopBarRuntime from './OperatorTopBarRuntime';";
if (!layout.includes(importAnchor)) {
  throw new Error('Missing OperatorTopBarRuntime import anchor in Layout.tsx');
}
layout = layout.replace(importAnchor, `${importAnchor}\nimport VisualFoundationRuntimeStage212M from './VisualFoundationRuntimeStage212M';`);

layout = layout
  .split('<VisualFoundationRuntimeStage212B />').join('')
  .split('<VisualFoundationRuntimeStage212G />').join('')
  .split('<VisualFoundationRuntimeStage212M />').join('');

const renderAnchor = '<OperatorTopBarRuntime />';
if (!layout.includes(renderAnchor)) {
  throw new Error('Missing OperatorTopBarRuntime render anchor in Layout.tsx');
}
layout = layout.replace(renderAnchor, `${renderAnchor}\n      <VisualFoundationRuntimeStage212M />`);

write(layoutPath, layout);

let shell = read(shellPath);
if (!shell.includes('STAGE212P_ACTIVE_NAV_ICON_FINAL')) {
  shell += `

/* STAGE212P_ACTIVE_NAV_ICON_FINAL */
.sidebar .nav-btn.active .nav-ico,
.nav-btn.active .nav-ico {
  width: 22px !important;
  height: 22px !important;
  background: rgba(255, 255, 255, 0.10) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}
.sidebar .nav-btn.active .nav-ico svg,
.nav-btn.active .nav-ico svg {
  width: 14px !important;
  height: 14px !important;
  stroke: currentColor !important;
  fill: none !important;
}
`;
}
write(shellPath, shell);

console.log('STAGE212P_PATCH_PASS');
