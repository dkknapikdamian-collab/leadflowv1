const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leadDetail = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function requireSource(fragment, message = fragment) {
  assert.ok(leadDetail.includes(fragment), `Missing LeadDetail source fragment: ${message}`);
}

function getHistoryNoteFormSource() {
  const start = leadDetail.indexOf('<form className="lead-detail-note-form"');
  assert.notEqual(start, -1, 'LeadDetail history note form must exist');
  const end = leadDetail.indexOf('</form>', start);
  assert.notEqual(end, -1, 'LeadDetail history note form must close');
  return leadDetail.slice(start, end + '</form>'.length);
}

test('Stage115C keeps history contact note submit inline and separates work-center modal action', () => {
  requireSource('STAGE115C_LEAD_INLINE_NOTE_SUBMIT_CONTRACT');
  requireSource('Otwórz szybki formularz notatki');
  requireSource("openLeadContextAction('note')");

  const formSource = getHistoryNoteFormSource();
  assert.match(formSource, /onSubmit=\{handleAddNote\}/);
  assert.match(formSource, /data-stage115c-inline-note-form="true"/);
  assert.match(formSource, /data-stage115c-inline-note-submit="true"/);
  assert.match(formSource, /type="submit"/);
  assert.doesNotMatch(formSource, /openLeadContextAction\('note'\)/);
  assert.doesNotMatch(formSource, /Otwórz szybki formularz notatki/);

  requireSource('Dodaj krótką notatkę po kontakcie...');
  requireSource('Dyktuj notatkę');
  requireSource('Dodaj notatkę');
  assert.doesNotMatch(leadDetail, /Dodaj krotka notatke/);
  assert.doesNotMatch(leadDetail, /Dyktuj notatk(?!ę)/);
  assert.doesNotMatch(leadDetail, /Dodaj notatk(?!ę)/);

  assert.equal(
    packageJson.scripts['check:stage115c-lead-inline-note-submit-contract'],
    'node --test tests/stage115c-lead-inline-note-submit-contract.test.cjs',
  );
});
