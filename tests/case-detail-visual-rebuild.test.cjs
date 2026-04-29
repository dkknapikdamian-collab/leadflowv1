const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'CaseDetail.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage13-case-detail-vnext.css');

function fail(message) {
  console.error('FAIL case detail visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing CaseDetail.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage13-case-detail-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'CASE_DETAIL_VISUAL_REBUILD_STAGE13',
  'className="cf-breadcrumbs"',
  'Dodaj brak',
  'Dodaj zadanie',
  'Dodaj wydarzenie',
  'Zrobione',
  'Obsługa',
  'Ścieżka',
  'Checklisty',
  'Historia',
  'Otwórz klienta',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page marker/copy: ${needle}`);
}

const tabRegexes = [
  /<TabsTrigger[^>]*value="work"[^>]*>Obsługa<\/TabsTrigger>/,
  /<TabsTrigger[^>]*value="path"[^>]*>Ścieżka<\/TabsTrigger>/,
  /<TabsTrigger[^>]*value="items"[^>]*>Checklisty<\/TabsTrigger>/,
  /<TabsTrigger[^>]*value="history"[^>]*>Historia<\/TabsTrigger>/,
];

for (const regex of tabRegexes) {
  if (!regex.test(page)) fail(`missing tab pattern: ${regex}`);
}

if (page.includes('Obsługa sprawy')) {
  fail('breadcrumb still uses static "Obsługa sprawy"');
}

const requiredCss = [
  'CASE_DETAIL_VISUAL_REBUILD_STAGE13',
  ".cf-case-right",
  'background: transparent !important',
  'background: rgba(255, 255, 255, 0.92) !important',
  'border: 1px solid var(--cf-vnext-border) !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
  ".cf-tabs-list button[data-state='active']",
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

for (const dark of ['#000', '#020617', '#0b1220', '#101828', 'linear-gradient(135deg']) {
  if (css.toLowerCase().includes(dark)) fail(`dark/gradient token in stage13 css: ${dark}`);
}

console.log('PASS case detail visual rebuild');

