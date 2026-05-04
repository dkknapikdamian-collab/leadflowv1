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
  assert.match(source, /Dodano notatkę/);
  assert.match(source, /Dodano zadanie: \$\{title\}/);
  assert.match(source, /Dodano wydarzenie: \$\{title\}/);
  assert.match(source, /Dodano decyzję: \$\{title\}/);
  assert.match(source, /Zmieniono status zadania/);
  assert.match(source, /Zmieniono status wydarzenia/);
  assert.match(source, /Przełożono zadanie/);
  assert.match(source, /Przełożono wydarzenie/);

  assert.doesNotMatch(source, /\$\{actor\} dodał/);
  assert.doesNotMatch(source, /\$\{actor\} podjął/);
  assert.doesNotMatch(source, /\$\{actor\} zmienił/);
  assert.doesNotMatch(source, /Ty dodał/);
  assert.doesNotMatch(source, /Ty podjął/);
});

test('Stage66 keeps history actor metadata outside the sentence body', () => {
  const source = readSource();
  assert.match(source, /activity\.actorType === 'operator' \? 'Operator' : 'Klient'/);
  assert.match(source, /getCaseRecentMoveMeta\(activity\)/);
});
