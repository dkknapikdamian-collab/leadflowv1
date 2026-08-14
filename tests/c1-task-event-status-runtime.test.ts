import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isEventStatusClosed,
  isTaskOrEventStatusClosed,
  isTaskOrEventStatusCompleted,
  isTaskStatusClosed,
  normalizeEventStatus,
  normalizeTaskStatus,
} from '../src/lib/domain-statuses';
import { isTodayWorkItemClosed } from '../src/lib/source-of-truth/today-work-item-status';
import { isTaskDisplayClosed, isTaskStableGroupClosedCompat } from '../src/lib/source-of-truth/task-display-status';
import { isClosedWorkItemStatus } from '../src/lib/work-items/planned-actions';

test('C1 canonical task/event owner preserves aliases and closed semantics', () => {
  assert.equal(normalizeTaskStatus('completed'), 'done');
  assert.equal(normalizeTaskStatus('cancelled'), 'canceled');
  assert.equal(normalizeEventStatus('completed'), 'done');
  assert.equal(normalizeEventStatus('cancelled'), 'canceled');

  for (const status of ['done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed']) {
    assert.equal(isTaskOrEventStatusClosed(status), true, status);
    assert.equal(isTaskStatusClosed(status), true, `task:${status}`);
    assert.equal(isEventStatusClosed(status), true, `event:${status}`);
    assert.equal(isTodayWorkItemClosed(status), true, `today:${status}`);
    assert.equal(isTaskDisplayClosed(status), true, `display:${status}`);
    assert.equal(isTaskStableGroupClosedCompat(status), true, `group:${status}`);
    assert.equal(isClosedWorkItemStatus(status), true, `planned:${status}`);
  }

  for (const status of ['todo', 'scheduled', 'in_progress', 'unknown', '']) {
    assert.equal(isTaskOrEventStatusClosed(status), false, status);
    assert.equal(isTaskStatusClosed(status), false, `task:${status}`);
    assert.equal(isEventStatusClosed(status), false, `event:${status}`);
    assert.equal(isTodayWorkItemClosed(status), false, `today:${status}`);
    assert.equal(isTaskDisplayClosed(status), false, `display:${status}`);
    assert.equal(isClosedWorkItemStatus(status), false, `planned:${status}`);
  }
});

test('C1 completed display semantics remain distinct from cancellation/deletion closure', () => {
  for (const status of ['done', 'completed', 'complete', 'finished', 'closed', 'archived', 'zrobione', 'wykonane']) {
    assert.equal(isTaskOrEventStatusCompleted(status), true, status);
  }
  for (const status of ['cancelled', 'canceled', 'deleted', 'removed', 'todo']) {
    assert.equal(isTaskOrEventStatusCompleted(status), false, status);
  }
});
