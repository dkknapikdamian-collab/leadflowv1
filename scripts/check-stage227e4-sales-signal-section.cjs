const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const leadPath = path.join(repoRoot, 'src', 'pages', 'LeadDetail.tsx');
const cssPath = path.join(repoRoot, 'src', 'styles', 'closeflow-lead-detail-sales-signal-stage227e4.css');
const packagePath = path.join(repoRoot, 'package.json');

function fail(message) {
  console.error('FAIL STAGE227E4_SALES_SIGNAL_SECTION: ' + message);
  process.exit(1);
}
function pass(message) {
  console.log('PASS ' + message);
}
function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + path.relative(repoRoot, file));
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

const lead = read(leadPath);
const css = read(cssPath);
const pkg = JSON.parse(read(packagePath));

const requiredLead = [
  'STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION',
  'buildLeadSalesSignalStage227E4',
  'leadSalesSignalItemsStage227E4',
  'data-stage227e4-sales-signal-section="true"',
  'data-stage227e4-sales-signal-item={item.key}',
  'Problem / potrzeba',
  'Powód kontaktu',
  'Termin / pilność',
  'Budżet / potencjał',
  'Decyzja',
  'Blokada',
  "import '../styles/closeflow-lead-detail-sales-signal-stage227e4.css';",
];
for (const token of requiredLead) {
  if (!lead.includes(token)) fail('LeadDetail missing: ' + token);
  pass('LeadDetail contains: ' + token);
}

if (!lead.includes('lead-detail-stage228b-work-action-center')) fail('Lead action center missing after E4 patch');
if (lead.indexOf('data-stage227e4-sales-signal-section="true"') > lead.indexOf('lead-detail-stage228b-work-action-center')) {
  fail('Sales Signal must render before Work Action Center');
}
pass('Sales Signal renders before Work Action Center');

const helperStart = lead.indexOf('function buildLeadSalesSignalStage227E4');
const helperEnd = lead.indexOf('export default function LeadDetail()', helperStart);
if (helperStart < 0 || helperEnd < 0) fail('cannot isolate sales signal helper');
const helper = lead.slice(helperStart, helperEnd);
for (const field of ['problem', 'need', 'contactReason', 'urgency', 'budget', 'decision', 'blocker', 'riskReason']) {
  if (!helper.includes(field)) fail('helper does not map field token: ' + field);
}
pass('helper maps existing lead fields and risk source');

for (const token of ['lead-detail-sales-signal-section', 'lead-detail-sales-signal-grid', 'lead-detail-sales-signal-card--missing', 'lead-detail-sales-signal-card--warning']) {
  if (!css.includes(token)) fail('CSS missing: ' + token);
  pass('CSS contains: ' + token);
}

const scripts = pkg.scripts || {};
if (scripts['check:stage227e4-sales-signal-section'] !== 'node scripts/check-stage227e4-sales-signal-section.cjs') fail('missing package script check:stage227e4-sales-signal-section');
if (scripts['test:stage227e4-sales-signal-section'] !== 'node --test tests/stage227e4-sales-signal-section.test.cjs') fail('missing package script test:stage227e4-sales-signal-section');
pass('package scripts contain Stage227E4 check/test');

console.log('PASS STAGE227E4_SALES_SIGNAL_SECTION');
