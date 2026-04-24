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

  assert.match(source, /const sourceOptions = \[/);
  assert.match(source, /const activityTypeOptions = \[/);
  assert.match(source, /const relationOptions = \[/);
  assert.match(source, /placeholder="Szukaj po tytule, leadzie, sprawie, typie zdarzenia\.\.\."/);
  assert.match(source, /setSourceFilter/);
  assert.match(source, /setTypeFilter/);
  assert.match(source, /setRelationFilter/);
});

test('Activity recognizes today and calendar operational event types', () => {
  const source = read('src/pages/Activity.tsx');

  assert.match(source, /calendar_entry_completed/);
  assert.match(source, /calendar_entry_restored/);
  assert.match(source, /calendar_entry_deleted/);
  assert.match(source, /today_task_completed/);
  assert.match(source, /today_task_restored/);
  assert.match(source, /today_task_deleted/);
  assert.match(source, /today_event_completed/);
  assert.match(source, /today_event_restored/);
  assert.match(source, /today_event_deleted/);
});

test('Activity includes metrics and payload preview', () => {
  const source = read('src/pages/Activity.tsx');

  assert.match(source, /function MetricCard/);
  assert.match(source, /expandedPayloadIds/);
  assert.match(source, /safePayloadPreview/);
  assert.match(source, /PokaĹĽ szczegĂłĹ‚y techniczne/);
  assert.match(source, /Ukryj szczegĂłĹ‚y techniczne/);
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
  assert.match(doc, /wyszukiwarkÄ™/);
  assert.match(doc, /calendar_entry_completed/);
  assert.match(doc, /today_event_deleted/);
});