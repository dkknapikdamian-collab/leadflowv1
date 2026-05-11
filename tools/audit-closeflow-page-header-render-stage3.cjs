const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const pagesDir = path.join(repo, 'src', 'pages');

const markers = [
  'page-head',
  'cf-page-hero',
  'ai-drafts-page-header',
  'activity-page-header',
  'notifications-page-header',
  'billing-header',
  'support-header',
  'settings-header',
  'data-cf-page-header',
];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const rows = [];
for (const file of walk(pagesDir)) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (markers.some((m) => line.includes(m))) {
      rows.push({
        file: path.relative(repo, file).replaceAll('\\', '/'),
        line: i + 1,
        text: line.trim().slice(0, 280),
      });
    }
  });
}

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
const out = {
  generatedAt: new Date().toISOString(),
  count: rows.length,
  rows,
};
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_RENDER_AUDIT_STAGE3.generated.json'), JSON.stringify(out, null, 2), 'utf8');

const byFile = new Map();
for (const row of rows) byFile.set(row.file, (byFile.get(row.file) || 0) + 1);
const md = [
  '# CloseFlow Page Header Render Audit Stage 3',
  '',
  'Ten raport pokazuje, które pliki TSX renderują lub oznaczają top header.',
  '',
  '## Files',
  '',
  ...Array.from(byFile.entries()).sort((a,b) => a[0].localeCompare(b[0])).map(([file, count]) => `- ${file}: ${count}`),
  '',
  '## Rule',
  '',
  'Każdy top header docelowo ma mieć `data-cf-page-header="true"` oraz części `data-cf-page-header-part`.',
  '',
].join('\n');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_RENDER_AUDIT_STAGE3.generated.md'), md, 'utf8');

console.log('CLOSEFLOW_PAGE_HEADER_RENDER_AUDIT_STAGE3_OK');
console.log(JSON.stringify({ files: byFile.size, rows: rows.length }, null, 2));
