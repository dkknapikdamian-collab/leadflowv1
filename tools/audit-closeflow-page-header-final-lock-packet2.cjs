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
  ...walk(path.join(repo, 'src', 'pages')),
  ...walk(path.join(repo, 'src', 'components')),
];

const terms = [
  'data-cf-page-header',
  'cf-page-header',
  '> :last-child',
  'activity-page-header',
  'ai-drafts-header-actions',
  'notifications-header-actions',
  'billing-header-actions',
  'bg-green',
  'text-emerald',
  'soft-blue',
  'cf-trash-action-button',
];

const hits = [];
for (const full of files) {
  const rel = path.relative(repo, full).replaceAll('\\', '/');
  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (terms.some((term) => line.includes(term))) {
      hits.push({ file: rel, line: index + 1, text: line.trim().slice(0, 280) });
    }
  });
}

const byFile = {};
for (const hit of hits) byFile[hit.file] = (byFile[hit.file] || 0) + 1;

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_FINAL_LOCK_PACKET2_AUDIT.generated.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), count: hits.length, byFile, hits }, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow page header final lock packet 2 audit',
  '',
  'Ten raport pokazuje aktywne miejsca, które nadal dotykają headerów i akcji.',
  '',
  '## Files',
  '',
  ...Object.entries(byFile).sort((a, b) => b[1] - a[1]).map(([file, count]) => `- ${file}: ${count}`),
  '',
  '## Final decision',
  '',
  '`src/styles/closeflow-page-header-final-lock.css` jest ostatnim źródłem prawdy dla layoutu headera, copy i semantyki akcji.',
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_FINAL_LOCK_PACKET2_AUDIT.generated.md'), md, 'utf8');

console.log('CLOSEFLOW_PAGE_HEADER_FINAL_LOCK_PACKET2_AUDIT_OK');
console.log(JSON.stringify({ files: Object.keys(byFile).length, hits: hits.length }, null, 2));
