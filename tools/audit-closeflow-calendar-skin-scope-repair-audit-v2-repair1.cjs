const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

function stripCssComments(input) {
  return input.replace(/\/\*[\s\S]*?\*\//g, '');
}

const cssRel = 'src/styles/closeflow-calendar-skin-only-v1.css';
const css = fs.readFileSync(path.join(repo, cssRel), 'utf8');
const cssNoComments = stripCssComments(css);

const failures = [];

if (cssNoComments.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])')) {
  failures.push('Executable CSS still contains broad .cf-html-shell calendar scope.');
}
if (/\.cf-html-shell\s*:has/.test(cssNoComments)) {
  failures.push('Executable CSS still contains .cf-html-shell :has scope.');
}
if (/\[class\*=["'](?:side|sidebar|rail|left)["']\]/.test(cssNoComments)) {
  failures.push('Executable CSS still contains broad side/sidebar/rail/left selectors.');
}
if (/(^|[\s,{])aside([\s,{:.#\[]|$)/m.test(cssNoComments)) {
  failures.push('Executable CSS still contains aside selector.');
}
if (!cssNoComments.includes('[data-cf-page-header-v2="calendar"] ~ *')) {
  failures.push('Executable CSS does not contain header-sibling calendar scope.');
}

const visualImports = [];
const riskyRows = [];
const cssImportRegex = /@import\s+["']([^"']+)["']|import\s+["']([^"']+\.css)["']/g;
const riskyTerms = [
  'closeflow-calendar-skin-only-v1.css',
  'visual-stage',
  'stage37',
  'stage39',
  'stage40',
  'page-adapters',
  'emergency-hotfixes',
  'page-header',
  'calendar-entry-card',
  'bg-slate-950',
  'bg-slate-900',
  'from-slate-950',
  'to-slate-950'
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(name)) continue;
      walk(full, files);
    } else if (/\.(css|tsx|ts|jsx|js|cjs)$/.test(name)) {
      files.push(full);
    }
  }
  return files;
}

const files = [...walk(path.join(repo, 'src')), ...walk(path.join(repo, 'tools')), ...walk(path.join(repo, 'scripts'))];

for (const file of files) {
  const rel = path.relative(repo, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = cssImportRegex.exec(text))) {
    const importPath = m[1] || m[2];
    if (/calendar|visual-stage|stage37|stage39|stage40|page-adapters|emergency|page-header/i.test(importPath)) {
      visualImports.push({
        file: rel,
        import: importPath,
        line: text.slice(0, m.index).split(/\r?\n/).length
      });
    }
  }

  const scanText = rel.endsWith('.css') ? stripCssComments(text) : text;
  scanText.split(/\r?\n/).forEach((line, idx) => {
    const hits = riskyTerms.filter(term => line.includes(term));
    if (hits.length) {
      riskyRows.push({
        file: rel,
        line: idx + 1,
        hits,
        text: line.trim().slice(0, 240)
      });
    }
  });
}

const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures,
  summary: {
    scannedFiles: files.length,
    visualImports: visualImports.length,
    riskyRows: riskyRows.length
  },
  visualImports,
  riskyRows
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1.generated.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow — Calendar Skin Scope Repair Audit V2 Repair1',
  '',
  `Generated: ${result.generatedAt}`,
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  '## Failures',
  '',
  failures.length ? failures.map(x => `- ${x}`).join('\n') : '- none',
  '',
  '## Active visual imports',
  '',
  visualImports.slice(0, 180).map(x => `- ${x.file}:${x.line} -> ${x.import}`).join('\n') || '- none',
  '',
  '## Risk rows',
  '',
  riskyRows.slice(0, 240).map(x => `- ${x.file}:${x.line} [${x.hits.join(', ')}] \`${x.text.replace(/`/g, "'")}\``).join('\n') || '- none',
  ''
].join('\n');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1.generated.md'),
  md,
  'utf8'
);

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_OK');
console.log(JSON.stringify(result.summary, null, 2));
