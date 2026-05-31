const fs = require('fs');
const path = require('path');

function fail(code) {
  console.error(`STAGE180L_SUPPORT_ADMIN_RAIL_ANCHORLESS_GUARD_FAIL: ${code}`);
  process.exit(1);
}

const supportPath = path.join(process.cwd(), 'src/pages/SupportCenter.tsx');
const cssPath = path.join(process.cwd(), 'src/styles/visual-stage17-support-vnext.css');
const layoutPath = path.join(process.cwd(), 'src/components/Layout.tsx');
const headerPath = path.join(process.cwd(), 'src/components/CloseFlowPageHeaderV2.tsx');

for (const file of [supportPath, cssPath, layoutPath, headerPath]) {
  if (!fs.existsSync(file)) fail(`missing_file:${file}`);
}

const support = fs.readFileSync(supportPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const layout = fs.readFileSync(layoutPath, 'utf8');
const header = fs.readFileSync(headerPath, 'utf8');

const requiredSupport = [
  "className={isAdmin ? 'support-shell support-shell-admin' : 'support-shell'}",
  'data-support-admin-rail="true"',
  'Panel obsługi',
  'Ostatnia aktywność',
  'Szybkie filtry',
  "setStatusFilter('new')",
  "setStatusFilter('in_progress')",
  "setStatusFilter('answered')",
  "setStatusFilter('closed')",
];
for (const needle of requiredSupport) {
  if (!support.includes(needle)) fail(`missing_support:${needle}`);
}

const forbiddenSupport = [
  'support-right-rail',
  'support-right-card',
  'Sugerowane zgłoszenia',
  'Pomoc operacyjna',
  'Co zgłaszać jako problem?',
  'Co zgłaszać jako sugestię?',
  'Jak opisać dobry błąd?',
  'Lista zgłoszeń z aktualnym statusem, kategorią i możliwością odpowiedzi.',
  'Lista zgłoszeń z aktualnym statusem i możliwością odpowiedzi.',
];
for (const needle of forbiddenSupport) {
  if (support.includes(needle)) fail(`forbidden_support:${needle}`);
}

const requiredCss = [
  '.support-shell-admin',
  '.support-admin-rail',
  '.support-admin-card',
  '.support-admin-stats',
  '.support-admin-filter-list',
];
for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing_css:${needle}`);
}

if (!layout.includes("label: 'Zgłoszenia', path: '/help'")) fail('layout_sidebar_not_zgloszenia');
if (!header.includes("kicker: 'ZGŁOSZENIA'")) fail('header_kicker_not_zgloszenia');
if (!header.includes("title: 'Zgłoszenia'")) fail('header_title_not_zgloszenia');

console.log('STAGE180L_SUPPORT_ADMIN_RAIL_ANCHORLESS_GUARD_PASS');
