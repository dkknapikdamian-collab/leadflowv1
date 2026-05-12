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

const filesToScan = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(name)) continue;
      walk(full);
    } else if (/\.(css|tsx|ts|jsx|js|cjs)$/.test(name)) {
      filesToScan.push(full);
    }
  }
}
walk(path.join(repo, 'src'));

const rows = [];
const terms = [
  'closeflow-calendar',
  'visual-stage',
  'stage37',
  'stage39',
  'stage40',
  'page-adapters',
  'emergency-hotfixes',
  'calendar-entry-card',
  'bg-slate-950',
  'bg-slate-900',
  'from-slate-950',
  'to-slate-950',
  'cf-html-shell:has([data-cf-page-header-v2="calendar"])',
  '[data-cf-page-header-v2="calendar"] ~ *'
];

for (const file of filesToScan) {
  const rel = path.relative(repo, file).replace(/\\/g, '/');
  const raw = fs.readFileSync(file, 'utf8');
  const scan = rel.endsWith('.css') ? stripCssComments(raw) : raw;
  scan.split(/\r?\n/).forEach((line, idx) => {
    const hits = terms.filter(t => line.includes(t));
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

const cssV2 = stripCssComments(read('src/styles/closeflow-calendar-color-tooltip-v2.css'));
const cssV1 = stripCssComments(read('src/styles/closeflow-calendar-skin-only-v1.css'));
const failures = [];

if (!cssV2.includes('[data-cf-page-header-v2="calendar"] ~ *')) {
  failures.push('V2 color tooltip CSS does not use calendar header sibling scope.');
}
if (cssV2.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])')) {
  failures.push('V2 color tooltip CSS contains broad shell scope.');
}
if (cssV2.includes('[class*="sidebar"]') || cssV2.includes('[class*="side"]') || cssV2.includes('[class*="rail"]')) {
  failures.push('V2 color tooltip CSS contains sidebar-like selectors.');
}
if (cssV1.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])')) {
  failures.push('V1 skin CSS still contains broad shell scope.');
}

const calendar = read('src/pages/Calendar.tsx');
if (!calendar.includes('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT')) {
  failures.push('Calendar.tsx does not contain tooltip/color enhancement effect.');
}

const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures,
  summary: {
    scannedFiles: filesToScan.length,
    riskyRows: rows.length
  },
  rows
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_DEEP_AUDIT.generated.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow — Calendar Color Tooltip V2 Deep Audit',
  '',
  `Generated: ${result.generatedAt}`,
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  '## Failures',
  '',
  failures.length ? failures.map(f => `- ${f}`).join('\n') : '- none',
  '',
  '## Visual rows',
  '',
  rows.slice(0, 240).map(r => `- ${r.file}:${r.line} [${r.hits.join(', ')}] \`${r.text.replace(/`/g, "'")}\``).join('\n') || '- none',
  ''
].join('\n');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_DEEP_AUDIT.generated.md'),
  md,
  'utf8'
);

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_DEEP_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_DEEP_AUDIT_OK');
console.log(JSON.stringify(result.summary, null, 2));
