const fs = require('fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL STAGE227E1_LEAD_HEADER_PHONE_VISIBILITY: ${message}`);
  process.exit(1);
}

function mustContain(source, fragment, label = fragment) {
  if (!source.includes(fragment)) fail(`missing: ${label}`);
  pass(`contains: ${label}`);
}

function mustNotContain(source, fragment, label = fragment) {
  if (source.includes(fragment)) fail(`forbidden: ${label}`);
  pass(`not contains: ${label}`);
}

mustContain(lead, 'STAGE227E1_LEAD_HEADER_PHONE_VISIBILITY', 'stage marker');
mustContain(lead, 'data-stage227e1-header-phone-visibility="true"', 'header data marker');
mustContain(lead, 'data-stage227e1-header-phone="true"', 'phone marker');
mustContain(lead, "lead.phone || 'Brak telefonu'", 'explicit missing phone copy');
mustContain(lead, "copyValue('Telefon'", 'phone copy action');
mustContain(lead, 'data-stage227e1-header-email="true"', 'email marker');
mustContain(lead, "lead.email || 'Brak e-maila'", 'explicit missing email copy');
mustContain(lead, 'data-stage227e1-header-company="true"', 'company marker');
mustContain(lead, "lead.company || 'Brak firmy'", 'explicit missing company copy');
mustContain(lead, 'data-stage227e1-header-source="true"', 'source marker');
mustContain(lead, 'data-stage227e1-header-last-contact="true"', 'last contact marker');
mustContain(lead, 'Ostatni kontakt', 'last contact label');

const headerStart = lead.indexOf('data-stage227e1-header-phone-visibility="true"');
const headerEnd = lead.indexOf('</header>', headerStart);
if (headerStart === -1 || headerEnd === -1) fail('cannot locate Stage227E1 header block');
const header = lead.slice(headerStart, headerEnd);

mustNotContain(header, 'Kontakt: {lead.phone || lead.email', 'combined contact header field');
mustNotContain(header, 'Zrodlo:', 'old source spelling/inline source label');
mustNotContain(header, 'Ostatnia aktywnosc:', 'old activity label');
mustNotContain(header, 'Brak kontaktu', 'combined missing contact copy');

mustContain(css, 'STAGE227E1_LEAD_HEADER_PHONE_VISIBILITY', 'CSS marker');
mustContain(css, '.lead-detail-header-contact-grid', 'header contact grid CSS');
mustContain(css, '.lead-detail-header-phone-item', 'phone item highlight CSS');
mustContain(css, '.lead-detail-header-contact-grid .lead-detail-header-meta-item button', 'header copy button CSS');

mustContain(pkg, 'check:stage227e1-lead-header-phone-visibility', 'package check script');
mustContain(pkg, 'test:stage227e1-lead-header-phone-visibility', 'package test script');

console.log('PASS STAGE227E1_LEAD_HEADER_PHONE_VISIBILITY');
