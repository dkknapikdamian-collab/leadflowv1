const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const ROOT = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

test('Stage9 adds manual smoke prompts for every required AI query path', () => {
  const ui = read('src/components/TodayAiAssistant.tsx');
  for (const prompt of [
    'Co mam jutro?',
    'Czy jutro o 17 co\u015B mam?',
    'Czy w przeci\u0105gu 4 godzin mam spotkanie?',
    'Na kiedy mam najbli\u017Cszy akt notarialny?',
    'Znajd\u017A numer do Marka.',
    'Zapisz zadanie jutro 12 rozgraniczenie.',
  ]) {
    assert.ok(ui.includes(prompt), 'missing prompt: ' + prompt);
  }
  assert.match(ui, /data-assistant-smoke-prompts="STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1"/);
  assert.match(ui, /askAssistant\(prompt\)/);
});

test('Stage9 keeps frontend on the single Stage8 API client', () => {
  const ui = read('src/components/TodayAiAssistant.tsx');
  assert.match(ui, /askAssistantQueryApi/);
  assert.doesNotMatch(ui, /fetch\(["']\/api\/assistant\/query["']/);
});

test('Stage9 exposes visible mode and data truth cues in UI', () => {
  const ui = read('src/components/TodayAiAssistant.tsx');
  assert.match(ui, /data-assistant-result-mode=\{result\.mode\}/);
  assert.match(ui, /data-assistant-mode=\{result\.mode\}/);
  assert.match(ui, /Odczyt z danych aplikacji/);
  assert.match(ui, /Szkic do sprawdzenia/);
  assert.match(ui, /Brak danych w aplikacji/);
  assert.match(ui, /data-assistant-snapshot-count=\{snapshotItemsCount\}/);
});

test('Stage9 scripts are registered and package.json stays valid JSON without BOM', () => {
  const raw = fs.readFileSync(path.join(ROOT, 'package.json'));
  assert.notStrictEqual(raw[0], 0xef, 'package.json starts with BOM byte');
  const pkg = JSON.parse(raw.toString('utf8'));
  assert.strictEqual(pkg.scripts['check:stage9-ai-assistant-ui-smoke-prompts-v1'], 'node scripts/check-stage9-ai-assistant-ui-smoke-prompts.cjs');
  assert.strictEqual(pkg.scripts['test:stage9-ai-assistant-ui-smoke-prompts-v1'], 'node --test tests/stage9-ai-assistant-ui-smoke-prompts.test.cjs');
});
