#!/usr/bin/env node
/*
  CLOSEFLOW_ADMIN_FEEDBACK_VISUAL_REPAIR_2026_05_08
  Targeted visual repair from admin feedback export:
  - Case detail: remove dark/black background behind create-action tiles.
  - Calendar: restore readable text contrast in week filter and entry cards.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const GUARD = 'CLOSEFLOW_ADMIN_FEEDBACK_VISUAL_REPAIR_2026_05_08';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function listFiles(dir, predicate, out = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === '.vercel') continue;
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) listFiles(path.relative(ROOT, full), predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function normalizeSlashes(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function findCssTarget() {
  const preferred = [
    'src/index.css',
    'src/styles/index.css',
    'src/styles/visual-stage23-client-case-forms-vnext.css',
    'src/styles/closeflow-metric-tiles.css',
    'src/styles/visual-stage12-client-detail-vnext.css',
  ];
  for (const rel of preferred) {
    if (exists(rel)) return path.join(ROOT, rel);
  }

  const cssFiles = listFiles('src', file => file.endsWith('.css'));
  const bySelectors = cssFiles.find(file => {
    const text = read(file);
    return text.includes('case-detail-create-action-card') || text.includes('calendar-week-filter') || text.includes('calendar-entry-card');
  });
  if (bySelectors) return bySelectors;

  const fallback = path.join(ROOT, 'src/styles/closeflow-admin-feedback-visual-repair.css');
  ensureCssImport(fallback);
  return fallback;
}

function ensureCssImport(cssFile) {
  const rel = normalizeSlashes(cssFile);
  const importPathFromMain = './' + path.relative(path.join(ROOT, 'src'), cssFile).replace(/\\/g, '/');
  const mainCandidates = ['src/main.tsx', 'src/main.ts', 'src/App.tsx'];
  for (const mainRel of mainCandidates) {
    const mainFile = path.join(ROOT, mainRel);
    if (!fs.existsSync(mainFile)) continue;
    let text = read(mainFile);
    if (text.includes(rel) || text.includes(importPathFromMain)) return;
    const importLine = `import "${importPathFromMain}";\n`;
    text = importLine + text;
    write(mainFile, text);
    console.log(`Injected CSS import into ${mainRel}`);
    return;
  }
}

const cssBlock = `

/* ${GUARD}
   Admin feedback repair, 2026-05-08.
   Scope:
   1) /cases/:id right rail create-action panel: remove black/dark backing behind tiles.
   2) /calendar week filter and entry cards: restore text contrast on light cards.
   Keep this block scoped to existing CloseFlow classes. Do not use global body/card overrides here.
*/
:where(.case-detail-right-card.case-detail-create-action-card, [data-case-create-actions-panel="true"]) {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(248, 250, 252, 0.97)) !important;
  color: #0f172a !important;
  border: 1px solid rgba(226, 232, 240, 0.95) !important;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08) !important;
  backdrop-filter: none !important;
}

:where(.case-detail-right-card.case-detail-create-action-card, [data-case-create-actions-panel="true"])::before,
:where(.case-detail-right-card.case-detail-create-action-card, [data-case-create-actions-panel="true"])::after {
  background: transparent !important;
  box-shadow: none !important;
}

:where(.case-detail-right-card.case-detail-create-action-card, [data-case-create-actions-panel="true"]) :is(h1, h2, h3, h4, p, span, div, label, small, strong) {
  color: inherit;
}

:where(.case-detail-right-card.case-detail-create-action-card, [data-case-create-actions-panel="true"]) :is(button, a) {
  color: #0f172a;
}

:where(.main-calendar-html .right-card.calendar-week-filter, .main-calendar-html .calendar-week-plan, .main-calendar-html .calendar-entry-card) {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(248, 250, 252, 0.98)) !important;
  color: #0f172a !important;
  border-color: rgba(226, 232, 240, 0.95) !important;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.07) !important;
}

.main-calendar-html .right-card.calendar-week-filter :is(h1, h2, h3, h4, p, span, div, button, small, strong),
.main-calendar-html .calendar-week-plan :is(h1, h2, h3, h4, p, span, div, button, small, strong),
.main-calendar-html .calendar-entry-card :is(h1, h2, h3, h4, p, span, div, button, small, strong) {
  color: #334155 !important;
}

.main-calendar-html .calendar-entry-card .text-slate-400,
.main-calendar-html .calendar-entry-card p.text-slate-400,
.main-calendar-html .calendar-entry-card .font-semibold.text-slate-400 {
  color: #64748b !important;
}

.main-calendar-html .calendar-entry-card .text-slate-600,
.main-calendar-html .calendar-entry-card div.text-slate-600,
.main-calendar-html .calendar-entry-card .font-bold.text-slate-600 {
  color: #334155 !important;
}

.main-calendar-html .calendar-week-filter :is(.is-active, [aria-current="date"], [data-active="true"]),
.main-calendar-html .calendar-week-filter :is(.is-active, [aria-current="date"], [data-active="true"]) :is(h1, h2, h3, h4, p, span, div, button, small, strong) {
  color: #0f172a !important;
}

.main-calendar-html .calendar-week-day.is-active,
.main-calendar-html .calendar-week-day.is-active :is(h1, h2, h3, h4, p, span, div, button, small, strong) {
  color: #0f172a !important;
}

.main-calendar-html .calendar-entry-card :is(.text-white, .text-slate-50, .text-slate-100),
.main-calendar-html .right-card.calendar-week-filter :is(.text-white, .text-slate-50, .text-slate-100),
.main-calendar-html .calendar-week-plan :is(.text-white, .text-slate-50, .text-slate-100) {
  color: #334155 !important;
}
/* /${GUARD} */
`;

function patchCss() {
  const target = findCssTarget();
  let text = fs.existsSync(target) ? read(target) : '';
  if (text.includes(GUARD)) {
    console.log(`${GUARD}: CSS block already present in ${normalizeSlashes(target)}`);
    return normalizeSlashes(target);
  }
  write(target, text.replace(/\s*$/, '') + cssBlock + '\n');
  console.log(`${GUARD}: appended CSS repair to ${normalizeSlashes(target)}`);
  return normalizeSlashes(target);
}

function copyCheckScriptIntoPackageJson() {
  const packageJsonPath = path.join(ROOT, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('package.json not found, skipped script registration');
    return;
  }
  const pkg = JSON.parse(read(packageJsonPath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:closeflow-admin-feedback-visual-repair'] = 'node scripts/check-closeflow-admin-feedback-visual-repair.cjs';
  write(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('Registered npm script: check:closeflow-admin-feedback-visual-repair');
}

function writeReleaseDoc(targetCssRel) {
  const docRel = 'docs/release/closeflow-admin-feedback-visual-repair-2026-05-08.md';
  const docPath = path.join(ROOT, docRel);
  const doc = `# CloseFlow admin feedback visual repair \u2014 2026-05-08\n\n## Cel\n\nNaprawa P1 z eksportu admin feedbacku z 2026-05-08:\n\n1. \`/cases/:id\` \u2014 panel \`Dodaj do sprawy\` / \`case-detail-create-action-card\`: skasowa\u0107 czarne t\u0142o za kafelkami.\n2. \`/calendar\` \u2014 \`Brak powi\u0105zania\` ma by\u0107 czytelne.\n3. \`/calendar\` \u2014 godzina wpisu, np. \`01:00\`, ma by\u0107 czytelna.\n4. \`/calendar\` \u2014 boczny panel \`Najbli\u017Csze 7 dni\` nie mo\u017Ce mie\u0107 bia\u0142ych liter na bia\u0142ym tle.\n\n## Zakres zmiany\n\n- Dodano scoped CSS guard: \`${GUARD}\`.\n- Plik CSS: \`${targetCssRel}\`.\n- Dodano check: \`npm run check:closeflow-admin-feedback-visual-repair\`.\n\n## Nie zmieniono\n\n- Brak zmian modelu danych.\n- Brak zmian API.\n- Brak przebudowy layoutu.\n- Brak zmian routingowych.\n\n## Test r\u0119czny po wdro\u017Ceniu\n\n1. Wejd\u017A w \`/cases/<id>\` i sprawd\u017A panel \`Dodaj do sprawy\`: nie ma czarnego t\u0142a za kafelkami.\n2. Wejd\u017A w \`/calendar\` i sprawd\u017A wpisy w planie: \`Brak powi\u0105zania\` i godzina s\u0105 widoczne.\n3. Sprawd\u017A lewy/boczny panel \`Najbli\u017Csze 7 dni\`: daty i tekst s\u0105 czytelne na jasnym tle.\n4. Sprawd\u017A tryb desktop przy szerokim viewport podobnym do zg\u0142oszenia: 2304 x 1094, DPR ok. 0.83.\n`;
  write(docPath, doc);
  console.log(`Wrote ${docRel}`);
}

function main() {
  const targetCssRel = patchCss();
  copyCheckScriptIntoPackageJson();
  writeReleaseDoc(targetCssRel);
  console.log(`${GUARD}: repair complete`);
}

main();
