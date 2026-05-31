/* CLOSEFLOW_STAGE148_SCALED_DESKTOP_SHELL_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-scaled-desktop-shell-stage148.css';");
mustInclude('src/components/Layout.tsx', "import { ShellDesktopViewportRuntime } from './ShellDesktopViewportRuntime';");
mustInclude('src/components/Layout.tsx', '<ShellDesktopViewportRuntime />');
mustInclude('src/components/ShellDesktopViewportRuntime.tsx', 'CLOSEFLOW_STAGE148_SCALED_DESKTOP_SHELL_RUNTIME');
mustInclude('src/components/ShellDesktopViewportRuntime.tsx', "data-cf148-scaled-desktop-shell");
mustInclude('src/components/ShellDesktopViewportRuntime.tsx', "--cf148-scale");
mustInclude('src/components/ShellDesktopViewportRuntime.tsx', "outerWidth >= 1000");
mustInclude('src/components/ShellDesktopViewportRuntime.tsx', "innerWidth < 900");

const css = 'src/styles/closeflow-scaled-desktop-shell-stage148.css';
[
  'CLOSEFLOW_STAGE148_SCALED_DESKTOP_SHELL',
  '--closeflow-stage148-scaled-desktop-shell: "active"',
  'html[data-cf148-scaled-desktop-shell="true"] #root',
  'transform: scale(var(--cf148-scale)) !important',
  'grid-template-columns: var(--cf148-sidebar-width) minmax(0, 1fr) !important',
  'width: var(--cf148-design-width) !important',
  'calc(var(--cf148-design-width) - var(--cf148-sidebar-width)',
  '.main-leads-html',
  '.main-clients-html',
  '.main-cases-html',
  '[data-p0-today-stable-rebuild="true"]',
  '[data-p0-tasks-stable-rebuild="true"]',
  '.activity-vnext-shell',
].forEach((marker) => mustInclude(css, marker));

mustInclude('docs/ui/CLOSEFLOW_STAGE148_RUNTIME_SCALED_DESKTOP_AUDIT.js', 'stage148Loaded');
mustInclude('_project/STAGE148_SCALED_DESKTOP_SHELL_REPORT.md', 'scaled desktop');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage148 scaled desktop shell.md', 'Stage148');

console.log('OK: Stage148 scaled desktop shell guard passed.');
