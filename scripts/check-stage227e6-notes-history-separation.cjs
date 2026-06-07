const fs = require('fs');
const path = require('path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');
const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');

function fail(message) {
  console.error('FAIL STAGE227E6_NOTES_HISTORY_SEPARATION: ' + message);
  process.exit(1);
}
function pass(message) {
  console.log('PASS ' + message);
}
function mustContain(source, fragment, label = fragment) {
  if (!source.includes(fragment)) fail('missing: ' + label);
  pass('contains: ' + label);
}
function mustNotContain(source, fragment, label = fragment) {
  if (source.includes(fragment)) fail('forbidden: ' + label);
  pass('not contains: ' + label);
}

mustContain(lead, 'STAGE227E6_NOTES_HISTORY_SEPARATION', 'stage marker');
mustContain(lead, 'data-stage227e6-notes-section="true"', 'notes section marker');
mustContain(lead, 'data-stage227e6-notes-list="true"', 'notes list marker');
mustContain(lead, '{noteItem.content}', 'notes render note body');
mustContain(lead, 'data-stage227e6-notes-history-separation="true"', 'activity history section marker');
mustContain(lead, 'Historia aktywności', 'activity history title');
mustContain(lead, 'data-stage227e6-activity-history-list="true"', 'activity history list marker');
mustContain(lead, 'data-stage227e6-activity-history-row="true"', 'activity history row marker');
mustContain(lead, 'leadActivityHistoryItems.slice(0, 8).map', 'history uses activity log items');
mustContain(lead, "title: isNoteEvent ? 'Dodano notatkę' : getActivityTitle(activity)", 'note event history title is generic');
mustContain(lead, "description: isNoteEvent ? 'Treść notatki jest widoczna w sekcji Notatki.' : getActivityDescription(activity)", 'note event history description does not repeat note body');
mustNotContain(lead, '<p>{historyItem.raw?.payload?.content}</p>', 'history raw note payload body');
mustNotContain(lead, '<p>{historyItem.content}</p>', 'history item content body');
mustNotContain(lead, 'leadActivityHistoryItems.map((noteItem)', 'history cannot render notes as notes');

mustContain(css, 'STAGE227E6_NOTES_HISTORY_SEPARATION_CSS', 'CSS marker');
mustContain(css, '.lead-detail-activity-history-section', 'history section CSS');
mustContain(css, '.lead-detail-activity-log-list', 'history list CSS');
mustContain(css, '.lead-detail-activity-log-row', 'history row CSS');

mustContain(pkg, 'check:stage227e6-notes-history-separation', 'package check script');
mustContain(pkg, 'test:stage227e6-notes-history-separation', 'package test script');

console.log('PASS STAGE227E6_NOTES_HISTORY_SEPARATION');
