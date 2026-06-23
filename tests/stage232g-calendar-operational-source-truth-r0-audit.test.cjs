const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const root = process.cwd();
const reportPath = path.join(root, '_project/runs/STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md');
const payloadPath = path.join(root, '_project/obsidian_updates/2026-06-22_STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md');
const guardPath = path.join(root, 'scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('STAGE232G R0 actual report is completed and not a template', () => {
  assert.ok(fs.existsSync(reportPath), 'R0 report must exist');
  const report = read(reportPath);
  assert.match(report, /Status: R0_AUDIT_COMPLETED \/ REVIEW_REQUIRED \/ RUNTIME_NOT_TOUCHED/);
  assert.match(report, /STATUS_PRECONDITION_RESULT: PARTIAL_BUT_R0_ALLOWED_DOCS_ONLY/);
  assert.match(report, /CALENDAR_SOURCE_TRUTH_STATUS: PARTIAL/);
  assert.doesNotMatch(report, /Status: DO_WYPELNIENIA/);
  assert.doesNotMatch(report, /\| DO_WYPELNIENIA/);
});

test('STAGE232G R0 records key partial findings', () => {
  const report = read(reportPath);
  assert.match(report, /LEAD_SHADOW_ENTRY_STATUS: PARTIAL/);
  assert.match(report, /TODAY_CALENDAR_PARITY_STATUS: PARTIAL/);
  assert.match(report, /GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS: PASS_WITH_RUNTIME_RISK/);
  assert.match(report, /LEGACY_AND_ACTIVE_DOM_NORMALIZERS_FOUND/);
  assert.match(report, /DOM normalizator|normalizatory|replaceChildren/i);
});

test('STAGE232G R0 action matrix includes required actions and risk outcomes', () => {
  const report = read(reportPath);
  for (const action of ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Przywróć', 'Usuń']) {
    assert.match(report, new RegExp(action.replace('+', '\\+')));
  }
  for (const field of ['scheduledAt', 'dueAt', 'date', 'time', 'leadId', 'caseId', 'clientId']) {
    assert.match(report, new RegExp(field));
  }
  assert.match(report, /BROKEN_RISK/);
  assert.match(report, /PARTIAL/);
});

test('STAGE232G R0 explicitly recommends runtime R1 after review', () => {
  const report = read(reportPath);
  assert.match(report, /R1 runtime fix dopiero po pelnym R0/i);
  assert.match(report, /R1_RECOMMENDATION: STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX/);
  assert.match(report, /RUNTIME_TOUCHED: NIE/);
});

test('STAGE232G R0 obsidian payload exists with sync status', () => {
  assert.ok(fs.existsSync(payloadPath), 'R0 payload must exist');
  const payload = read(payloadPath);
  assert.match(payload, /Status: R0_AUDIT_COMPLETED \/ REVIEW_REQUIRED \/ LOCAL_SYNC_PENDING/);
  assert.match(payload, /CALENDAR_SOURCE_TRUTH_STATUS: PARTIAL/);
  assert.match(payload, /STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX/);
});

test('STAGE232G R0 guard exists and checks actual audit status', () => {
  assert.ok(fs.existsSync(guardPath), 'R0 guard must exist');
  const guard = read(guardPath);
  assert.match(guard, /calendarSourceTruthStatus: 'PARTIAL'/);
  assert.match(guard, /R0_AUDIT_COMPLETED/);
  assert.match(guard, /runtimePaths/);
});
