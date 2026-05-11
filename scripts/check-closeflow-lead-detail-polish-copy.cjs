const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/pages/LeadDetail.tsx');
const text = fs.readFileSync(file, 'utf8');

const badCodes = new Set([
  0x0139, 0x00c4, 0x0102, 0x00c2, 0x00c3, 0x00e2, 0xfffd,
  0x253c, 0x2500, 0x251c, 0x2502, 0x2551, 0x255d, 0x2563,
  0x2557, 0x255a, 0x2569, 0x2550,
]);

const required = [
  'Oferta wysłana',
  'Czeka na odpowiedź',
  'Przeniesiony do obsługi',
  'Brak źródła',
  'Źródło',
  'Zaliczka wpłacona',
  'Częściowo opłacone',
  'Czeka na płatność',
  'Dodano notatkę',
  'Utworzono sprawę',
  'Podpięto sprawę',
  'Aktywność',
  'Ładowanie leada',
  'LEAD JUŻ W OBSŁUDZE',
];

const findings = [];
const maxOutput = Number(process.env.CLOSEFLOW_LEAD_COPY_MAX_OUTPUT || 200);
const lines = text.split(/\r?\n/);
for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
  const line = lines[lineIndex];
  for (let i = 0; i < line.length; i += 1) {
    const code = line.charCodeAt(i);
    if (!badCodes.has(code)) continue;
    findings.push({
      line: lineIndex + 1,
      column: i + 1,
      code: `U+${code.toString(16).toUpperCase().padStart(4, '0')}`,
      snippet: line.slice(Math.max(0, i - 45), Math.min(line.length, i + 120)),
    });
    if (findings.length >= maxOutput) break;
  }
  if (findings.length >= maxOutput) break;
}

const missing = required.filter((item) => !text.includes(item));

if (findings.length || missing.length) {
  console.error('CLOSEFLOW_LEAD_DETAIL_POLISH_COPY_CHECK_FAILED');
  console.error(`found=${findings.length}`);
  console.error(`missing=${missing.length}`);
  if (missing.length) console.error(`missing_required=${missing.join(' | ')}`);
  for (const f of findings) {
    console.error(`${f.line}:${f.column}:${f.code} ${f.snippet}`);
  }
  process.exit(1);
}

console.log('CLOSEFLOW_LEAD_DETAIL_POLISH_COPY_CHECK_OK');
console.log('target=src/pages/LeadDetail.tsx');
console.log(`required=${required.length}`);
console.log('max_report=200');
