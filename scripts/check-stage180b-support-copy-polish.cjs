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
  const suspicious = ['Ă„', 'Ă…', 'Äą', 'Ă‚', 'Ă˘', 'ďż˝'];
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    const isRelevantVisibleSupportLine =
      line.includes('support') ||
      line.includes('ZgĹ‚oszenia') ||
      line.includes('ZgĹ‚oszenie') ||
      line.includes('zgĹ‚oszeĹ„') ||
      line.includes('zgĹ‚oszenie') ||
      line.includes('zgĹ‚aszaÄ‡') ||
      line.includes('odĹ›wieĹĽeniu') ||
      line.includes('uĹĽyÄ‡') ||
      line.includes('bĹ‚Ä…d') ||
      line.includes('rÄ™kÄ…') ||
      line.includes('Nie wiem') ||
      line.includes('Brakuje danych') ||
      line.includes('SugerujÄ™');

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
  'Wybierz typ sprawy i opisz temat. Formularz zapisuje zgĹ‚oszenie w jednym miejscu, zamiast rozrzucaÄ‡ bĹ‚Ä™dy po czacie.',
  'SupportCenter.tsx',
);

for (const [needle, label] of [
  ['ZgĹ‚oszenie / sugestia', 'combined support title'],
  ['Nie dziaĹ‚a przycisk albo zapis', 'suggested problem shortcut'],
  ['Brakuje danych po odĹ›wieĹĽeniu', 'refresh missing data shortcut'],
  ['SugerujÄ™ zmianÄ™ w aplikacji', 'suggestion shortcut'],
  ['Nie wiem, jak uĹĽyÄ‡ funkcji', 'punctuated usage shortcut'],
  ['Co zgĹ‚aszaÄ‡ jako problem?', 'operational help problem title'],
  ['Jak pisaÄ‡ dobry bĹ‚Ä…d?', 'operational help bug title'],
  ['jeĹ›li masz go pod rÄ™kÄ…', 'screenshot hint'],
]) {
  assertIncludes(support, needle, `SupportCenter.tsx/${label}`);
}

assertIncludes(header, "kicker: 'ZGĹOSZENIA'", 'CloseFlowPageHeaderV2.tsx');
assertIncludes(header, "title: 'ZgĹ‚oszenia'", 'CloseFlowPageHeaderV2.tsx');
assertIncludes(layout, "label: 'ZgĹ‚oszenia'", 'Layout.tsx');

assertNoMojibakeInVisibleCopy(support, 'SupportCenter.tsx');
assertNoMojibakeInVisibleCopy(header, 'CloseFlowPageHeaderV2.tsx');
assertNoMojibakeInVisibleCopy(layout, 'Layout.tsx');

console.log('OK stage180b support copy polish guard scoped to visible support UI');