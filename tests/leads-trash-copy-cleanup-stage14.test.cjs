const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.resolve(__dirname, '..');
const leadsPath = path.join(repo, 'src', 'pages', 'Leads.tsx');
const docsPath = path.join(repo, 'docs', 'STAGE14_LEADS_TRASH_COPY_CLEANUP_2026-04-28.md');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('Stage14 removes dead trash explanation copy from Leads trash view', () => {
  const source = read(leadsPath);
  assert.match(source, /LEADS_TRASH_COPY_REMOVED_STAGE14/);
  assert.doesNotMatch(source, /To jest kosz lead\u00F3w\. Rekordy s\u0105 ukryte z aktywnej listy, ale mo\u017Cna je przywr\u00F3ci\u0107\. Nie kasujemy ich trwale w V1\./u);
  assert.doesNotMatch(source, /Nie kasujemy ich trwale w V1/u);
});

test('Stage14 keeps trash functionality labels without the old V1 explainer', () => {
  const source = read(leadsPath);
  assert.match(source, /Kosz/u);
  assert.match(source, /Poka\u017C aktywne/u);
  assert.match(source, /Kosz lead\u00F3w jest pusty/u);
  assert.match(source, /Przeniesione do kosza leady pojawi\u0105 si\u0119 tutaj\./u);
});

test('Stage14 documentation exists and Polish encoding is clean', () => {
  assert.ok(fs.existsSync(docsPath), 'Stage14 documentation is missing');
  const combined = read(leadsPath) + '\n' + read(docsPath);
  for (const mark of ['\u00c4', '\u0139', '\u00c5', '\u00c3']) {
    assert.ok(!combined.includes(mark), `Possible mojibake detected: ${mark}`);
  }
});
