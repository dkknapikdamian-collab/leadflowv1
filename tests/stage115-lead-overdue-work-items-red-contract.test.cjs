const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leadDetail = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const leadCss = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function requireSource(source, fragment, message = fragment) {
  assert.ok(source.includes(fragment), `Missing source fragment: ${message}`);
}

function getFunctionSource(name) {
  const start = leadDetail.indexOf(`function ${name}`);
  assert.notEqual(start, -1, `${name} must exist`);
  const nextFunction = leadDetail.indexOf('\nfunction ', start + 1);
  const end = nextFunction === -1 ? leadDetail.length : nextFunction;
  return leadDetail.slice(start, end);
}

function getBuildTimelineSource() {
  const start = leadDetail.indexOf('function buildTimeline(tasks: any[], events: any[]): TimelineEntry[]');
  assert.notEqual(start, -1, 'buildTimeline must exist');
  const end = leadDetail.indexOf('function LeadActionButton', start);
  assert.notEqual(end, -1, 'buildTimeline must end before LeadActionButton');
  return leadDetail.slice(start, end);
}

test('Stage115D marks overdue lead work items red and removes mojibake separators', () => {
  requireSource(leadDetail, 'STAGE115D_LEAD_OVERDUE_WORK_ITEMS_RED_CONTRACT');
  requireSource(leadDetail, 'isOverdue: boolean;');

  const overdueHelper = getFunctionSource('isWorkItemOverdue');
  assert.match(overdueHelper, /asDate\(dateValue\)/);
  assert.match(overdueHelper, /isDoneStatus\(status\)/);
  assert.match(overdueHelper, /parsed\.getTime\(\) < Date\.now\(\)/);

  const taskStatus = getFunctionSource('taskStatusLabel');
  assert.match(taskStatus, /dateValue\?: unknown/);
  assert.match(taskStatus, /if \(isWorkItemOverdue\(dateValue, normalized\)\) return 'Zaległe';/);

  const statusClass = getFunctionSource('statusClass');
  assert.match(statusClass, /dateValue\?: unknown/);
  assert.match(statusClass, /lead-detail-pill-danger/);

  const timeline = getBuildTimelineSource();
  assert.match(timeline, /const isOverdue = isWorkItemOverdue\(dateValue, status\);/);
  assert.match(timeline, /statusLabel: taskStatusLabel\(status, dateValue\)/);
  assert.match(timeline, /statusLabel: eventStatusLabel\(status, dateValue\)/);
  assert.match(timeline, /isOverdue,/);

  requireSource(leadDetail, 'data-lead-work-item-overdue={entry.isOverdue ?');
  requireSource(leadDetail, "statusClass(entry.status, entry.dateValue)");
  requireSource(leadDetail, "statusClass(nextTimelineEntry.status, nextTimelineEntry.dateValue)");
  requireSource(leadDetail, "${nextTimelineEntry.title} • ${nextTimelineEntry.statusLabel} • ${nextTimelineEntry.dateLabel}");
  requireSource(leadDetail, "{nextTimelineEntry.statusLabel} • {nextTimelineEntry.dateLabel}");
  assert.doesNotMatch(leadDetail, /â”¬Ě/);

  requireSource(leadCss, 'STAGE115D_LEAD_OVERDUE_WORK_ITEMS_RED_CONTRACT');
  requireSource(leadCss, '.lead-detail-pill-danger');
  requireSource(leadCss, '.lead-detail-work-row-overdue');
  requireSource(leadCss, '#b91c1c');

  assert.equal(
    packageJson.scripts['check:stage115d-lead-overdue-work-items-red-contract'],
    'node --test tests/stage115-lead-overdue-work-items-red-contract.test.cjs',
  );
});
