const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && /\.(css|tsx|ts)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = [
  ...walk(path.join(repo, 'src', 'styles')),
  ...walk(path.join(repo, 'src', 'components')),
  ...walk(path.join(repo, 'src', 'pages')),
];

const terms = [
  'global-actions',
  'data-global-quick-actions',
  'cf-section-head-actions',
  'cf-section-head-action-stack',
  'cf-page-hero-actions',
  'cf-page-hero-aside',
  'head-actions',
  'soft-blue',
  'rounded-xl',
  'bg-green-600',
  'bg-blue-600',
];

const rows = [];
for (const full of files) {
  const rel = path.relative(repo, full).replaceAll('\\', '/');
  const text = fs.readFileSync(full, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (terms.some((term) => line.includes(term))) {
      rows.push({ file: rel, line: index + 1, text: line.trim().slice(0, 300) });
    }
  });
}

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const byFile = {};
for (const row of rows) byFile[row.file] = (byFile[row.file] || 0) + 1;

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_HEADER_COMMAND_BUTTONS_AUDIT_STAGE6.generated.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), count: rows.length, byFile, rows }, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow header command buttons audit Stage 6',
  '',
  'Audyt pokazuje stare źródła, które nadal mogą wpływać na przyciski w górnym pasku i headerach.',
  '',
  '## Pliki z trafieniami',
  '',
  ...Object.entries(byFile).sort((a, b) => b[1] - a[1]).map(([file, count]) => `- ${file}: ${count}`),
  '',
  '## Decyzja',
  '',
  'Finalnym źródłem prawdy dla tych akcji jest `src/styles/closeflow-command-actions-source-truth.css`.',
  '',
  'Ten plik celowo jest importowany w `src/App.tsx`, w `GlobalQuickActions.tsx`, w `QuickAiCapture.tsx` oraz na końcu `src/styles/emergency/emergency-hotfixes.css`, żeby wygrać ze starymi warstwami `closeflow-action-tokens.css`, page header CSS i visual-stage.',
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_HEADER_COMMAND_BUTTONS_AUDIT_STAGE6.generated.md'), md, 'utf8');

console.log('CLOSEFLOW_HEADER_COMMAND_BUTTONS_AUDIT_STAGE6_OK');
console.log(JSON.stringify({ files: Object.keys(byFile).length, rows: rows.length }, null, 2));
