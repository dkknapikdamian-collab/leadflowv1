import assert from 'node:assert/strict';
import { normalizeTask, normalizeEvent, normalizeLead, normalizeCase, dateOnly } from '../src/lib/record-normalizers.ts';

const task = normalizeTask({ id: 't1', title: 'Telefon', dueAt: '2026-04-27T10:00:00+02:00', lead_id: 'l1' });
assert.equal(task.id, 't1');
assert.equal(task.date, '2026-04-27');
assert.equal(task.leadId, 'l1');

const event = normalizeEvent({ id: 'e1', title: 'Spotkanie', start_at: '2026-04-28T12:00:00+02:00', case_id: 'c1' });
assert.equal(event.startAt, '2026-04-28T12:00:00+02:00');
assert.equal(event.date, '2026-04-28');
assert.equal(event.caseId, 'c1');

const lead = normalizeLead({ id: 'l1', title: 'Pan Marek', value: '1200', linked_case_id: 'c1', riskLevel: 'high' });
assert.equal(lead.name, 'Pan Marek');
assert.equal(lead.dealValue, 1200);
assert.equal(lead.linkedCaseId, 'c1');
assert.equal(lead.isAtRisk, true);

const caseItem = normalizeCase({ id: 'c1', name: 'Obsługa klienta', client_name: 'Marek', completeness_percent: 35 });
assert.equal(caseItem.title, 'Obsługa klienta');
assert.equal(caseItem.clientName, 'Marek');
assert.equal(caseItem.completenessPercent, 35);

assert.equal(dateOnly('2026-04-26T22:00:00+02:00'), '2026-04-26');
console.log('record-normalizers.test.ts OK');
