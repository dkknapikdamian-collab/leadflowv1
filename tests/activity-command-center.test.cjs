const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Activity exposes command center filters and search', () => {
  const source = read('src/pages/Activity.tsx');

  assert.match(source, /ACTIVITY_SOURCE_OPTIONS as sourceOptions/);
  assert.match(source, /ACTIVITY_TYPE_OPTIONS as activityTypeOptions/);
  assert.match(source, /ACTIVITY_RELATION_OPTIONS as relationOptions/);
  assert.match(source, /placeholder="Szukaj po tytule, leadzie, sprawie, typie zdarzenia\.\.\."/);
  assert.match(source, /setSourceFilter/);
  assert.match(source, /setTypeFilter/);
  assert.match(source, /setRelationFilter/);
});

test('Activity recognizes today and calendar operational event types', () => {
  const source = read('src/pages/Activity.tsx');
  const activitySource = read('src/lib/source-of-truth/activity-options.ts');

  assert.match(source, /getActivityTitle/);
  for (const eventType of [
    'calendar_entry_completed',
    'calendar_entry_restored',
    'calendar_entry_deleted',
    'today_task_completed',
    'today_task_restored',
    'today_task_deleted',
    'today_event_completed',
    'today_event_restored',
    'today_event_deleted',
  ]) {
    assert.match(activitySource, new RegExp(eventType));
  }
});

test('Activity includes metrics and payload preview', () => {
  const source = read('src/pages/Activity.tsx');

  assert.match(source, /StatShortcutCard/);
  assert.match(source, /activity-stats-grid/);
  assert.doesNotMatch(source, /function MetricCard/);
  assert.match(source, /expandedPayloadIds/);
  assert.match(source, /safePayloadPreview/);
  assert.match(source, /Poka\u017C szczeg\u00F3\u0142y techniczne/);
  assert.match(source, /Ukryj szczeg\u00F3\u0142y techniczne/);
});

test('Activity links relations to current lead and case routes', () => {
  const source = read('src/pages/Activity.tsx');

  assert.match(source, /to=\{'\/leads\/' \+ leadId\}/);
  assert.match(source, /to=\{'\/cases\/' \+ caseId\}/);
  assert.doesNotMatch(source, /\/case\//);
});

test('Activity command center documentation exists', () => {
  const doc = read('docs/ACTIVITY_COMMAND_CENTER_2026-04-24.md');

  assert.match(doc, /Activity command center/);
  assert.match(doc, /wyszukiwark\u0119/);
  assert.match(doc, /calendar_entry_completed/);
  assert.match(doc, /today_event_deleted/);
});
