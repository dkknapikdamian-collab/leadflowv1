const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const reportPath = path.join(root, '_project/runs/STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md');
const guardPath = path.join(root, 'scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs');

test('STAGE232G R0 report exists and has audit contract sections', () => {
  assert.ok(fs.existsSync(reportPath), 'R0 report must exist');
  const report = fs.readFileSync(reportPath, 'utf8');

  for (const section of [
    'STATUS_PRECONDITION',
    'ACTIVE_ROUTE_MAP',
    'CALENDAR_DATA_MODEL_MAP',
    'LEAD_SHADOW_ENTRY_STATUS',
    'TODAY_CALENDAR_PARITY_STATUS',
    'ACTION_FIELD_MATRIX',
    'LEGACY_AND_ACTIVE_DOM_NORMALIZERS_FOUND',
    'GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS',
    'CALENDAR_SOURCE_TRUTH_STATUS',
    'R1_DECISION_GATE',
  ]) {
    assert.match(report, new RegExp(section), `missing section: ${section}`);
  }
});

test('STAGE232G R0 action matrix includes all required actions and fields', () => {
  const report = fs.readFileSync(reportPath, 'utf8');

  for (const action of ['Edytuj', '\\+1H', '\\+1D', '\\+1W', 'Zrobione', 'Przywróć', 'Usuń']) {
    assert.match(report, new RegExp(action), `missing action: ${action}`);
  }

  for (const field of ['scheduledAt', 'dueAt', 'date', 'time', 'leadId', 'caseId', 'clientId']) {
    assert.match(report, new RegExp(field), `missing field: ${field}`);
  }
});

test('STAGE232G R0 explicitly remains docs-only before runtime R1', () => {
  const report = fs.readFileSync(reportPath, 'utf8');

  assert.match(report, /RUNTIME_TOUCHED:\s*NIE/);
  assert.match(report, /R0 nie rusza:/);
  assert.match(report, /R1 runtime fix dopiero/i);
});

test('STAGE232G R0 guard exists', () => {
  assert.ok(fs.existsSync(guardPath), 'guard script must exist');
  const guard = fs.readFileSync(guardPath, 'utf8');
  assert.match(guard, /STAGE232G_R0/);
  assert.match(guard, /runtime file/);
});
