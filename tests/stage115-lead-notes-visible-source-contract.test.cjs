const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leadDetail = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');

function requireSource(fragment, message = fragment) {
  assert.ok(leadDetail.includes(fragment), `Missing LeadDetail source fragment: ${message}`);
}

function getEntityContactCardSource() {
  const start = leadDetail.indexOf('<EntityContactCard');
  assert.notEqual(start, -1, 'LeadDetail must render EntityContactCard');
  const end = leadDetail.indexOf('/>', start);
  assert.notEqual(end, -1, 'EntityContactCard JSX must be self-closing in LeadDetail');
  return leadDetail.slice(start, end + 2);
}

test('Stage115B renders lead notes as a separate source section, not inside contact card', () => {
  assert.match(leadDetail, /const\s+leadSourceNoteText\s*=\s*useMemo/);
  assert.match(leadDetail, /const\s+leadNoteActivityItems\s*=\s*useMemo/);
  assert.match(leadDetail, /const\s+leadPrimaryNoteText\s*=\s*useMemo/);

  requireSource('data-stage115-lead-notes-section="true"');
  requireSource("data-lead-primary-note-text={leadPrimaryNoteText ? 'true' : 'false'}");
  requireSource('<h2>Notatki leada</h2>');
  requireSource('data-lead-source-note="true"');
  requireSource('data-lead-activity-note="true"');
  requireSource('data-lead-notes-empty="true"');

  const contactCardSource = getEntityContactCardSource();
  assert.match(contactCardSource, /dataStage="stage115-lead-contact-client-parity"/);
  assert.doesNotMatch(contactCardSource, /note\s*=/);
  assert.doesNotMatch(contactCardSource, /leadPrimaryNoteText/);
  assert.doesNotMatch(contactCardSource, /data-entity-contact-note/);

  requireSource('asText(lead?.note)');
  requireSource('asText(lead?.notes)');
  requireSource('asText(lead?.noteText)');
  requireSource('asText(lead?.note_text)');
  requireSource("type === 'note_added'");
  requireSource('payload?.content');
  requireSource('dateLabel: formatDateTime');
});
