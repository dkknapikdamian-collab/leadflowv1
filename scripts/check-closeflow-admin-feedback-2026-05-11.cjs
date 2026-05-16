#!/usr/bin/env node
/* CLOSEFLOW_ADMIN_FEEDBACK_2026_05_11_GUARD
 * Lightweight text guard. No browser, no pixel lock.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), 'utf8') : '';
const failMessages = [];

function fail(message) {
  failMessages.push(message);
}

function walk(dir, predicate, output = []) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return output;
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const full = path.join(absolute, entry.name);
    const rel = path.relative(root, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.closeflow-recovery-backups'].includes(entry.name)) continue;
      walk(rel, predicate, output);
      continue;
    }
    if (predicate(rel)) output.push(rel);
  }
  return output;
}

const todayFiles = [
  'src/pages/Today.tsx',
  'src/pages/TodayStable.tsx',
  'src/components/TodayAiAssistant.tsx',
  'src/components/StatShortcutCard.tsx',
];

const clientFiles = [
  'src/pages/Clients.tsx',
  'src/components/ClientCard.tsx',
  'src/styles/clients-next-action-layout.css',
  'src/styles/closeflow-visual-system.css',
  'src/styles/closeflow-action-tokens.css',
  'src/styles/emergency/emergency-hotfixes.css',
];

const caseFiles = [
  'src/pages/Cases.tsx',
  'src/components/CaseCard.tsx',
  'src/lib/cases.ts',
  'src/lib/supabase-fallback.ts',
  'api/cases.ts',
];

const today = todayFiles.map(read).join('\n');
const clients = clientFiles.map(read).join('\n');
const casesPage = read('src/pages/Cases.tsx');
const casesAll = caseFiles.map(read).join('\n');

if (!today.trim()) {
  fail('Today source not found. Expected src/pages/Today.tsx or src/pages/TodayStable.tsx.');
}

const hasTodaySectionMarker =
  today.includes('data-cf-today-section') ||
  today.includes('dataset.cfTodaySection') ||
  today.includes('TODAY_SECTION_DOM_IDS') ||
  today.includes('getTodaySectionDomId');

if (!hasTodaySectionMarker) {
  fail('Today must expose a section marker/id for metric tile targets.');
}

const hasTodayFocusHandler =
  today.includes('focusTodaySection') ||
  today.includes('scrollToTodaySection') ||
  today.includes('syncTodayMetricTileFocusA11y') ||
  today.includes('getTodaySectionKeyFromMetricTile') ||
  today.includes('data-cf-today-metric-tile-target') ||
  today.includes('cfTodayMetricTileTarget');

if (!hasTodayFocusHandler) {
  fail('Today tiles must be wired to focus/expand target sections.');
}

const hasTodayA11yState =
  today.includes('aria-controls') ||
  today.includes('aria-expanded') ||
  today.includes('data-cf-expanded') ||
  today.includes('dataset.cfExpanded');

if (!hasTodayA11yState) {
  fail('Today sections/tiles must expose aria-controls/aria-expanded or data-cf-expanded state.');
}

if (!clients.includes('cf-client-next-action-panel')) {
  fail('Clients nearest action panel needs cf-client-next-action-panel class/style.');
}

const hasClientWideLayout =
  clients.includes('CLOSEFLOW_ETAP3_CLIENTS_WIDE_LAYOUT') ||
  clients.includes('data-client-card-wide-layout="true"') ||
  clients.includes('layout-list w-full max-w-none') ||
  clients.includes('table-card w-full max-w-none') ||
  (/\.main-clients-html\s+\.layout-list[\s\S]*max-width:\s*none/i.test(clients) &&
    /\.main-clients-html\s+\.table-card[\s\S]*max-width:\s*none/i.test(clients));

if (!hasClientWideLayout) {
  fail('Clients list/card must keep a wide layout contract.');
}

const hasCasesDeleteAction =
  casesAll.includes('data-case-row-delete-action="true"') ||
  casesAll.includes('cf-case-row-delete-text-action') ||
  casesAll.includes('handleDeleteCase') ||
  casesAll.includes('deleteCaseWithRelations') ||
  casesAll.includes('deleteCaseFromSupabase');

if (!hasCasesDeleteAction || !casesAll.includes('Usu\u0144')) {
  fail('Cases list must expose a visible delete action.');
}

if (casesPage.includes('% kompletno\u015Bci')) {
  fail('Cases list source must not render literal x% kompletno\u015Bci.');
}

const forbiddenCaseTitleGenerators = [
  "`${String(client?.name || client?.company || 'Klient')} - obs\u0142uga`",
  "`${option.name} - obs\u0142uga`",
  ' - obs\u253C',
  ' - obs\u0139',
];

for (const forbidden of forbiddenCaseTitleGenerators) {
  if (casesPage.includes(forbidden)) {
    fail('Cases list must not render/generate technical title suffix: ' + forbidden);
  }
}

const hasCleanTitleStrategy =
  casesPage.includes('cleanCaseListTitle') ||
  casesPage.includes('sanitizeCaseListTitle') ||
  (!casesPage.includes(' - obs\u0142uga') && !casesPage.includes('obs\u253C') && !casesPage.includes('obs\u0139'));

if (!hasCleanTitleStrategy) {
  fail('Cases list must clean or avoid technical title suffix.');
}

const sourceFiles = [
  ...walk('src', (rel) => /\.(ts|tsx|css|scss)$/.test(rel)),
  ...walk('api', (rel) => /\.(ts|js)$/.test(rel)),
  ...walk('tests', (rel) => /\.(ts|tsx|js|cjs)$/.test(rel)),
];

const mojibakeNeedle = 'obs' + '\u253c';
for (const rel of sourceFiles) {
  const content = read(rel);
  if (content.includes(mojibakeNeedle)) {
    fail('Mojibake obs\\u253c found in source file: ' + rel);
  }
}

if (failMessages.length) {
  for (const message of failMessages) console.error('FAIL: ' + message);
  process.exit(1);
}

console.log('CLOSEFLOW_ADMIN_FEEDBACK_2026_05_11_OK');
