const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Faza 5 Etap 5.1 AI intent contract exposes read/write separation', () => {
  const source = read('src/lib/assistant-intents.ts');

  assert.match(source, /READ_ONLY_INTENTS/);
  assert.match(source, /WRITE_DRAFT_INTENTS/);
  assert.match(source, /classifyAssistantIntent/);
  assert.match(source, /shouldCreateDraftForIntent/);
  assert.doesNotMatch(source, /mayCreateFinalRecord:\s*true/);
});

test('Faza 5 Etap 5.1 fixtures lock read/search/write examples', () => {
  const source = read('src/lib/assistant-intents.ts');

  for (const phrase of [
    'Co mam jutro?',
    'Znajd\u017A numer do Marka',
    'Dorota Ko\u0142odziej',
    'Zapisz zadanie jutro 12:00 oddzwoni\u0107 do Anny',
    'Dodaj wydarzenie spotkanie z klientem jutro o 12:00',
    'Zapisz kontakt Jan Kowalski, dzwoni\u0142 w sprawie strony',
    'Zapisz to',
  ]) {
    assert.match(source, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(source, /expectedMayCreateDraft:\s*false/);
  assert.match(source, /expectedMayCreateDraft:\s*true/);
});

test('Faza 5 Etap 5.1 scripts and docs are wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const releaseDoc = read('docs/release/FAZA5_ETAP51_AI_READ_VS_DRAFT_INTENT_2026-05-04.md');
  const technicalDoc = read('docs/technical/AI_READ_VS_DRAFT_INTENT_STAGE51_2026-05-04.md');

  assert.equal(pkg.scripts['check:faza5-etap51-ai-read-vs-draft-intent'], 'node scripts/check-faza5-etap51-ai-read-vs-draft-intent.cjs');
  assert.equal(pkg.scripts['test:faza5-etap51-ai-read-vs-draft-intent'], 'node --test tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs');
  assert.match(quiet, /tests\/faza5-etap51-ai-read-vs-draft-intent\.test\.cjs/);
  assert.match(releaseDoc, /FAZA 5 - Etap 5\.1 - AI read vs draft intent/);
  assert.match(technicalDoc, /AI READ VS DRAFT INTENT STAGE51/);
});
