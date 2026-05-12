const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const cssImportRegex = /@import\s+["']([^"']+)["']|import\s+["']([^"']+\.css)["']/g;
const riskyTerms = [
  ':has([data-cf-page-header-v2="calendar"])',
  '.cf-html-shell:has([data-cf-page-header-v2="calendar"])',
  '[class*="side"]',
  '[class*="sidebar"]',
  '[class*="rail"]',
  '[class*="left"]',
  'aside',
  'bg-slate-950',
  'bg-slate-900',
  'from-slate-950',
  'to-slate-950',
  'calendar-entry-card',
  'page-head',
  'head-actions',
  'data-cf-page-header',
  'data-cf-page-header-v2'
];

const startDirs = ['src', 'scripts', 'tools'];
const allFiles = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(name)) continue;
      walk(full);
    } else if (/\.(css|tsx|ts|jsx|js|cjs)$/.test(name)) {
      allFiles.push(full);
    }
  }
}

for (const dir of startDirs) walk(path.join(repo, dir));

const rows = [];
const imports = [];

for (const file of allFiles) {
  const rel = path.relative(repo, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');

  let m;
  while ((m = cssImportRegex.exec(text))) {
    imports.push({
      file: rel,
      import: m[1] || m[2],
      line: text.slice(0, m.index).split(/\r?\n/).length
    });
  }

  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const hits = riskyTerms.filter(term => line.includes(term));
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

const skin = fs.readFileSync(path.join(repo, 'src/styles/closeflow-calendar-skin-only-v1.css'), 'utf8');
const skinFailures = [];
if (skin.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])')) {
  skinFailures.push('skin contains broad .cf-html-shell calendar scope');
}
if (/\[class\*=["'](?:side|sidebar|rail|left)["']\]/.test(skin)) {
  skinFailures.push('skin contains broad side/sidebar/rail/left selectors');
}
if (/(^|[\s,{])aside([\s,{:.#\[]|$)/m.test(skin)) {
  skinFailures.push('skin contains aside selector');
}
if (!skin.includes('[data-cf-page-header-v2="calendar"] ~ *')) {
  skinFailures.push('skin does not use header-sibling scope');
}

const importedCss = imports
  .filter(x => /calendar|visual-stage|stage37|stage39|stage40|page-adapters|emergency|page-header/i.test(x.import))
  .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_2026_05_12',
  verdict: skinFailures.length ? 'fail' : 'pass',
  skinFailures,
  summary: {
    scannedFiles: allFiles.length,
    riskyRows: rows.length,
    visualCssImports: importedCss.length
  },
  activeVisualImports: importedCss,
  riskyRows: rows
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow — Calendar Skin Scope Repair Audit V2',
  '',
  `Generated: ${result.generatedAt}`,
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  '## Why this repair exists',
  '',
  'Previous skin-only CSS used a broad shell selector based on `:has([data-cf-page-header-v2="calendar"])`.',
  'That selector covered the whole application shell, therefore it could style the left app navigation/sidebar.',
  '',
  'The repaired skin uses header-sibling scope:',
  '',
  '```css',
  '#root [data-cf-page-header-v2="calendar"] ~ * ...',
  '```',
  '',
  'This means: style Calendar content after the Calendar header, not the global operator shell.',
  '',
  '## Skin failures',
  '',
  skinFailures.length ? skinFailures.map(x => `- ${x}`).join('\n') : '- none',
  '',
  '## Active visual imports related to this area',
  '',
  importedCss.slice(0, 160).map(x => `- ${x.file}:${x.line} -> ${x.import}`).join('\n') || '- none',
  '',
  '## Risk rows',
  '',
  rows.slice(0, 220).map(x => `- ${x.file}:${x.line} [${x.hits.join(', ')}] \`${x.text.replace(/`/g, "'")}\``).join('\n') || '- none',
  ''
].join('\n');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.md'),
  md,
  'utf8'
);

if (skinFailures.length) {
  console.error('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_FAILED');
  console.error(skinFailures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_OK');
console.log(JSON.stringify(result.summary, null, 2));
