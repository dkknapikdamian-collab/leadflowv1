const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');

test('STAGE231G_R3 potential edit is wired to the same source of truth in card and finance panel', () => {
  assert.match(lead, /data-stage231g-potential-edit-action="true"[\s\S]*handleStartPotentialEditingStage231G/);
  assert.match(lead, /data-stage231g-finance-edit-potential="true"[\s\S]*handleStartPotentialEditingStage231G/);
  assert.ok(
    lead.includes('updateLeadInSupabase({') && lead.includes('dealValue: amount'),
    'dealValue must be saved via updateLeadInSupabase'
  );
  assert.ok(lead.includes("replace(/\\s+/g, '')"), 'potential parser must strip whitespace with /\\s+/g');
  assert.ok(!lead.includes("replace(/s+/g, '')"), 'potential parser must not use literal /s+/g');
});

test('STAGE231G_R3 missing_item is not a normal next action and uses filtered next action fallback', () => {
  assert.ok(
    lead.includes("activeLeadWorkEntries.filter((entry) => !isMissingItemTimelineEntry(entry) && (entry.kind === 'task' || entry.kind === 'event'))"),
    'leadNextActionEntries must exclude missing_item before task/event filtering'
  );
  assert.doesNotMatch(
    lead,
    /activeLeadWorkEntries\.filter\(\(entry\) => entry\.kind === 'task' \|\| entry\.kind === 'event'\)/,
    'leadNextActionEntries must not use raw task/event filter'
  );
  assert.ok(
    lead.includes('if (!nearestPlannedAction?.id) return leadNextActionEntries[0] || null;'),
    'nextTimelineEntry fallback must use filtered leadNextActionEntries'
  );
  assert.doesNotMatch(
    lead,
    /return timeline\.find\(\(entry\) => !isDoneStatus\(entry\.status\)\)/,
    'nextTimelineEntry must not fallback to full timeline'
  );
  assert.match(lead, /handleDeleteLeadMissingItemStage228R15\(entry\)/);
  assert.match(lead, /hardDeleteTaskFromSupabase\(taskId\)/);
});

test('STAGE231G_R3 work rows have separate icon content status actions blocks', () => {
  for (const marker of ['lead-detail-work-row__icon', 'lead-detail-work-row__content', 'lead-detail-work-row__status', 'lead-detail-work-row__actions']) {
    assert.ok(lead.includes(marker), 'missing work row marker: ' + marker);
  }
  assert.ok(css.includes('.lead-detail-work-row__content'));
  assert.ok(css.includes('overflow-wrap: anywhere'));
});

test('STAGE231G_R3 top cards and quick actions have real actions', () => {
  for (const marker of ['data-stage231g-next-step-action="true"', 'data-stage231g-risk-action="true"', 'data-stage231g-blocker-action="true"']) {
    assert.ok(lead.includes(marker), 'missing top card marker: ' + marker);
  }
  for (const key of ["key: 'note'", "key: 'task'", "key: 'event'", "key: 'missing'", "key: 'lost'", "key: 'service'"]) {
    assert.ok(lead.includes(key), 'missing quick action key: ' + key);
  }
});