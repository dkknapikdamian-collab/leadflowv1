const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('005C-R7 guard passes', () => {
  childProcess.execFileSync(
    process.execPath,
    ['scripts/guards/verify-lf-prod-sot-005c-r7-leads-list-lead-status-label-tone-facade-runtime-rewire.cjs'],
    { cwd: root, stdio: 'pipe' }
  );
});

test('005C-R7 Leads main status pill uses facade label and tone', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.match(
    leads,
    /import \{ LEAD_STATUS_OPTIONS, getLeadStatusLabel, getLeadStatusTone \} from '\.\.\/lib\/config\/lead-status';/
  );
  assert.match(leads, /const leadStatusLabel = getLeadStatusLabel\(lead\.status\);/);
  assert.match(leads, /const leadStatusTone = getLeadStatusTone\(lead\.status\);/);
  assert.match(
    leads,
    /<span className="cf-status-pill" data-cf-status-tone=\{leadStatusTone\}>\{leadStatusLabel\}<\/span>/
  );

  assert.doesNotMatch(
    leads,
    /<span className="cf-status-pill" data-cf-status-tone="blue">\{statusLabel\}<\/span>/
  );
  assert.doesNotMatch(leads, /const statusLabel = statusOption\?\.label \|\| 'Nowy';/);
});

test('005C-R7 forbidden neighboring pills and flows remain present', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.match(
    leads,
    /\{linkedCase \? <span className="cf-status-pill" data-cf-status-tone="green">Sprawa<\/span> : null\}/
  );
  assert.match(leads, /data-cf-status-tone=\{badge\.tone\}/);
  assert.match(leads, /function sanitizeNewLeadCreatePayloadA1\(input: any\)/);
  assert.match(leads, /function getRestoreStatusForLead\(lead: any, linkedCase\?: CaseRecord\)/);
  assert.match(leads, /STAGE225_CONTACT_CADENCE_GRID_LEADS/);
  assert.match(leads, /STAGE226_LOST_LEAD_RESCUE_LEADS/);
  assert.match(leads, /resolveLinkedCaseForLead/);
});