const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error('STAGE231B0_R15_R3_POLISH_ENCODING FAIL: ' + message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + file);
  return fs.readFileSync(file, 'utf8');
}

const scopedFiles = [
  'src/pages/ClientDetail.tsx',
  'src/styles/visual-stage12-client-detail-vnext.css',
  'src/styles/closeflow-unified-page-canvas-stage211c.css',
  '_project/runs/2026-06-10_STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL.md',
  '_project/obsidian_updates/2026-06-10_STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH.md',
];

const forbiddenFragments = [
  '\uFFFD',
  'Å',
  'Ä',
  'Ã',
  'Â',
  'â€™',
  'â€œ',
  'â€',
  'Ä…',
  'Ä‡',
  'Ä™',
  'Å‚',
  'Å„',
  'Ã³',
  'Å›',
  'Åº',
  'Å¼',
  'Å»',
  'Åš',
  'Å¹',
  'Å»',
  'Å¼',
];

for (const file of scopedFiles) {
  const text = read(file);

  for (const bad of forbiddenFragments) {
    if (text.includes(bad)) {
      fail(`${file} contains mojibake/replacement fragment: ${JSON.stringify(bad)}`);
    }
  }
}

const client = read('src/pages/ClientDetail.tsx');

const requiredPolishPhrases = [
  'Ładowanie klienta',
  'Nie znaleziono klienta',
  'Wróć do klientów',
  'KARTOTEKA KLIENTA',
  'Ścieżka klienta',
  'Źródło:',
  'Aktywność klienta',
  'Otwórz sprawę',
  'Sprawy zamknięte',
  'Przywróć sprawę',
  'SPRAWA ZAMKNIĘTA',
  'Pokaż sprawy',
];

for (const phrase of requiredPolishPhrases) {
  if (!client.includes(phrase)) {
    fail('ClientDetail missing expected Polish phrase: ' + phrase);
  }
}

console.log('STAGE231B0_R15_R3_POLISH_ENCODING PASS');
