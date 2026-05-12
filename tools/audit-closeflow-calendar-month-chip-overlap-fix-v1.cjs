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

const css = stripCssComments(read('src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css'));
const calendar = read('src/pages/Calendar.tsx');
const failures = [];

if (!calendar.includes("import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';")) {
  failures.push('Calendar does not import month chip overlap fix CSS.');
}
if (!calendar.includes('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12')) {
  failures.push('Calendar does not include overlap fix marker.');
}
if (!css.includes('[data-cf-page-header-v2="calendar"] ~ *')) {
  failures.push('Overlap CSS is not scoped to Calendar header sibling content.');
}
if (css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])')) {
  failures.push('Overlap CSS contains broad shell scope.');
}
if (/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css)) {
  failures.push('Overlap CSS contains sidebar-like selectors.');
}
if (!css.includes('grid-template-columns: auto minmax(0, 1fr)')) {
  failures.push('Overlap CSS does not force horizontal chip grid.');
}
if (!css.includes('white-space: nowrap')) {
  failures.push('Overlap CSS does not prevent wrapping.');
}
if (!css.includes('text-overflow: ellipsis')) {
  failures.push('Overlap CSS does not enforce ellipsis.');
}

const rows = [];
for (const rel of [
  'src/pages/Calendar.tsx',
  'src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css',
  'src/styles/closeflow-calendar-color-tooltip-v2.css',
  'src/styles/closeflow-calendar-skin-only-v1.css'
]) {
  const raw = read(rel);
  const scan = rel.endsWith('.css') ? stripCssComments(raw) : raw;
  scan.split(/\r?\n/).forEach((line, idx) => {
    const hits = [
      'calendar-month-chip',
      'cf-calendar-tooltip',
      'cfCalendarKind',
      'cfCalendarRowKind',
      'grid-template-columns',
      'text-overflow',
      'white-space',
      'line-height'
    ].filter(t => line.includes(t));
    if (hits.length) {
      rows.push({
        file: rel,
        line: idx + 1,
        hits,
        text: line.trim().slice(0, 260)
      });
    }
  });
}

const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures,
  rows
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_AUDIT.generated.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow — Calendar Month Chip Overlap Fix V1 Audit',
  '',
  `Generated: ${result.generatedAt}`,
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  '## Failures',
  '',
  failures.length ? failures.map(f => `- ${f}`).join('\n') : '- none',
  '',
  '## Relevant rows',
  '',
  rows.map(r => `- ${r.file}:${r.line} [${r.hits.join(', ')}] \`${r.text.replace(/`/g, "'")}\``).join('\n') || '- none',
  ''
].join('\n');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_AUDIT.generated.md'),
  md,
  'utf8'
);

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_AUDIT_OK');
