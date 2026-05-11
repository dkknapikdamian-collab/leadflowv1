const fs = require('fs');
const path = require('path');

const root = process.cwd();
const leadPath = path.join(root, 'src/pages/LeadDetail.tsx');
const packagePath = path.join(root, 'package.json');
const docPath = path.join(root, 'docs/quality/CLOSEFLOW_LEAD_DETAIL_POLISH_COPY_2026-05-11.md');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}

function s(...codes) {
  return String.fromCharCode(...codes);
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function applySequenceRepairs(text) {
  const repairs = [
    [s(0x253c, 0x00e9), 'ł'],
    [s(0x253c, 0x00fc), 'Ł'],
    [s(0x253c, 0x2557), 'Ż'],
    [s(0x253c, 0x255d), 'ż'],
    [s(0x253c, 0x2551), 'ź'],
    [s(0x253c, 0x2563), 'Ź'],
    [s(0x253c, 0x00e4), 'ń'],
    [s(0x253c, 0x0164), 'ś'],
    [s(0x2500, 0x00d6), 'ę'],
    [s(0x2500, 0x00e7), 'ć'],
    [s(0x2500, 0x016f), 'ą'],
    [s(0x251c, 0x2502), 'ó'],
    ['\u0139\u201a', 'ł'],
    ['\u0139\u201e', 'ń'],
    ['\u0139\u203a', 'ś'],
    ['\u0139\u015b', 'ś'],
    ['\u0139\u017a', 'ź'],
    ['\u0139\u017c', 'ż'],
    ['\u0139\u015a', 'Ś'],
    ['\u0139\u0179', 'Ź'],
    ['\u0139\u00bc', 'ż'],
    ['\u0139\u00ba', 'ź'],
    ['\u0102\u0142', 'ó'],
    ['\u0102\u201c', 'Ó'],
    ['\u0102\u00b3', 'ó'],
    ['\u00c4\u2026', 'ą'],
    ['\u00c4\u2021', 'ć'],
    ['\u00c4\u2122', 'ę'],
    ['\u00c4\u0085', 'ą'],
    ['\u00c4\u0087', 'ć'],
    ['\u00c4\u0099', 'ę'],
    ['\u00c3\u00b3', 'ó'],
    ['\u00c2\u00a0', ' '],
    ['\u00e2\u20ac\u201d', '-'],
    ['\u00e2\u20ac\u201c', '-'],
    ['\u00e2\u20ac\u017d', '"'],
    ['\u00e2\u20ac\u017c', '"'],
    ['\u00e2\u20ac\u2122', "'"],
    ['\u00e2\u20ac\u02dc', "'"],
    ['\u00ef\u00bb\u00bf', ''],
  ];

  let next = text;
  for (const [from, to] of repairs) {
    next = replaceAll(next, from, to);
  }
  return next;
}

function applyTargetedTextRepairs(text) {
  const repairs = [
    ['Rozpocznij obsługe', 'Rozpocznij obsługę'],
    ['Rozpocznij obsługę', 'Rozpocznij obsługę'],
    ['Ten temat jest już w obsłudze', 'Ten temat jest już w obsłudze'],
    ['Otwórz sprawę', 'Otwórz sprawę'],
    ['Oferta wysłana', 'Oferta wysłana'],
    ['Czeka na odpowiedź', 'Czeka na odpowiedź'],
    ['Przeniesiony do obsługi', 'Przeniesiony do obsługi'],
    ['Codzieńie', 'Codziennie'],
    ['Co tydzień', 'Co tydzień'],
    ['Co miesiąc', 'Co miesiąc'],
    ['Brak zródła', 'Brak źródła'],
    ['Brak zrodla', 'Brak źródła'],
    ['Brak źródła', 'Brak źródła'],
    ['Źródło', 'Źródło'],
    ['Zaliczka wpłacona', 'Zaliczka wpłacona'],
    ['Częściowo opłacone', 'Częściowo opłacone'],
    ['Opłacone', 'Opłacone'],
    ['Czeka na płatność', 'Czeka na płatność'],
    ['Brak wpłaty', 'Brak wpłaty'],
    ['Dodano notatkę', 'Dodano notatkę'],
    ['Utworzono sprawę', 'Utworzono sprawę'],
    ['Podpięto sprawę', 'Podpięto sprawę'],
    ['Ten temat jest już w obsłudze', 'Ten temat jest już w obsłudze'],
    ['Usunięto zadanie', 'Usunięto zadanie'],
    ['Usunięto wydarzenie', 'Usunięto wydarzenie'],
    ['Aktywność', 'Aktywność'],
    ['Zadanie bez tytułu', 'Zadanie bez tytułu'],
    ['Wydarzenie bez tytułu', 'Wydarzenie bez tytułu'],
    ['Ładowanie leada...', 'Ładowanie leada...'],
    ['Ładowanie leada', 'Ładowanie leada'],
    ['LEAD JUŻ W OBSŁUDZE', 'LEAD JUŻ W OBSŁUDZE'],
    ['Powiązana sprawa', 'Powiązana sprawa'],
    ['Dalszą pracę prowadź w sprawie', 'Dalszą pracę prowadź w sprawie'],
    ['Nie udało się pobrać danych leada', 'Nie udało się pobrać danych leada'],
    ['Błąd odczytu leada', 'Błąd odczytu leada'],
    ['Blad odczytu leada', 'Błąd odczytu leada'],
    ['Nie udalo sie pobrac danych leada', 'Nie udało się pobrać danych leada'],
    ['Ladowanie leada...', 'Ładowanie leada...'],
    ['Ladowanie leada', 'Ładowanie leada'],
    ['LEAD JUZ W OBSLUDZE', 'LEAD JUŻ W OBSŁUDZE'],
    ['LEAD JUŻ W OBSLUDZE', 'LEAD JUŻ W OBSŁUDZE'],
    ['LEAD JUZ W OBSŁUDZE', 'LEAD JUŻ W OBSŁUDZE'],
    ['Powieazana sprawa', 'Powiązana sprawa'],
    ['Powiazana sprawa', 'Powiązana sprawa'],
    ['Ten temat jest juz w obsludze', 'Ten temat jest już w obsłudze'],
    ['Ten temat jest już w obsludze', 'Ten temat jest już w obsłudze'],
    ['Dalsza prace prowadz w sprawie', 'Dalszą pracę prowadź w sprawie'],
    ['Oferta wyslana', 'Oferta wysłana'],
    ['Czeka na odpowiedz', 'Czeka na odpowiedź'],
    ['Przeniesiony do obslugi', 'Przeniesiony do obsługi'],
    ['Rozpocznij obsluge', 'Rozpocznij obsługę'],
    ['Otworz sprawe', 'Otwórz sprawę'],
    ['Zaliczka wplacona', 'Zaliczka wpłacona'],
    ['Czesciowo oplacone', 'Częściowo opłacone'],
    ['Oplacone', 'Opłacone'],
    ['Czeka na platnosc', 'Czeka na płatność'],
    ['Brak wplaty', 'Brak wpłaty'],
    ['Dodano notatke', 'Dodano notatkę'],
    ['Utworzono sprawe', 'Utworzono sprawę'],
    ['Podpieto sprawe', 'Podpięto sprawę'],
    ['Usunieto zadanie', 'Usunięto zadanie'],
    ['Usunieto wydarzenie', 'Usunięto wydarzenie'],
    ['Aktywnosc', 'Aktywność'],
    ['Zadanie bez tytulu', 'Zadanie bez tytułu'],
    ['Wydarzenie bez tytulu', 'Wydarzenie bez tytułu'],
  ];
  let next = text;
  for (const [from, to] of repairs) {
    next = replaceAll(next, from, to);
  }
  return next;
}

function badCodeSet() {
  return new Set([
    0x0139, 0x00c4, 0x0102, 0x00c2, 0x00c3, 0x00e2, 0xfffd,
    0x253c, 0x2500, 0x251c, 0x2502, 0x2551, 0x255d, 0x2563,
    0x2557, 0x255a, 0x2569, 0x2550,
  ]);
}

function collectFindings(text, limit = 200) {
  const bad = badCodeSet();
  const findings = [];
  const lines = text.split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    for (let i = 0; i < line.length; i += 1) {
      const code = line.charCodeAt(i);
      if (!bad.has(code)) continue;
      findings.push({
        line: lineIndex + 1,
        column: i + 1,
        code: `U+${code.toString(16).toUpperCase().padStart(4, '0')}`,
        snippet: line.slice(Math.max(0, i - 45), Math.min(line.length, i + 120)),
      });
      if (findings.length >= limit) return findings;
    }
  }
  return findings;
}

function assertClean(text) {
  const findings = collectFindings(text, Number(process.env.CLOSEFLOW_LEAD_COPY_MAX_OUTPUT || 200));
  if (findings.length) {
    console.error('CLOSEFLOW_LEAD_COPY_1_POLISH_COPY_REPAIR6_FAILED');
    console.error(`found=${findings.length}`);
    for (const f of findings) {
      console.error(`${f.line}:${f.column}:${f.code} ${f.snippet}`);
    }
    process.exit(1);
  }
}

function updatePackageJson() {
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:closeflow-lead-detail-polish-copy'] = 'node scripts/check-closeflow-lead-detail-polish-copy.cjs';
  write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function writeDoc() {
  const doc = [
    '# CLOSEFLOW LEAD DETAIL POLISH COPY 2026-05-11',
    '',
    'Status: LEAD-COPY-1 repair6.',
    '',
    'Cel:',
    '- wyczyscic widoczne bledy polskich znakow w src/pages/LeadDetail.tsx,',
    '- blokowac klasyczne oraz konsolowe sekwencje mojibake w karcie leada,',
    '- raportowac wieksza paczke miejsc, domyslnie do 200 trafien.',
    '',
    'Guard:',
    '- npm run check:closeflow-lead-detail-polish-copy',
    '- sprawdza tylko src/pages/LeadDetail.tsx,',
    '- detekcja jest oparta na kodach Unicode, nie na literalnych popsutych znakach w plikach narzedziowych.',
    '',
    'Zakres:',
    '- karta leada,',
    '- komunikaty i etykiety w LeadDetail,',
    '- statusy, zrodlo, platnosci, aktywnosci, service handoff.',
    '',
    'Poza zakresem:',
    '- globalne stare skrypty naprawcze,',
    '- ETAP9,',
    '- migracje danych.',
    '',
  ].join('\n');
  write(docPath, doc);
}

let text = read(leadPath);
for (let i = 0; i < 6; i += 1) {
  const before = text;
  text = applySequenceRepairs(text);
  text = applyTargetedTextRepairs(text);
  if (text === before) break;
}
assertClean(text);
write(leadPath, text);
updatePackageJson();
writeDoc();

console.log('CLOSEFLOW_LEAD_COPY_1_POLISH_COPY_REPAIR6_OK');
