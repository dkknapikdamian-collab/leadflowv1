const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const read = (rel) => {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
};

const stripCssComments = (input) => input.replace(/\/\*[\s\S]*?\*\//g, '');

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.vercel'].includes(name)) continue;
      walk(full, files);
    } else if (/\.(css|tsx|ts|jsx|js|cjs)$/.test(name)) {
      files.push(full);
    }
  }
  return files;
}

const files = [
  ...walk(path.join(repo, 'src')),
  ...walk(path.join(repo, 'tools')),
  ...walk(path.join(repo, 'scripts'))
];

const calendar = read('src/pages/Calendar.tsx');

const cssImports = [];
const importRegex = /^import\s+['"]([^'"]+\.css)['"];\s*$/gm;
let m;
while ((m = importRegex.exec(calendar))) {
  cssImports.push({
    file: 'src/pages/Calendar.tsx',
    line: calendar.slice(0, m.index).split(/\r?\n/).length,
    import: m[1]
  });
}

const expectedCalendarCssOrder = [
  '../styles/closeflow-page-header-v2.css',
  '../styles/closeflow-calendar-skin-only-v1.css',
  '../styles/closeflow-calendar-color-tooltip-v2.css',
  '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css',
  '../styles/closeflow-calendar-month-rows-no-overlap-repair2.css'
];

const importOrderIssues = [];
let lastIndex = -1;
for (const expected of expectedCalendarCssOrder) {
  const idx = cssImports.findIndex(x => x.import === expected);
  if (idx === -1) {
    importOrderIssues.push(`Missing Calendar CSS import: ${expected}`);
  } else if (idx < lastIndex) {
    importOrderIssues.push(`Wrong Calendar CSS order: ${expected} appears before an earlier layer.`);
  } else {
    lastIndex = idx;
  }
}

const overlapRiskTerms = [
  { id: 'absolute-position', re: /position\s*:\s*absolute\s*!?/i, weight: 4 },
  { id: 'negative-margin', re: /margin-(top|bottom|left|right)?\s*:\s*-[0-9]/i, weight: 4 },
  { id: 'translate-transform', re: /transform\s*:\s*translate/i, weight: 3 },
  { id: 'height-hard', re: /\bheight\s*:\s*(1[0-9]|2[0-7])px\s*!?/i, weight: 3 },
  { id: 'max-height-hard', re: /max-height\s*:\s*(1[0-9]|2[0-7])px\s*!?/i, weight: 3 },
  { id: 'line-height-too-large', re: /line-height\s*:\s*(2[2-9]|3[0-9])px\s*!?/i, weight: 2 },
  { id: 'line-height-too-small', re: /line-height\s*:\s*(0(\.[0-9]+)?|1|1\.0)\s*!?/i, weight: 2 },
  { id: 'overflow-visible', re: /overflow\s*:\s*visible\s*!?/i, weight: 3 },
  { id: 'display-grid', re: /display\s*:\s*grid\s*!?/i, weight: 1 },
  { id: 'display-flex', re: /display\s*:\s*flex\s*!?/i, weight: 1 },
  { id: 'white-space-normal', re: /white-space\s*:\s*(normal|pre-wrap|break-spaces)\s*!?/i, weight: 3 },
  { id: 'flex-wrap', re: /flex-wrap\s*:\s*wrap\s*!?/i, weight: 3 },
  { id: 'top-left-inset', re: /\b(top|left|right|bottom|inset)\s*:\s*[-0-9]/i, weight: 2 },
  { id: 'line-through', re: /(line-through|text-decoration)/i, weight: 1 },
];

const monthSelectorHints = [
  'month',
  'calendar',
  'chip',
  'entry',
  'event',
  'task',
  'line-through',
  'cf-calendar',
  'cf-entity-type-pill',
  'calendar-entry-card'
];

const cssRiskRows = [];
const calendarCssFiles = [];

for (const file of files) {
  const rel = path.relative(repo, file).replace(/\\/g, '/');
  const raw = fs.readFileSync(file, 'utf8');
  const scan = rel.endsWith('.css') ? stripCssComments(raw) : raw;

  if (rel.endsWith('.css') && /calendar|visual-stage|stage37|stage39|stage40|page-adapters|emergency|ClientDetail|CaseDetail|index/i.test(rel)) {
    calendarCssFiles.push(rel);
  }

  const lines = scan.split(/\r?\n/);
  let currentSelector = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (rel.endsWith('.css')) {
      if (trimmed.includes('{')) {
        currentSelector = trimmed.slice(0, trimmed.indexOf('{')).trim() || currentSelector;
      } else if (trimmed && !trimmed.includes(':') && !trimmed.includes('}') && trimmed.includes(',')) {
        currentSelector = trimmed;
      }
    }

    const context = `${currentSelector} ${trimmed}`;
    const lowerContext = context.toLowerCase();
    const selectorLooksRelevant = monthSelectorHints.some(h => lowerContext.includes(h.toLowerCase()));

    if (selectorLooksRelevant) {
      const hits = overlapRiskTerms.filter(t => t.re.test(trimmed));
      if (hits.length) {
        cssRiskRows.push({
          file: rel,
          line: i + 1,
          selector: currentSelector.slice(0, 260),
          hits: hits.map(h => h.id),
          weight: hits.reduce((sum, h) => sum + h.weight, 0),
          text: trimmed.slice(0, 260)
        });
      }
    }
  }
}

const exactOldCalendarLayers = [];
for (const rel of calendarCssFiles) {
  const raw = read(rel);
  const scan = rel.endsWith('.css') ? stripCssComments(raw) : raw;
  if (
    /calendar-entry-card|calendar-month|calendar.*chip|month.*chip|month.*entry|cf-entity-type-pill|line-through|bg-slate-950|bg-slate-900/i.test(scan)
  ) {
    exactOldCalendarLayers.push(rel);
  }
}

const calendarRenderSignals = [];
const renderTerms = [
  'calendarScale',
  'month',
  'więcej',
  'selectedDate',
  'calendar-entry-card',
  'cf-entity-type-pill',
  'line-through',
  'title=',
  'data-cf-calendar',
  'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT',
  'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2'
];
calendar.split(/\r?\n/).forEach((line, idx) => {
  const hits = renderTerms.filter(t => line.includes(t));
  if (hits.length) {
    calendarRenderSignals.push({
      file: 'src/pages/Calendar.tsx',
      line: idx + 1,
      hits,
      text: line.trim().slice(0, 260)
    });
  }
});

const likelyConflictRows = cssRiskRows
  .filter(r => r.weight >= 3)
  .sort((a, b) => b.weight - a.weight || a.file.localeCompare(b.file) || a.line - b.line);

const cssImportLayerFindings = [];
for (const file of files) {
  const rel = path.relative(repo, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  const importAnyCss = /(?:@import\s+["']([^"']+)["']|import\s+["']([^"']+\.css)["'])/g;
  let mm;
  while ((mm = importAnyCss.exec(text))) {
    const imp = mm[1] || mm[2];
    if (/calendar|visual-stage|stage37|stage39|stage40|page-adapters|emergency|page-header|clientdetail|casedetail/i.test(imp)) {
      cssImportLayerFindings.push({
        file: rel,
        line: text.slice(0, mm.index).split(/\r?\n/).length,
        import: imp
      });
    }
  }
}

const verdict = {
  mainDiagnosis: [
    'CSS-only fixes are now at the limit. The screenshot still shows overlapping because the month entry DOM is not a clean single row component.',
    'Multiple active calendar skin layers are imported into Calendar.tsx and can compete by selector weight/import order.',
    'The safer next implementation should be structural: replace the month item render with MonthEntryChip(label, text, title), not another broad CSS override.',
    'The hover-title idea is good and should stay, but it belongs on the real chip element, not on guessed nested nodes.'
  ],
  likelyRootCause: [
    'Month cell entries are rendered with nested existing classes/utilities that allow multiple children/text nodes to paint in the same vertical space.',
    'The current enhancer guesses type labels after render, then CSS tries to force layout across unknown nested DOM. That is brittle.',
    'Old and new calendar CSS layers remain active at the same time.'
  ],
  recommendedFix: [
    'Stop adding more CSS bandaids for overlap.',
    'Patch Calendar.tsx month-view render only: create a MonthEntryChip component with fixed markup.',
    'Use title={fullText} directly on the chip.',
    'Show max visible entries in the tile and render +X więcej as a separate row.',
    'Keep the left Calendar side panel and all existing handlers.'
  ]
};

const report = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT_2026_05_12',
  verdict,
  importOrderIssues,
  calendarCssImports: cssImports,
  activeVisualCssImports: cssImportLayerFindings,
  exactOldCalendarLayers,
  likelyConflictRows,
  allCssRiskRows: cssRiskRows,
  calendarRenderSignals
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT.generated.json'),
  JSON.stringify(report, null, 2),
  'utf8'
);

const mdLines = [];
mdLines.push('# CloseFlow — Calendar Month Overlap Deep Audit');
mdLines.push('');
mdLines.push(`Generated: ${report.generatedAt}`);
mdLines.push('');
mdLines.push('## Werdykt');
mdLines.push('');
mdLines.push('To nie wygląda już jak problem „jednego starego koloru”. To jest problem struktury renderu wpisu w miesiącu. CSS próbuje naprawiać niepewny, zagnieżdżony DOM i dlatego tekst nadal wpada pod inne wpisy.');
mdLines.push('');
mdLines.push('## Główna diagnoza');
mdLines.push('');
for (const x of verdict.mainDiagnosis) mdLines.push(`- ${x}`);
mdLines.push('');
mdLines.push('## Prawdopodobna przyczyna');
mdLines.push('');
for (const x of verdict.likelyRootCause) mdLines.push(`- ${x}`);
mdLines.push('');
mdLines.push('## Rekomendowany następny ruch');
mdLines.push('');
for (const x of verdict.recommendedFix) mdLines.push(`- ${x}`);
mdLines.push('');
mdLines.push('## Calendar.tsx CSS import order');
mdLines.push('');
if (cssImports.length) {
  for (const x of cssImports) mdLines.push(`- ${x.file}:${x.line} -> ${x.import}`);
} else {
  mdLines.push('- no CSS imports found in Calendar.tsx');
}
mdLines.push('');
mdLines.push('## Import order issues');
mdLines.push('');
if (importOrderIssues.length) {
  for (const x of importOrderIssues) mdLines.push(`- ${x}`);
} else {
  mdLines.push('- none');
}
mdLines.push('');
mdLines.push('## Active visual CSS imports related to calendar/stages');
mdLines.push('');
if (cssImportLayerFindings.length) {
  for (const x of cssImportLayerFindings.slice(0, 220)) mdLines.push(`- ${x.file}:${x.line} -> ${x.import}`);
} else {
  mdLines.push('- none');
}
mdLines.push('');
mdLines.push('## Old / competing calendar visual layers');
mdLines.push('');
if (exactOldCalendarLayers.length) {
  for (const x of exactOldCalendarLayers) mdLines.push(`- ${x}`);
} else {
  mdLines.push('- none');
}
mdLines.push('');
mdLines.push('## High-risk CSS rows for overlap');
mdLines.push('');
if (likelyConflictRows.length) {
  for (const x of likelyConflictRows.slice(0, 180)) {
    mdLines.push(`- ${x.file}:${x.line} weight=${x.weight} [${x.hits.join(', ')}] selector=\`${String(x.selector).replace(/`/g, "'")}\` :: \`${x.text.replace(/`/g, "'")}\``);
  }
} else {
  mdLines.push('- none');
}
mdLines.push('');
mdLines.push('## Calendar render signals');
mdLines.push('');
if (calendarRenderSignals.length) {
  for (const x of calendarRenderSignals.slice(0, 220)) {
    mdLines.push(`- ${x.file}:${x.line} [${x.hits.join(', ')}] \`${x.text.replace(/`/g, "'")}\``);
  }
} else {
  mdLines.push('- none');
}
mdLines.push('');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT.generated.md'),
  mdLines.join('\n'),
  'utf8'
);

console.log('CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT_OK');
console.log(JSON.stringify({
  cssImports: cssImports.length,
  activeVisualCssImports: cssImportLayerFindings.length,
  oldCalendarLayers: exactOldCalendarLayers.length,
  highRiskRows: likelyConflictRows.length,
  renderSignals: calendarRenderSignals.length,
  report: 'docs/ui/CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT.generated.md'
}, null, 2));
