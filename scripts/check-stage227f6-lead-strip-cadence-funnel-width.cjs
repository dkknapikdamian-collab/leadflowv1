const fs = require('fs');
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F6_LEAD_STRIP_CADENCE_FUNNEL_WIDTH: ' + label); }
function contains(haystack, needle, label) { if (String(haystack).includes(needle)) pass(label); else fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(haystack, needle, label) { if (!String(haystack).includes(needle)) pass(label); else fail('still contains: ' + label + ' [' + needle + ']'); }
const leadDetail = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const leads = fs.readFileSync('src/pages/Leads.tsx', 'utf8');
const clients = fs.readFileSync('src/pages/Clients.tsx', 'utf8');
const funnel = fs.readFileSync('src/pages/SalesFunnel.tsx', 'utf8');
const unifiedCss = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');
contains(leadDetail, 'STAGE227F6_LEAD_TOP_STRIP_REMOVED_CADENCE_FUNNEL_WIDTH', 'LeadDetail F6 marker');
contains(leadDetail, 'data-stage227f6-lead-top-strip-removed="true"', 'LeadDetail top strip removed marker');
notContains(leadDetail, 'lead-detail-stage227f5-top-strip case-detail-stage220a10-tabs-wrap', 'LeadDetail old shortcut row removed');
notContains(leadDetail, 'data-stage227f5-button-action', 'LeadDetail old shortcut buttons removed');
contains(leads, 'data-stage227f6-contact-cadence-compact="leads"', 'Leads compact contact cadence strip');
contains(clients, 'data-stage227f6-contact-cadence-compact="clients"', 'Clients compact contact cadence strip');
notContains(leads, 'Filtruje leady po dacie ostatniego kontaktu. Nie liczy ciszy z updatedAt.', 'Leads contact cadence helper copy removed');
notContains(clients, 'Filtruje klientów po dacie ostatniego kontaktu. Rekord bez daty wpada do Brak daty kontaktu.', 'Clients contact cadence helper copy removed');
notContains(leads, '<span className="title">Siatka kontaktu</span>', 'Leads contact cadence title removed');
notContains(clients, '<span className="title">Siatka kontaktu</span>', 'Clients contact cadence title removed');
contains(funnel, 'STAGE227F6_SALES_FUNNEL_FULL_WIDTH_CANVAS', 'SalesFunnel F6 marker');
contains(funnel, 'data-stage227f6-sales-funnel-wide-shell="true"', 'SalesFunnel wide shell marker');
contains(funnel, 'sales-funnel-stage227f6-canvas space-y-5', 'SalesFunnel full-width canvas class');
notContains(funnel, 'mx-auto max-w-[1260px]', 'SalesFunnel narrow centered canvas removed');
contains(unifiedCss, 'STAGE227F6_CONTACT_CADENCE_AND_FUNNEL_WIDTH_START', 'Unified CSS F6 marker');
contains(unifiedCss, '.cf-contact-cadence-strip', 'Contact cadence compact CSS');
contains(unifiedCss, '.sales-funnel-stage227f6-canvas', 'SalesFunnel wide CSS');
contains(leadCss, 'STAGE227F6_LEAD_TOP_STRIP_REMOVED_START', 'LeadDetail top strip removal CSS');
contains(pkg, 'check:stage227f6-lead-strip-cadence-funnel-width', 'package check script');
contains(pkg, 'test:stage227f6-lead-strip-cadence-funnel-width', 'package test script');
if (failures) { console.error('\nStage227F6 guard failures: ' + failures); process.exit(1); }
console.log('PASS STAGE227F6_LEAD_STRIP_CADENCE_FUNNEL_WIDTH');
