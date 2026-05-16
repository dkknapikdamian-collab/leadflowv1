const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const caseDetailPath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');

function readSource() {
  return fs.readFileSync(caseDetailPath, 'utf8').replace(/^\uFEFF/, '');
}

test('Stage66 CaseDetail history copy uses passive Polish labels instead of broken actor grammar', () => {
  const source = readSource();
  assert.match(source, /STAGE66_CASE_HISTORY_PASSIVE_COPY/);
  assert.match(source, /Dodano brak: \$\{title\}/);
  assert.match(source, /Dodano plik: \$\{title\}/);
  assert.match(source, /Dodano notatk\u0119/);
  assert.match(source, /Dodano zadanie: \$\{title\}/);
  assert.match(source, /Dodano wydarzenie: \$\{title\}/);
  assert.match(source, /Dodano decyzj\u0119: \$\{title\}/);
  assert.match(source, /Zmieniono status zadania/);
  assert.match(source, /Zmieniono status wydarzenia/);
  assert.match(source, /Prze\u0142o\u017Cono zadanie/);
  assert.match(source, /Prze\u0142o\u017Cono wydarzenie/);

  assert.doesNotMatch(source, /\$\{actor\} doda\u0142/);
  assert.doesNotMatch(source, /\$\{actor\} podj\u0105\u0142/);
  assert.doesNotMatch(source, /\$\{actor\} zmieni\u0142/);
  assert.doesNotMatch(source, /Ty doda\u0142/);
  assert.doesNotMatch(source, /Ty podj\u0105\u0142/);
});

test('Stage66 keeps history actor metadata outside the sentence body', () => {
  const source = readSource();
  assert.match(source, /activity\.actorType === 'operator' \? 'Operator' : 'Klient'/);
  assert.match(source, /getCaseRecentMoveMeta\(activity\)/);
});
