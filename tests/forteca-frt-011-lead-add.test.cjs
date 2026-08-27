const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-011 renders the real Lead creation modal against canonical field and action owners', () => {
  const leads = read('src/pages/Leads.tsx');
  const dialogCss = read('src/styles/owners/closeflow-dialogs.css');
  const contract = read('_project/contracts/forteca-clean/FRT-011_LEAD_ADD.md');

  assert.match(contract, /STAGE_ID: FRT-011/);
  assert.match(contract, /TARGET_ROUTE: \/leads/);
  assert.match(contract, /Add Lead modal/);
  assert.match(leads, /data-forteca-frt-011-lead-add="true"/);
  assert.match(leads, /data-forteca-frt-011-form="true"/);
  assert.match(leads, /Dodaj leada/);
  assert.match(leads, /Dane podstawowe/);
  assert.ok(leads.includes('value={newLead.summary}'));
  assert.ok(leads.includes('value={newLead.company}'));
  assert.ok(leads.includes('value={newLead.name}'));
  assert.ok(leads.includes('value={newLead.email}'));
  assert.match(leads, /Firma <span aria-hidden="true">\*<\/span>/);
  assert.match(leads, /Imię i nazwisko <span aria-hidden="true">\*<\/span>/);
  assert.match(leads, /E-mail <span aria-hidden="true">\*<\/span>/);
  assert.ok(leads.includes('value={newLead.phone}'));
  assert.match(leads, /LEAD_SOURCE_OPTIONS.map/);
  assert.match(leads, /LEAD_STATUS_OPTIONS.filter/);
  assert.ok(leads.includes("value={newLead.isAtRisk ? 'high' : 'medium'}"));
  assert.match(leads, /data-forteca-frt-011-next-step="true"/);
  assert.match(leads, /TASK_TYPES.map/);
  assert.match(leads, /type="datetime-local"/);
  assert.match(leads, /getLeadCreateQuickActionDateTime/);
  assert.match(leads, /data-forteca-frt-011-task-toggle="true"/);
  assert.ok(leads.includes('aria-pressed={newLead.createNextTask}'));
  assert.match(leads, /insertTaskToSupabase/);
  assert.match(leads, /data-forteca-frt-011-owner="true"/);
  assert.match(leads, /leadCreateOwnerLabel/);
  assert.match(leads, /Opiekun <span aria-hidden="true">\*<\/span>/);
  assert.ok(leads.includes('maxLength={500}'));
  assert.match(leads, /data-forteca-frt-011-submit="true"/);
  assert.match(leads, /const handleNewLeadOpenChange = \(open: boolean\)/);
  assert.match(leads, /if \(!open\) resetNewLeadForm\(\)/);
  assert.match(leads, /onOpenChange=\{handleNewLeadOpenChange\}/);
  assert.match(leads, /onClick=\{\(\) => handleNewLeadOpenChange\(false\)\}/);
  assert.match(leads, /Dane operacyjne/);
  assert.match(leads, /data-stage223r3-lead-last-contact-input="true"/);
  assert.match(dialogCss, /FRT-011 — Forteca calm-light lead creation modal/);
  assert.match(dialogCss, /data-forteca-frt-011-lead-add="true"/);
  assert.doesNotMatch(dialogCss, /#root[^\n]*data-forteca-frt-011/);
});

test('FRT-011 preserves truthful validation and post-create task behavior', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.match(leads, /Wybierz następny krok i termin\./);
  assert.match(leads, /Wybierz następny krok i termin zadania\./);
  assert.match(leads, /const createdLead = await insertLeadToSupabase/);
  assert.ok(leads.includes('const createdLeadId = getCreatedRecordId(createdLead);'));
  assert.match(leads, /leadId: createdLeadId/);
  assert.match(leads, /workspaceId/);
  assert.match(leads, /Lead i zadanie dodane/);
  assert.match(leads, /Lead dodany, ale zadanie nie zostało utworzone./);
});
