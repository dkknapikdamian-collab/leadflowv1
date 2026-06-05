const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required file: ${rel}`);
  }
  return fs.readFileSync(file, 'utf8');
}

function fail(message) {
  console.error(`STAGE180B_SUPPORT_COPY_POLISH_GUARD_FAIL: ${message}`);
  process.exit(1);
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) fail(`${label} is missing required text: ${needle}`);
}

function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) fail(`${label} still contains forbidden text: ${needle}`);
}

function assertNoMojibakeInVisibleCopy(source, label) {
  const suspicious = ['\u0102„', '\u0102…', '\u00C4ą', '\u0102‚', '\u0102˘', '\uFFFD'];
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    const isRelevantVisibleSupportLine =
      line.includes('support') ||
      line.includes('Zgłoszenia') ||
      line.includes('Zgłoszenie') ||
      line.includes('zgłoszeń') ||
      line.includes('zgłoszenie') ||
      line.includes('zgłaszać') ||
      line.includes('odświeżeniu') ||
      line.includes('użyć') ||
      line.includes('błąd') ||
      line.includes('ręką') ||
      line.includes('Nie wiem') ||
      line.includes('Brakuje danych') ||
      line.includes('Sugeruję');

    if (!isRelevantVisibleSupportLine) return;
    if (suspicious.some((token) => line.includes(token))) {
      fail(`${label}:${index + 1} contains mojibake in support-related visible copy.`);
    }
  });
}

const support = read('src/pages/SupportCenter.tsx');
const header = read('src/components/CloseFlowPageHeaderV2.tsx');
const layout = read('src/components/Layout.tsx');

assertNotIncludes(
  support,
  'Wybierz typ sprawy i opisz temat. Formularz zapisuje zgłoszenie w jednym miejscu, zamiast rozrzucać błędy po czacie.',
  'SupportCenter.tsx',
);

for (const [needle, label] of [
  ['Zgłoszenie / sugestia', 'combined support title'],
  ['Nie działa przycisk albo zapis', 'suggested problem shortcut'],
  ['Brakuje danych po odświeżeniu', 'refresh missing data shortcut'],
  ['Sugeruję zmianę w aplikacji', 'suggestion shortcut'],
  ['Nie wiem, jak użyć funkcji', 'punctuated usage shortcut'],
  ['Co zgłaszać jako problem?', 'operational help problem title'],
  ['Jak pisać dobry błąd?', 'operational help bug title'],
  ['jeśli masz go pod ręką', 'screenshot hint'],
]) {
  assertIncludes(support, needle, `SupportCenter.tsx/${label}`);
}

assertIncludes(header, "kicker: 'ZG\u0139\u0081OSZENIA'", 'CloseFlowPageHeaderV2.tsx');
assertIncludes(header, "title: 'Zgłoszenia'", 'CloseFlowPageHeaderV2.tsx');
assertIncludes(layout, "label: 'Zgłoszenia'", 'Layout.tsx');

assertNoMojibakeInVisibleCopy(support, 'SupportCenter.tsx');
assertNoMojibakeInVisibleCopy(header, 'CloseFlowPageHeaderV2.tsx');
assertNoMojibakeInVisibleCopy(layout, 'Layout.tsx');

console.log('OK stage180b support copy polish guard scoped to visible support UI');