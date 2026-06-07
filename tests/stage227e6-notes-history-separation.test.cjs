const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');

test('Stage227E6 keeps notes as note content in notes section', () => {
  assert.match(lead, /data-stage227e6-notes-section="true"/);
  assert.match(lead, /data-stage227e6-notes-list="true"/);
  assert.match(lead, /\{noteItem\.content\}/);
});

test('Stage227E6 renders activity history as log without note body duplication', () => {
  assert.match(lead, /data-stage227e6-notes-history-separation="true"/);
  assert.match(lead, /Historia aktywności/);
  assert.match(lead, /leadActivityHistoryItems\.slice\(0, 8\)\.map/);
  assert.match(lead, /title: isNoteEvent \? 'Dodano notatkę' : getActivityTitle\(activity\)/);
  assert.match(lead, /description: isNoteEvent \? 'Treść notatki jest widoczna w sekcji Notatki\.' : getActivityDescription\(activity\)/);
  assert.doesNotMatch(lead, /historyItem\.raw\?\.payload\?\.content/);
  assert.doesNotMatch(lead, /\{historyItem\.content\}/);
});

test('Stage227E6 has CSS contract for separated history log', () => {
  assert.match(css, /STAGE227E6_NOTES_HISTORY_SEPARATION_CSS/);
  assert.match(css, /\.lead-detail-activity-history-section/);
  assert.match(css, /\.lead-detail-activity-log-list/);
  assert.match(css, /\.lead-detail-activity-log-row/);
});
