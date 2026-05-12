const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, text) => fs.writeFileSync(path.join(root, p), text, 'utf8');

const leadsPath = 'src/pages/Leads.tsx';
const cssPath = 'src/styles/closeflow-record-list-source-truth.css';
const packagePath = 'package.json';

for (const p of [leadsPath, cssPath, packagePath]) {
  if (!fs.existsSync(path.join(root, p))) throw new Error(`Missing required file: ${p}`);
}

let leads = read(leadsPath);
const oldContactFn = `function getLeadPrimaryContact(lead: any) {\n  return String(lead?.phone || lead?.email || '').trim();\n}`;
const newContactFn = `function getLeadPrimaryContact(lead: any) {\n  const phone = String(lead?.phone || '').trim();\n  const email = String(lead?.email || '').trim();\n  const company = String(lead?.company || '').trim();\n\n  if (phone) return \`Telefon: \${phone}\`;\n  if (email) return \`E-mail: \${email}\`;\n  if (company) return \`Firma: \${company}\`;\n  return 'Kontakt: -';\n}`;

if (leads.includes(oldContactFn)) {
  leads = leads.replace(oldContactFn, newContactFn);
} else if (!leads.includes("return 'Kontakt: -';") || !leads.includes('Telefon: ${phone}')) {
  throw new Error('Could not patch getLeadPrimaryContact. Function shape changed; inspect src/pages/Leads.tsx before continuing.');
}
write(leadsPath, leads);

let css = read(cssPath);
const marker = 'CLOSEFLOW_RECORD_LIST_DEDUPED_ROW_CONTENT_2026_05_12';
const cssBlock = `

/* ${marker}
   owner: CloseFlow Visual System
   scope: /leads and /clients record lists
   reason: remove duplicate source/value chips after shared row layout was introduced
   rule: one factual slot per fact: contact in main cell, value in value cell, next action in action cell
*/

#root .cf-html-view.main-leads-html .lead-main-cell .cf-list-row-meta > .sub,
#root .cf-html-view.main-leads-html .lead-main-cell .cf-list-row-meta > .cf-list-row-value,
#root .cf-html-view.main-leads-html .lead-main-cell .cf-list-row-meta > .cf-chip-lead-value,
#root .cf-html-view.main-leads-html .lead-main-cell .cf-list-row-meta > .pill:not(:first-child) {
  display: none !important;
}

#root .cf-html-view.main-leads-html .lead-main-cell .statusline > .pill:not(.cf-status-pill):not([data-cf-status-tone]) {
  display: none !important;
}

#root .cf-html-view.main-leads-html .lead-main-cell .cf-list-row-meta > .pill:first-child {
  background: rgb(219 234 254) !important;
  border: 1px solid rgb(147 197 253) !important;
  color: rgb(29 78 216) !important;
  -webkit-text-fill-color: rgb(29 78 216) !important;
}

#root .cf-html-view.main-clients-html .cf-chip-leads-count,
#root .cf-html-view.main-clients-html .cf-chip-client-value {
  display: none !important;
}

#root .cf-html-view:is(.main-leads-html, .main-clients-html) .row:not(.row-empty) :is(.cf-status-pill, [data-cf-status-tone]) {
  font-weight: 850 !important;
}

#root .cf-html-view:is(.main-leads-html, .main-clients-html) .row:not(.row-empty) > :is(.lead-value-cell, .cf-client-cases-cell) :is(.mini, small),
#root .cf-html-view:is(.main-leads-html, .main-clients-html) .row:not(.row-empty) > :is(.lead-action-cell, .client-card-next-action-block, .cf-client-next-action-panel, .cf-client-next-action-inline) :is(.mini, small) {
  color: rgb(100 116 139) !important;
  -webkit-text-fill-color: rgb(100 116 139) !important;
  font-weight: 850 !important;
}
`;

if (!css.includes(marker)) {
  css = css.trimEnd() + cssBlock + '\n';
  write(cssPath, css);
}

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-record-list-dedupe'] = 'node scripts/check-closeflow-record-list-dedupe.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('OK patch-closeflow-record-list-dedupe: source patched.');
