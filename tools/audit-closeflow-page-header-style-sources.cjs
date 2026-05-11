const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const stylesRoot = path.join(repo, 'src', 'styles');
const outDir = path.join(repo, 'docs', 'ui');

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.css')) result.push(full);
  }
  return result;
}

const files = fs.existsSync(stylesRoot) ? walk(stylesRoot) : [];
const patterns = [
  'page-head',
  'cf-page-hero',
  'ai-drafts-page-header',
  'activity-page-header',
  'notifications-page-header',
  'billing-header',
  'support-header',
  'settings-header',
];

const rows = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const compact = line.trim();
    if (!compact) return;
    const isHeaderLine = patterns.some((pattern) => compact.includes(pattern));
    const isVisualProp = /(background|background-image|background-color|color|box-shadow|border|border-radius|padding|font-size)/.test(compact);
    if (isHeaderLine || (isVisualProp && patterns.some((pattern) => text.slice(Math.max(0, text.indexOf(line) - 600), text.indexOf(line) + 600).includes(pattern)))) {
      rows.push({
        file: path.relative(repo, file).replaceAll('\\', '/'),
        line: index + 1,
        text: compact.slice(0, 260),
      });
    }
  });
}

fs.mkdirSync(outDir, { recursive: true });

const jsonPath = path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_STYLE_SOURCE_AUDIT.generated.json');
fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), count: rows.length, rows }, null, 2), 'utf8');

const byFile = new Map();
for (const row of rows) {
  if (!byFile.has(row.file)) byFile.set(row.file, 0);
  byFile.set(row.file, byFile.get(row.file) + 1);
}

const md = [
  '# CloseFlow page header style source audit',
  '',
  'This report lists old CSS files that still mention page header selectors or nearby visual properties.',
  '',
  '## Summary',
  '',
  ...Array.from(byFile.entries()).sort((a,b) => b[1]-a[1]).map(([file, count]) => `- ${file}: ${count}`),
  '',
  '## Rule',
  '',
  'The final source of truth must be `src/styles/closeflow-page-header-card-source-truth.css` and must target only `[data-cf-page-header="true"]`.',
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_STYLE_SOURCE_AUDIT.generated.md'), md, 'utf8');

console.log('CLOSEFLOW_PAGE_HEADER_STYLE_SOURCE_AUDIT_OK');
console.log(JSON.stringify({ count: rows.length, files: Array.from(byFile.keys()).length }, null, 2));
