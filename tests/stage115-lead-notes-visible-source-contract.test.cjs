const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leadDetail = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');

test('Stage115B renders lead notes as a separate source section, not inside contact card', () => {
  assert.match(leadDetail, /leadSourceNoteTexts*=s*useMemo/);
  assert.match(leadDetail, /leadNoteActivityItemss*=s*useMemo/);
  assert.match(leadDetail, /leadPrimaryNoteTexts*=s*useMemo/);
  assert.match(leadDetail, /data-stage115-lead-notes-section="true"/);
  assert.match(leadDetail, /data-lead-primary-note-text={leadPrimaryNoteText ? 'true' : 'false'}/);
  assert.match(leadDetail, />Notatki leada</);
  assert.match(leadDetail, /data-lead-source-note="true"/);
  assert.match(leadDetail, /data-lead-activity-note="true"/);
  assert.match(leadDetail, /data-lead-notes-empty="true"/);

  const contactCardMatch = leadDetail.match(/<EntityContactCard[sS]*?/>/);
  assert.ok(contactCardMatch, 'LeadDetail must render EntityContactCard');
  assert.doesNotMatch(contactCardMatch[0], /note={leadPrimaryNoteText/);
  assert.doesNotMatch(contactCardMatch[0], /data-entity-contact-note/);

  assert.match(leadDetail, /asText(lead?.note)/);
  assert.match(leadDetail, /asText(lead?.notes)/);
  assert.match(leadDetail, /asText(lead?.noteText)/);
  assert.match(leadDetail, /asText(lead?.note_text)/);
  assert.match(leadDetail, /type === 'note_added'/);
  assert.match(leadDetail, /payload?.content/);
  assert.match(leadDetail, /dateLabel: formatDateTime/);
});
