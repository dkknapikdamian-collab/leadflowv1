const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const root = process.cwd();
const rel = (p) => path.join(root, p);
const read = (p) => fs.readFileSync(rel(p), 'utf8');
const exists = (p) => fs.existsSync(rel(p));
const fail = (message) => {
  console.error('[005C-R7] FAIL ' + message);
  process.exit(1);
};
const must = (condition, message) => {
  if (!condition) fail(message);
};

const leadsRel = 'src/pages/Leads.tsx';
const reportRel = '_project/runs/LF-PROD-SOT-005C-R7_LEADS_LIST_LEAD_STATUS_LABEL_TONE_FACADE_RUNTIME_REWIRE_DO_POTWIERDZENIA.md';
const testRel = 'tests/lf-prod-sot-005c-r7-leads-list-lead-status-label-tone-facade-runtime-rewire.test.cjs';
const guardRel = 'scripts/guards/verify-lf-prod-sot-005c-r7-leads-list-lead-status-label-tone-facade-runtime-rewire.cjs';
const pkgRel = 'package.json';

for (const file of [leadsRel, reportRel, testRel, guardRel, pkgRel]) {
  must(exists(file), 'missing ' + file);
}

const leads = read(leadsRel);
const report = read(reportRel);
const pkg = read(pkgRel);

must(
  leads.includes("import { LEAD_STATUS_OPTIONS, getLeadStatusLabel, getLeadStatusTone } from '../lib/config/lead-status';"),
  'lead-status facade import must stay present'
);

must(
  leads.includes('const leadStatusLabel = getLeadStatusLabel(lead.status);'),
  'main lead row status label must use getLeadStatusLabel(lead.status)'
);

must(
  leads.includes('const leadStatusTone = getLeadStatusTone(lead.status);'),
  'main lead row status tone must use getLeadStatusTone(lead.status)'
);

must(
  leads.includes('<span className="cf-status-pill" data-cf-status-tone={leadStatusTone}>{leadStatusLabel}</span>'),
  'main lead row status pill must use facade label/tone'
);

must(
  !leads.includes('<span className="cf-status-pill" data-cf-status-tone="blue">{statusLabel}</span>'),
  'target fixed-blue main lead status pill must be removed'
);

must(
  !leads.includes('const statusLabel = statusOption?.label || \'Nowy\';'),
  'target local statusLabel derivation must be removed'
);

must(
  leads.includes('{linkedCase ? <span className="cf-status-pill" data-cf-status-tone="green">Sprawa</span> : null}'),
  'linked case green pill must remain unchanged'
);

must(
  leads.includes('data-cf-status-tone={badge.tone}'),
  'operational badge tone must remain unchanged'
);

must(
  leads.includes('function sanitizeNewLeadCreatePayloadA1(input: any)') &&
  leads.includes('delete payload.clientId;') &&
  leads.includes('delete payload.linkedCaseId;') &&
  leads.includes('delete payload.caseId;'),
  'create lead payload sanitizer must remain present'
);

must(
  leads.includes('function getRestoreStatusForLead(lead: any, linkedCase?: CaseRecord)') &&
  leads.includes("return 'moved_to_service';") &&
  leads.includes("return 'new';"),
  'trash/restore status logic must remain present'
);

for (const marker of [
  'STAGE225_CONTACT_CADENCE_GRID_LEADS',
  'STAGE226_LOST_LEAD_RESCUE_LEADS',
  'buildContactCadenceGrid',
  'buildContactCadenceBuckets',
  'buildLostLeadRescue',
  'resolveLinkedCaseForLead',
]) {
  must(leads.includes(marker), 'scope marker must remain present: ' + marker);
}

for (const marker of [
  'LEADS_LIST_LEAD_STATUS_LABEL_TONE_FACADE_RUNTIME_REWIRE_DONE',
  'RUNTIME_REWIRE_SMALL',
  'DISPLAY_ONLY',
  'NO_MANUAL_SMOKE_NOW',
  'MANUAL_SMOKE_DEFERRED_TO_FINAL_SERIES_GATE',
  'NO_CREATE_LEAD_STATUS_SELECT_CHANGE',
  'NO_CREATE_LEAD_PAYLOAD_CHANGE',
  'NO_LEAD_STATUS_MUTATION_CHANGE',
  'NO_TRASH_RESTORE_STATUS_LOGIC_CHANGE',
  'NO_FILTERS_CHANGE',
  'NO_LINKED_CASE_RELATION_CHANGE',
  'NO_CASEDETAIL_CHANGE',
  'NO_LEADDETAIL_CHANGE',
  'NO_CLIENTDETAIL_CHANGE',
  'NO_FINANCE_CHANGE',
  'NO_SQL_CHANGE',
  'NO_SUPABASE_API_CHANGE',
  'NO_RUNTIME_DATA_CHANGE',
  'NO_DATA_FLOWS_CHANGE',
  'GUARD_PASS',
  'NODE_TEST_PASS',
  'BUILD_PASS',
  'DIFF_CHECK_PASS',
  '005C_R8_CREATED: NO',
]) {
  must(report.includes(marker), 'app report missing marker: ' + marker);
}

must(
  pkg.includes('"verify:lf-prod-sot-005c-r7": "node scripts/guards/verify-lf-prod-sot-005c-r7-leads-list-lead-status-label-tone-facade-runtime-rewire.cjs"'),
  'package.json missing verify:lf-prod-sot-005c-r7 alias'
);

let statusLines = [];
try {
  statusLines = childProcess.execSync('git status --porcelain=v1', { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
} catch (error) {
  fail('could not read git status: ' + error.message);
}

const allowedChanged = new Set([
  'src/pages/Leads.tsx',
  guardRel,
  testRel,
  reportRel,
  'package.json',
]);

for (const line of statusLines) {
  const file = line.slice(3).trim().replace(/^"|"$/g, '');
  if (file === '_project/tmp/' || file.startsWith('_project/tmp/')) continue;
  if (!allowedChanged.has(file)) {
    fail('unexpected changed file in R7 scope: ' + line);
  }
}

for (const forbidden of [
  'src/pages/CaseDetail.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/Finance.tsx',
  'data/flows.json',
]) {
  must(!statusLines.some((line) => line.includes(forbidden)), 'forbidden changed file: ' + forbidden);
}

must(!statusLines.some((line) => line.includes('runtime/data')), 'runtime/data must not be touched');
must(!statusLines.some((line) => line.includes('supabase/') || line.includes('sql/') || line.includes('migrations/')), 'SQL/Supabase/API/migrations must not be touched');

const badChars = [0xfffd, 0, 0x0102, 0x00c2, 0x00c3, 0x0139, 0x203a];
const hasMojibake = (text) => Array.from(text).some((char) => badChars.includes(char.charCodeAt(0)));
for (const file of [leadsRel, reportRel, testRel, guardRel]) {
  must(!hasMojibake(read(file)), 'mojibake in ' + file);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-PROD-SOT-005C-R7',
  mode: 'LEADS_LIST_LEAD_STATUS_LABEL_TONE_FACADE_RUNTIME_REWIRE_DONE',
  runtimeChange: 'DISPLAY_ONLY_MAIN_LEAD_ROW_STATUS_PILL',
  manualSmoke: 'DEFERRED_TO_FINAL_SERIES_GATE',
  nextStage: 'LF-PROD-SOT-005C-R8_AUTO_REVERIFY_AND_NEXT_SAFE_STATUS_FACADE_CANDIDATE_DECISION_DO_POTWIERDZENIA'
}, null, 2));