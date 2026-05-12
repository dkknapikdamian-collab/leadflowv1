const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}
function stripCssComments(input) {
  return input.replace(/\/\*[\s\S]*?\*\//g, '');
}
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.vercel'].includes(name)) continue;
      walk(full, out);
    } else if (/\.(tsx|ts|jsx|js|css|cjs)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

const files = [
  ...walk(path.join(repo, 'src')),
  ...walk(path.join(repo, 'tools')),
  ...walk(path.join(repo, 'scripts')),
];

const calendar = read('src/pages/Calendar.tsx');

const cssImports = [];
const importRegex = /^import\s+['"]([^'"]+\.css)['"];\s*$/gm;
let m;
while ((m = importRegex.exec(calendar))) {
  cssImports.push({
    line: calendar.slice(0, m.index).split(/\r?\n/).length,
    import: m[1],
  });
}

const calendarSignals = [];
const calendarTerms = [
  'cf-month-entry-chip-structural',
  'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3',
  'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR1',
  'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2',
  'candidate.replaceChildren',
  'querySelectorAll<HTMLElement>',
  'calendarView !==',
  'calendarScale',
  'month',
  'więcej',
  'line-through',
  'cf-entity-type-pill',
  'calendar-entry-card',
  'title=',
  'data-cf-calendar',
];
calendar.split(/\r?\n/).forEach((line, index) => {
  const hits = calendarTerms.filter((term) => line.includes(term));
  if (hits.length) {
    calendarSignals.push({
      file: 'src/pages/Calendar.tsx',
      line: index + 1,
      hits,
      text: line.trim().slice(0, 260),
    });
  }
});

const cssRiskRows = [];
const riskTerms = [
  { id: 'border-pill-card', re: /(border|rounded|shadow|ring|outline)/i },
  { id: 'fixed-height', re: /\b(height|max-height|min-height)\s*:\s*[^;]+/i },
  { id: 'line-height', re: /line-height\s*:\s*[^;]+/i },
  { id: 'white-space', re: /white-space\s*:\s*[^;]+/i },
  { id: 'overflow', re: /overflow\s*:\s*[^;]+/i },
  { id: 'position', re: /position\s*:\s*[^;]+/i },
  { id: 'transform', re: /transform\s*:\s*[^;]+/i },
  { id: 'flex-grid', re: /display\s*:\s*(flex|grid|inline-flex|inline-grid)/i },
  { id: 'negative-margin', re: /margin[-\w]*\s*:\s*-[0-9]/i },
  { id: 'line-through', re: /(line-through|text-decoration)/i },
  { id: 'important', re: /!important/i },
];

const relevantCssHints = [
  'calendar',
  'month',
  'entry',
  'chip',
  'pill',
  'event',
  'task',
  'cf-calendar',
  'cf-month-entry',
  'cf-entity-type-pill',
  'line-through',
  'visual-stage',
];

for (const file of files) {
  const rel = path.relative(repo, file).replace(/\\/g, '/');
  if (!rel.endsWith('.css') && !rel.endsWith('.tsx') && !rel.endsWith('.ts')) continue;
  const raw = fs.readFileSync(file, 'utf8');
  const scan = rel.endsWith('.css') ? stripCssComments(raw) : raw;
  let selector = '';
  scan.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (rel.endsWith('.css')) {
      if (trimmed.includes('{')) {
        selector = trimmed.slice(0, trimmed.indexOf('{')).trim() || selector;
      }
    }
    const context = `${rel} ${selector} ${trimmed}`.toLowerCase();
    const relevant = relevantCssHints.some((hint) => context.includes(hint));
    if (!relevant) return;

    const hits = riskTerms.filter((term) => term.re.test(trimmed));
    if (!hits.length) return;

    cssRiskRows.push({
      file: rel,
      line: index + 1,
      selector: selector.slice(0, 220),
      hits: hits.map((h) => h.id),
      text: trimmed.slice(0, 260),
    });
  });
}

const activeOldLayers = [];
const oldLayerTerms = [
  'visual-stage29-calendar-vnext',
  'stage34-calendar-readability-status-forms',
  'stage34b-calendar-complete-polish',
  'emergency-hotfixes',
  'closeflow-calendar-skin-only-v1',
  'closeflow-calendar-color-tooltip-v2',
  'closeflow-calendar-month-chip-overlap-fix-v1',
  'closeflow-calendar-month-rows-no-overlap-repair2',
  'closeflow-calendar-month-entry-structural-fix-v3',
];
for (const file of files) {
  const rel = path.relative(repo, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  for (const term of oldLayerTerms) {
    if (text.includes(term)) {
      activeOldLayers.push({ file: rel, term });
    }
  }
}

const packageEvidence = {
  hasStructuralCssFile: Boolean(read('src/styles/closeflow-calendar-month-entry-structural-fix-v3.css')),
  calendarImportsStructuralCss: calendar.includes("import '../styles/closeflow-calendar-month-entry-structural-fix-v3.css';"),
  hasStructuralRepair2Marker: calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12'),
  hasStructuralRepair2Effect: calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT'),
  hasReplaceChildren: calendar.includes('candidate.replaceChildren();'),
};

const diagnosis = {
  screenshotFinding: [
    'W kafelku dnia nadal widać „kafelek w kafelku”: każdy wpis ma własną ramkę/pill, a wewnątrz kolejny badge typu.',
    'Przekreślone/zakończone wpisy mają wizualnie drugą warstwę tekstu i nachodzą na następne pozycje.',
    'Mini-karty mają za małą wysokość względem line-height i dekoracji, więc w gęstym widoku miesiąca tekst dotyka kolejnej pozycji.',
    'Widok miesiąca powinien być listą lekkich linii tekstu, nie listą małych kart.'
  ],
  likelyCause: [
    'Struktura DOM i aktywne style dalej produkują wpis jako obramowany chip/pill.',
    'Nawet jeśli efekt strukturalny jest w kodzie, selector może nie trafiać w realny element albo uruchamia się za wcześnie/po złym parent scope.',
    'Wiele historycznych warstw kalendarza nadal istnieje i styluje wpisy przez klasy typu calendar/chip/entry/pill.',
    'Poprzednie CSS-y próbowały ratować istniejący DOM, ale screen pokazuje, że trzeba przestać używać mini-kafelków w miesiącu.'
  ],
  recommendation: [
    'Przestać renderować wpisy miesiąca jako chip/card/pill.',
    'Dla miesiąca zrobić osobny prosty render: plain text row.',
    'Format: mała kropka lub krótki typ + jedna linia tekstu, bez obramowania wpisu.',
    'Długi tekst: ellipsis + title na hover.',
    '+ X więcej zostaje jako osobna linia.',
    'Kolory dać subtelnie: typ/kropka/tekst, nie tło całej mini-karty.',
    'Najbezpieczniejsza poprawka: bez DOM-enhancera, bez zgadywania selectorów, bez mini-card CSS. Trzeba zmienić JSX renderu miesiąca w Calendar.tsx.'
  ],
  veto: [
    'Nie robić kolejnej warstwy CSS na .chip/.entry.',
    'Nie dodawać większej wysokości kafelka dnia jako głównej naprawy, bo to tylko ukryje problem.',
    'Nie mieszać w panelu bocznym, tygodniu, API, Supabase ani handlerach.'
  ]
};

const report = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT_2026_05_12',
  packageEvidence,
  diagnosis,
  cssImports,
  activeOldLayers,
  cssRiskRows,
  calendarSignals,
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.json'),
  JSON.stringify(report, null, 2),
  'utf8'
);

const md = [];
md.push('# CloseFlow — Calendar Month Plain Text Deep Audit');
md.push('');
md.push(`Generated: ${report.generatedAt}`);
md.push('');
md.push('## Werdykt');
md.push('');
md.push('Widok miesiąca nie powinien używać mini-kafelków wpisów. Na screenie problemem jest „kafelek w kafelku”: ramka wpisu, badge typu, przekreślony tekst i mała wysokość wiersza walczą ze sobą. To trzeba zmienić strukturalnie na zwykłą linię tekstu.');
md.push('');
md.push('## Teza');
md.push('');
md.push('- Główna teza: przepiąć render wpisów w widoku miesiąca na plain text rows.');
md.push('- Poziom przekonania: 9/10.');
md.push('- Argument za: kilka warstw CSS nie naprawiło overlapu, a screen nadal pokazuje mini-karty z obramowaniem i wewnętrznym badgem.');
md.push('- Argument przeciw: możliwe, że selector V3 nie trafił w DOM i czysty komponent też trzeba będzie dobrać do realnego miejsca renderu.');
md.push('- Co zmieni zdanie: gdyby runtime DOM pokazał, że render jest już prostą linią, a problem robi tylko jeden konkretny stary CSS.');
md.push('- Najkrótszy test: usunąć obramowanie mini-wpisu i renderować wpis miesiąca jako `type + text` w jednej linii z `title`.');
md.push('');
md.push('## Obserwacje ze screena');
md.push('');
for (const item of diagnosis.screenshotFinding) md.push(`- ${item}`);
md.push('');
md.push('## Prawdopodobna przyczyna');
md.push('');
for (const item of diagnosis.likelyCause) md.push(`- ${item}`);
md.push('');
md.push('## Rekomendowana naprawa');
md.push('');
for (const item of diagnosis.recommendation) md.push(`- ${item}`);
md.push('');
md.push('## Czego nie robić');
md.push('');
for (const item of diagnosis.veto) md.push(`- ${item}`);
md.push('');
md.push('## Evidence: structural package markers');
md.push('');
for (const [key, value] of Object.entries(packageEvidence)) md.push(`- ${key}: ${value}`);
md.push('');
md.push('## Calendar.tsx CSS imports');
md.push('');
if (cssImports.length) {
  for (const item of cssImports) md.push(`- line ${item.line}: ${item.import}`);
} else {
  md.push('- none');
}
md.push('');
md.push('## Active old / visual layers');
md.push('');
if (activeOldLayers.length) {
  for (const item of activeOldLayers.slice(0, 240)) md.push(`- ${item.file}: ${item.term}`);
} else {
  md.push('- none');
}
md.push('');
md.push('## High-risk CSS rows');
md.push('');
if (cssRiskRows.length) {
  for (const row of cssRiskRows.slice(0, 260)) {
    md.push(`- ${row.file}:${row.line} [${row.hits.join(', ')}] selector=\`${String(row.selector).replace(/`/g, "'")}\` :: \`${row.text.replace(/`/g, "'")}\``);
  }
} else {
  md.push('- none');
}
md.push('');
md.push('## Calendar render signals');
md.push('');
if (calendarSignals.length) {
  for (const row of calendarSignals.slice(0, 220)) {
    md.push(`- ${row.file}:${row.line} [${row.hits.join(', ')}] \`${row.text.replace(/`/g, "'")}\``);
  }
} else {
  md.push('- none');
}
md.push('');
md.push('## Następny pakiet wdrożeniowy');
md.push('');
md.push('Cel: wymienić render miesiąca na plain text row. Nie CSS-overrides.');
md.push('');
md.push('Docelowy DOM:');
md.push('');
md.push('```tsx');
md.push('<button className="cf-calendar-month-text-row" title={fullText}>');
md.push('  <span className="cf-calendar-month-text-type" data-kind={kind}>{shortType}</span>');
md.push('  <span className="cf-calendar-month-text-title">{text}</span>');
md.push('</button>');
md.push('```');
md.push('');
md.push('Styl:');
md.push('');
md.push('```css');
md.push('.cf-calendar-month-text-row {');
md.push('  display: flex;');
md.push('  align-items: center;');
md.push('  gap: 6px;');
md.push('  height: 18px;');
md.push('  border: 0;');
md.push('  background: transparent;');
md.push('  overflow: hidden;');
md.push('}');
md.push('.cf-calendar-month-text-title {');
md.push('  min-width: 0;');
md.push('  overflow: hidden;');
md.push('  text-overflow: ellipsis;');
md.push('  white-space: nowrap;');
md.push('}');
md.push('```');
md.push('');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.md'),
  md.join('\n'),
  'utf8'
);

console.log('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT_OK');
console.log(JSON.stringify({
  cssImports: cssImports.length,
  activeOldLayers: activeOldLayers.length,
  cssRiskRows: cssRiskRows.length,
  calendarSignals: calendarSignals.length,
  report: 'docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.md'
}, null, 2));
