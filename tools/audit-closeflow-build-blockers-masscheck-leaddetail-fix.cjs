const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const outDir = path.join(repo, 'docs', 'release');
fs.mkdirSync(outDir, { recursive: true });

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.vercel'].includes(name)) continue;
      walk(full, out);
    } else if (/\.(tsx|ts|jsx|js|cjs|css)$/.test(name)) {
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

const riskyRows = [];
const patterns = [
  { id: 'broken-polish-fallback-quote', re: /'Brak powiązanej sprawy\}/ },
  { id: 'common-broken-jsx-string-before-tag', re: /:\s*'[^'\n]*\}\s*<\/(small|p|span|strong|div)>/ },
  { id: 'dangling-template-expression-before-tag', re: /\$\{[^}]*<\/(small|p|span|strong|div)>/ },
  { id: 'bad-calendar-regex-token-from-v3', re: /\[\\{2,}\]\\\\/ },
  { id: 'unexpected-token-style-regex-source', re: /\[\.\*\+\?\^\$\{\}\(\)\|\[\\{2,}\]\\\\\]/ },
];

for (const full of files) {
  const rel = path.relative(repo, full).replace(/\\/g, '/');
  const text = fs.readFileSync(full, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const hits = patterns.filter((pattern) => pattern.re.test(line));
    if (hits.length) {
      riskyRows.push({
        file: rel,
        line: index + 1,
        hits: hits.map((h) => h.id),
        text: line.trim().slice(0, 240),
      });
    }
  });
}

const leadDetail = fs.readFileSync(path.join(repo, 'src/pages/LeadDetail.tsx'), 'utf8');
const failures = [];

if (leadDetail.includes("Brak powiązanej sprawy}</small>")) {
  failures.push('LeadDetail still has broken service case fallback quote.');
}
if (!leadDetail.includes("Brak powiązanej sprawy'}</small>")) {
  failures.push('LeadDetail fixed fallback pattern not found.');
}

const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures,
  riskyRows,
  scannedFiles: files.length,
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_AUDIT.generated.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow — Build Blockers Masscheck LeadDetail Fix Audit',
  '',
  `Generated: ${result.generatedAt}`,
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  '## Failures',
  '',
  failures.length ? failures.map((f) => `- ${f}`).join('\n') : '- none',
  '',
  '## Risky rows found by mass scan',
  '',
  riskyRows.length
    ? riskyRows.slice(0, 300).map((row) => `- ${row.file}:${row.line} [${row.hits.join(', ')}] \`${row.text.replace(/`/g, "'")}\``).join('\n')
    : '- none',
  '',
].join('\n');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_AUDIT.generated.md'),
  md,
  'utf8'
);

if (failures.length) {
  console.error('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_AUDIT_OK');
console.log(JSON.stringify({ scannedFiles: files.length, riskyRows: riskyRows.length }, null, 2));
