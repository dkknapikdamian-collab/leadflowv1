const fs = require('fs');

function fail(message) {
  console.error('STAGE231B0_R15_R3_POLISH_ENCODING FAIL: ' + message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + file);
  return fs.readFileSync(file, 'utf8');
}

function lineEvidence(text, fragment) {
  const lines = text.split(/\r?\n/);
  const hits = [];
  lines.forEach((line, index) => {
    if (line.includes(fragment)) hits.push(`${index + 1}: ${line.slice(0, 260)}`);
  });
  return hits.slice(0, 20).join('\n');
}

const scopedFiles = [
  "src/pages/ClientDetail.tsx",
  "src/styles/visual-stage12-client-detail-vnext.css",
  "src/styles/closeflow-unified-page-canvas-stage211c.css",
  "_project/runs/2026-06-10_STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL.md",
  "_project/obsidian_updates/2026-06-10_STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH.md",
  "_project/runs/2026-06-10_STAGE231B0_R15_R3_CLIENT_DETAIL_WIDTH_AND_POLISH_GUARDS.md",
  "_project/obsidian_updates/2026-06-10_STAGE231B0_R15_R3_CLIENT_DETAIL_WIDTH_AND_POLISH_GUARDS.md",
  "_project/runs/2026-06-10_STAGE231B0_R15_R4_POLISH_GUARD_EOF_REPAIR.md",
  "_project/obsidian_updates/2026-06-10_STAGE231B0_R15_R4_POLISH_GUARD_EOF_REPAIR.md"
];
const forbiddenFragments = [
  "Ä…",
  "Ä„",
  "Ä‡",
  "Ä†",
  "Ä™",
  "Ä˜",
  "Å‚",
  "Ĺ‚",
  "Å",
  "Ĺ�",
  "Å�",
  "Å„",
  "Ĺ„",
  "Åƒ",
  "Ĺƒ",
  "Ã³",
  "Ăł",
  "Ã“",
  "Ă“",
  "Å›",
  "Ĺ›",
  "ÅŠ",
  "ĹŠ",
  "Åº",
  "Ĺş",
  "Ĺº",
  "Å¹",
  "Ĺą",
  "Ĺ¹",
  "Å¼",
  "ĹĽ",
  "Ĺ¼",
  "Å»",
  "Ĺ»",
  "â€™",
  "â€œ",
  "â€",
  "â€”",
  "â€“",
  "Â·",
  "Â ",
  "Â ",
  "�"
];

for (const file of scopedFiles) {
  const text = read(file);

  for (const bad of forbiddenFragments) {
    if (text.includes(bad)) {
      fail(`${file} contains encoding damage fragment ${JSON.stringify(bad)}\n${lineEvidence(text, bad)}`);
    }
  }

  if (/\n\n$/.test(text)) fail(`${file} has blank line at EOF`);
}

const client = read('src/pages/ClientDetail.tsx');

const requiredPolishPhrases = [
  'Aktywność klienta',
  'Otwórz sprawę',
  'Sprawy zamknięte',
  'Przywróć sprawę',
  'Płatność',
  'Wartość transakcji',
  'kompletność',
  'rozwiązany',
];

for (const phrase of requiredPolishPhrases) {
  if (!client.includes(phrase)) fail('ClientDetail missing expected current Polish phrase: ' + phrase);
}

console.log('STAGE231B0_R15_R3_POLISH_ENCODING PASS');
