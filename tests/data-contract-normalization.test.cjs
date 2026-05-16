const test = require('node:test');
const assert = require('node:assert/strict');

(async () => {
  const mod = await import('../src/lib/work-items/normalize.ts');

  test('normalizeTaskV1 maps legacy aliases into canonical fields', () => {
    const row = {
      id: 't1',
      title: 'Task',
      dueAt: '2026-05-06T10:00:00.000Z',
      lead_id: 'l1',
      case_id: 'c1',
      client_id: 'cl1',
      workspace_id: 'w1',
      created_at: '2026-05-06T08:00:00.000Z',
      updated_at: '2026-05-06T09:00:00.000Z',
    };
    const task = mod.normalizeTaskV1(row);
    assert.equal(task.scheduledAt, '2026-05-06T10:00:00.000Z');
    assert.equal(task.leadId, 'l1');
    assert.equal(task.caseId, 'c1');
    assert.equal(task.clientId, 'cl1');
    assert.equal(task.workspaceId, 'w1');
    assert.equal(task.createdAt, '2026-05-06T08:00:00.000Z');
    assert.equal(task.updatedAt, '2026-05-06T09:00:00.000Z');
  });

  test('normalizeEventV1 maps legacy aliases into canonical fields', () => {
    const row = {
      id: 'e1',
      title: 'Event',
      start_at: '2026-05-06T12:00:00.000Z',
      end_at: '2026-05-06T13:00:00.000Z',
      lead_id: 'l1',
      case_id: 'c1',
      client_id: 'cl1',
      workspace_id: 'w1',
    };
    const event = mod.normalizeEventV1(row);
    assert.equal(event.startAt, '2026-05-06T12:00:00.000Z');
    assert.equal(event.endAt, '2026-05-06T13:00:00.000Z');
    assert.equal(event.leadId, 'l1');
    assert.equal(event.caseId, 'c1');
    assert.equal(event.clientId, 'cl1');
    assert.equal(event.workspaceId, 'w1');
  });
})();
