const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const today = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');
const component = fs.readFileSync(path.join(root, 'src/components/work-item-card.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/work-item-card.css'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function requireSource(source, fragment, message = fragment) {
  assert.ok(source.includes(fragment), `Missing source fragment: ${message}`);
}

function count(source, fragment) {
  return source.split(fragment).length - 1;
}

test('Stage116 Today task/event cards use WorkItemCard source-of-truth', () => {
  requireSource(today, 'STAGE116_TODAY_WORK_ITEM_CARD_SOURCE_TRUTH');
  requireSource(today, "import WorkItemCard, { getWorkItemCardStatusTone } from '../components/work-item-card';");
  requireSource(today, "function isTodayWorkItemOverdue(momentRaw: string, status: unknown, todayKey: string)");
  requireSource(today, "function getTodayWorkItemStatusLabel(kind: 'task' | 'event', status: unknown, momentRaw: string, todayKey: string)");
  requireSource(today, "function getTodayWorkItemTone(status: unknown, momentRaw: string, todayKey: string)");
  requireSource(today, "if (isTodayWorkItemOverdue(momentRaw, status, todayKey)) return 'Zaległe';");
  requireSource(today, "if (isClosedStatus(status)) return 'Zrobione';");
  requireSource(today, 'const handleMarkTaskDone = useCallback(async (taskId: string)');
  requireSource(today, "await updateTaskInSupabase({ id: taskId, status: 'done' } as any)");
  requireSource(today, "setActionPendingId(`event-done:${eventId}`)");

  assert.ok(count(today, '<WorkItemCard') >= 3, 'TodayStable must render WorkItemCard for tasks, events and next-7 work rows');
  requireSource(today, 'kind="task"');
  requireSource(today, 'kind="event"');
  requireSource(today, "statusLabel={getTodayWorkItemStatusLabel('task', task?.status, momentRaw, todayKey)}");
  requireSource(today, "statusLabel={getTodayWorkItemStatusLabel('event', event?.status, momentRaw, todayKey)}");
  requireSource(today, 'statusLabel={getTodayWorkItemStatusLabel(row.kind, row.status, row.momentRaw, todayKey)}');
  requireSource(today, 'onDone={() => void handleMarkTaskDone(String(task.id || ');
  requireSource(today, 'onDone={() => void handleMarkEventDone(String(event.id || ');
  requireSource(today, "onDone={() => row.kind === 'task' ? void handleMarkTaskDone(row.rawId || '') : void handleMarkEventDone(row.rawId || '')}");

  requireSource(component, 'data-stage116-today-work-item-card-source-truth="true"');
  requireSource(component, "export type WorkItemCardKind = 'task' | 'event';");
  requireSource(component, "export type WorkItemCardTone = 'neutral' | 'danger' | 'success';");
  requireSource(component, 'Zadanie');
  requireSource(component, 'Wydarzenie');
  requireSource(component, 'Zrobione');
  requireSource(component, 'data-work-item-tone={tone}');
  requireSource(component, 'data-work-item-completed={completed ?');
  requireSource(component, 'data-stage116-work-item-done-action="true"');

  requireSource(css, 'STAGE116_TODAY_WORK_ITEM_CARD_SOURCE_TRUTH');
  requireSource(css, ".cf-work-item-card[data-work-item-tone='danger']");
  requireSource(css, ".cf-work-item-card[data-work-item-tone='success']");
  requireSource(css, ".cf-work-item-card[data-work-item-completed='true']");

  assert.equal(
    packageJson.scripts['check:stage116-today-work-item-card-source-truth'],
    'node --test tests/stage116-today-work-item-card-source-truth.test.cjs',
  );
});
