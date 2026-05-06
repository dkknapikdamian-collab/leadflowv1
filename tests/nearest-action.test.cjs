const test = require('node:test');
const assert = require('node:assert/strict');

(async () => {
  const mod = await import('../src/lib/nearest-action.ts');

  test('returns none when no matching planned actions exist', () => {
    const result = mod.getNearestPlannedAction({
      leadId: 'l1',
      tasks: [],
      events: [],
      now: new Date('2026-05-06T10:00:00.000Z'),
    });
    assert.equal(result.kind, null);
    assert.equal(result.status, 'none');
    assert.equal(result.at, null);
  });

  test('prefers event today over task tomorrow', () => {
    const result = mod.getNearestPlannedAction({
      leadId: 'l1',
      tasks: [{ id: 't1', title: 'Task jutro', leadId: 'l1', scheduledAt: '2026-05-07T09:00:00.000Z', status: 'todo' }],
      events: [{ id: 'e1', title: 'Event dziś', leadId: 'l1', startAt: '2026-05-06T14:00:00.000Z', status: 'scheduled' }],
      now: new Date('2026-05-06T10:00:00.000Z'),
    });
    assert.equal(result.kind, 'event');
    assert.equal(result.id, 'e1');
    assert.equal(result.status, 'today');
  });

  test('marks overdue when action is in the past', () => {
    const result = mod.getNearestPlannedAction({
      leadId: 'l1',
      tasks: [{ id: 't2', title: 'Task zaległy', leadId: 'l1', dueAt: '2026-05-05T09:00:00.000Z', status: 'todo' }],
      events: [],
      now: new Date('2026-05-06T10:00:00.000Z'),
    });
    assert.equal(result.kind, 'task');
    assert.equal(result.id, 't2');
    assert.equal(result.status, 'overdue');
  });
})();
