const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Etap 9 keeps layered AI copy without promising full external AI by default', () => {
  const billing = read('src/pages/Billing.tsx');
  const todayAssistant = read('src/components/TodayAiAssistant.tsx');
  const quickCapture = read('src/components/QuickAiCapture.tsx');

  assert.match(billing, /Asystent aplikacji i dyktowanie AI w trybie warunkowym \(provider \+ env\)/);
  assert.match(billing, /AI lokalne\/regu\u0142owe i szkice do r\u0119cznego zatwierdzenia dzia\u0142aj\u0105 tak\u017Ce bez zewn\u0119trznego modelu/);
  assert.match(billing, /Warstwy AI: lokalne\/regu\u0142owe \(bez modelu\), asystent aplikacji \(czyta dane i zapisuje szkice\), zewn\u0119trzny model dopiero po konfiguracji providera i env w Vercel\./);

  assert.match(todayAssistant, /scope: 'assistant_read_or_draft_only'/);
  assert.match(todayAssistant, /noAutoWrite: true/);
  assert.match(quickCapture, /bez automatycznego tworzenia leada, zadania ani wydarzenia/);
});
