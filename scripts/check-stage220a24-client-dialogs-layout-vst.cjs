const fs = require('fs');

function fail(message) {
  console.error('STAGE220A24_CLIENT_DIALOGS_LAYOUT_VST_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const clients = read('src/pages/Clients.tsx');
const clientCss = read('src/styles/visual-stage12-client-detail-vnext.css');
const vstCss = read('src/styles/closeflow-visual-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

requireText(clients, 'STAGE220A24_CLIENT_DIALOGS_LAYOUT_VST', 'Clients marker');
requireText(clients, "import { ConfirmDialog } from '../components/confirm-dialog';", 'ConfirmDialog import');
requireText(clients, 'clientArchiveConfirm', 'client archive confirm state');
requireText(clients, 'confirmClientArchiveAction', 'client archive confirm handler');
requireText(clients, 'data-stage220a24-client-archive-confirm="true"', 'client archive confirm marker');
forbidText(clients, "window.confirm('Przenieść klienta do kosza", 'native client archive confirm');
forbidText(clients, "window.confirm('Przywrócić klienta", 'native client restore confirm');

requireText(clientCss, 'STAGE220A24_CLIENT_DETAIL_LEFT_RAIL_PARITY', 'client detail layout CSS marker');
requireText(clientCss, '.client-detail-left-rail > .client-detail-today-info-tiles', 'hide duplicate left tiles selector');
requireText(clientCss, 'display: none !important;', 'hide duplicate tiles rule');
requireText(clientCss, '.client-detail-left-rail > .client-detail-profile-card', 'profile card first rail rule');

requireText(vstCss, 'STAGE220A24_GLOBAL_DIALOG_VST_LOCK', 'global dialog CSS marker');
requireText(vstCss, '[role="dialog"]', 'role dialog selector');
requireText(vstCss, '[data-radix-dialog-content]', 'radix dialog selector');
requireText(vstCss, 'textarea::selection', 'textarea selection readable rule');
requireText(vstCss, 'var(--cf-vst-surface-card-solid)', 'surface token');
requireText(vstCss, 'var(--cf-vst-color-primary)', 'primary token');

requireText(doc, 'STAGE220A24 - klient, stare modale i układ panelu danych', 'doc A24 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a24-client-dialogs-layout-vst.cjs', 'prebuild A24 guard');

console.log('STAGE220A24_CLIENT_DIALOGS_LAYOUT_VST_GUARD: OK');
