const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const leads = read('src/pages/Leads.tsx');
const css = read('src/styles/closeflow-record-list-source-truth.css');
const pkg = JSON.parse(read('package.json'));

assert(leads.includes('function getLeadPrimaryContact(lead: any)'), 'Missing getLeadPrimaryContact function.');
assert(leads.includes('Telefon: ${phone}'), 'Lead contact pill does not label phone as Telefon.');
assert(leads.includes('E-mail: ${email}'), 'Lead contact pill does not label e-mail.');
assert(leads.includes('Firma: ${company}'), 'Lead contact pill does not label company fallback.');
assert(leads.includes("return 'Kontakt: -';"), 'Lead contact pill does not expose empty contact fallback.');

const marker = 'CLOSEFLOW_RECORD_LIST_DEDUPED_ROW_CONTENT_2026_05_12';
assert(css.includes(marker), 'CSS missing dedupe marker.');
assert(css.includes('.main-leads-html .lead-main-cell .cf-list-row-meta > .sub'), 'Lead source duplicate is not hidden from compact meta.');
assert(css.includes('.main-leads-html .lead-main-cell .cf-list-row-meta > .pill:not(:first-child)'), 'Lead unlabeled duplicate pills are not hidden from compact meta.');
assert(css.includes('.main-leads-html .lead-main-cell .statusline > .pill:not(.cf-status-pill):not([data-cf-status-tone])'), 'Lead duplicate source pill is not hidden from statusline.');
assert(css.includes('.main-clients-html .cf-chip-leads-count'), 'Client lead-count duplicate chip is not hidden.');
assert(css.includes('.main-clients-html .cf-chip-client-value'), 'Client duplicate value chip is not hidden.');
assert(pkg.scripts && pkg.scripts['check:closeflow-record-list-dedupe'], 'package.json missing check:closeflow-record-list-dedupe script.');

console.log('OK closeflow-record-list-dedupe: duplicate source/value chips removed and labeled contact fallback is wired.');
