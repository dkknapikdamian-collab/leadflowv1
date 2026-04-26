import assert from 'node:assert/strict';
import { getNearestPlannedActionForLead, leadHasPlannedAction, labelPlannedActionSource } from '../src/lib/lead-actions.ts';

const lead = { id: 'l1', name: 'Pan Marek', status: 'new' };
const tasks = [
  { id: 't-old', title: 'Stary telefon', leadId: 'l1', status: 'done', date: '2026-04-25' },
  { id: 't1', title: 'Oddzwonić', leadId: 'l1', status: 'todo', scheduledAt: '2026-04-27T10:00:00+02:00' },
];
const events = [
  { id: 'e1', title: 'Spotkanie', leadId: 'l1', status: 'scheduled', startAt: '2026-04-28T12:00:00+02:00' },
];

const nearest = getNearestPlannedActionForLead({ lead, tasks, events, now: new Date('2026-04-26T12:00:00+02:00') });
assert.equal(nearest?.source, 'task');
assert.equal(nearest?.id, 't1');
assert.equal(leadHasPlannedAction({ lead, tasks, events }), true);
assert.equal(labelPlannedActionSource('event'), 'Wydarzenie');

const empty = getNearestPlannedActionForLead({ lead, tasks: [], events: [], includeLegacyNextAction: false });
assert.equal(empty, null);
console.log('lead-actions.test.ts OK');
