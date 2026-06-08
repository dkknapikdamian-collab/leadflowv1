const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail('missing file: ' + rel);
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}

function fail(message) {
  console.error('STAGE228R13_MISSING_ITEM_STATUS_RESOLVE_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function requireAny(text, tokens, label) {
  if (!tokens.some((token) => text.includes(token))) {
    fail(label + ' missing one of tokens: ' + tokens.join(' OR '));
  }
}

const lead = read('src/pages/LeadDetail.tsx');
const client = read('src/pages/ClientDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const packageJson = JSON.parse(read('package.json'));

[
  'STAGE228R13_LEAD_MISSING_ITEM_STATUS_RESOLVE',
  'handleResolveLeadMissingItemStage228R13',
  'data-stage228r13-lead-missing-resolve-action="true"',
  'updateTaskInSupabase',
  "source: 'stage228r13_lead_missing_item_status_resolve'",
  "!isDoneStatus(status) &&",
  "status: 'done'",
  "status: 'resolved'",
  'Rozwiąż brak',
].forEach((token) => requireText(lead, token, 'LeadDetail missing resolve'));

requireAny(
  lead,
  [
    "addActivity('missing_item_resolved'",
    'addActivity("missing_item_resolved"',
    "eventType: 'missing_item_resolved'",
  ],
  'LeadDetail resolved activity marker'
);

[
  'STAGE228R13_CLIENT_MISSING_ITEM_STATUS_RESOLVE',
  'updateTaskInSupabase',
  'handleResolveClientMissingItemStage228R13',
  'data-stage228r13-client-missing-status-actions="true"',
  'data-stage228r13-client-missing-resolve-action="true"',
  "eventType: 'missing_item_resolved'",
  "source: 'stage228r13_client_missing_item_status_resolve'",
  "return !isDoneStatus(status) &&",
  "status: 'done'",
  "status: 'resolved'",
  'Rozwiąż',
].forEach((token) => requireText(client, token, 'ClientDetail missing resolve'));

[
  "key: 'blockers' as CaseActionAccordionGroup",
  "label: 'Braki i blokady'",
  "entry.kind === 'missing'",
  "onItemAccept={(item) => handleItemStatusChange(item, 'accepted')}",
  ".filter((item) => item.status !== 'accepted')",
  "toast.success('Status braku zmieniony')",
].forEach((token) => requireText(caseDetail, token, 'CaseDetail existing missing status'));

const command = 'node scripts/check-stage228r13-missing-item-status-resolve.cjs';
if (packageJson.scripts['check:stage228r13-missing-item-status-resolve'] !== command) {
  fail('package.json missing check:stage228r13-missing-item-status-resolve script');
}
if (!String(packageJson.scripts.prebuild || '').includes(command)) {
  fail('package.json prebuild missing Stage228R13 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R13_MISSING_ITEM_STATUS_RESOLVE',
  repair: 'R13R2 guard accepts LeadDetail addActivity helper',
  mode: 'LOCAL_ONLY_UNTIL_C5',
  contract: {
    lead: 'Braki i blokady shows open missing items and can resolve missing task',
    client: 'Braki i blokady shows open missing items and can resolve missing task',
    case: 'Case missing item status remains case_items accepted/rejected via existing CaseDetail controls'
  },
  sqlRequired: false
}, null, 2));
