const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const STAGE = 'STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1';
let failed = false;

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function pass(message) {
  console.log('PASS ' + message);
}

function fail(message) {
  failed = true;
  console.error('FAIL ' + message);
}

function requireFile(rel) {
  if (fs.existsSync(path.join(ROOT, rel))) pass(rel + ' exists');
  else fail(rel + ' missing');
}

function requireContains(rel, needle) {
  const text = read(rel);
  if (text.includes(needle)) pass(rel + ' contains ' + needle);
  else fail(rel + ' missing ' + needle);
}

function requireNotContains(rel, needle) {
  const text = read(rel);
  if (!text.includes(needle)) pass(rel + ' does not contain ' + needle);
  else fail(rel + ' unexpectedly contains ' + needle);
}

function requirePackageScript(name, expected) {
  const raw = fs.readFileSync(path.join(ROOT, 'package.json'));
  if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) fail('package.json has UTF-8 BOM');
  else pass('package.json has no UTF-8 BOM');
  const pkg = JSON.parse(raw.toString('utf8'));
  if (pkg.scripts && pkg.scripts[name] === expected) pass('package.json exposes ' + name);
  else fail('package.json missing script ' + name);
}

requireFile('src/components/TodayAiAssistant.tsx');
requireFile('src/lib/assistant-query-client.ts');
requireFile('scripts/check-stage9-ai-assistant-ui-smoke-prompts.cjs');
requireFile('tests/stage9-ai-assistant-ui-smoke-prompts.test.cjs');
requireFile('docs/release/STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1_2026-05-06.md');

requireContains('src/components/TodayAiAssistant.tsx', STAGE);
requireContains('src/components/TodayAiAssistant.tsx', 'QUICK_ASSISTANT_SMOKE_PROMPTS');
requireContains('src/components/TodayAiAssistant.tsx', 'data-assistant-smoke-prompts="STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1"');
requireContains('src/components/TodayAiAssistant.tsx', 'data-assistant-smoke-prompt={prompt}');
requireContains('src/components/TodayAiAssistant.tsx', 'data-assistant-result-mode={result.mode}');
requireContains('src/components/TodayAiAssistant.tsx', 'data-assistant-mode={result.mode}');
requireContains('src/components/TodayAiAssistant.tsx', 'data-assistant-snapshot-count={snapshotItemsCount}');
requireContains('src/components/TodayAiAssistant.tsx', 'askAssistant(prompt)');
requireContains('src/components/TodayAiAssistant.tsx', 'Co mam jutro?');
requireContains('src/components/TodayAiAssistant.tsx', 'Czy jutro o 17 co\u015B mam?');
requireContains('src/components/TodayAiAssistant.tsx', 'Czy w przeci\u0105gu 4 godzin mam spotkanie?');
requireContains('src/components/TodayAiAssistant.tsx', 'Na kiedy mam najbli\u017Cszy akt notarialny?');
requireContains('src/components/TodayAiAssistant.tsx', 'Znajd\u017A numer do Marka.');
requireContains('src/components/TodayAiAssistant.tsx', 'Zapisz zadanie jutro 12 rozgraniczenie.');
requireContains('src/components/TodayAiAssistant.tsx', 'Odczyt z danych aplikacji');
requireContains('src/components/TodayAiAssistant.tsx', 'Szkic do sprawdzenia');
requireContains('src/components/TodayAiAssistant.tsx', 'Brak danych w aplikacji');
requireNotContains('src/components/TodayAiAssistant.tsx', 'fetch("/api/assistant/query"');
requireNotContains('src/components/TodayAiAssistant.tsx', "fetch('/api/assistant/query'");

requireContains('docs/release/STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1_2026-05-06.md', STAGE);
requireContains('docs/release/STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1_2026-05-06.md', 'quick smoke prompts');
requireContains('docs/release/STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1_2026-05-06.md', 'FAIL w checku blokuje commit/push');

requirePackageScript('check:stage9-ai-assistant-ui-smoke-prompts-v1', 'node scripts/check-stage9-ai-assistant-ui-smoke-prompts.cjs');
requirePackageScript('test:stage9-ai-assistant-ui-smoke-prompts-v1', 'node --test tests/stage9-ai-assistant-ui-smoke-prompts.test.cjs');

if (failed) process.exit(1);
console.log('PASS ' + STAGE);
