const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const files = [
  'src/pages/Activity.tsx',
  'src/pages/Templates.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
  'src/styles/visual-stage8-activity-vnext.css',
  'src/styles/closeflow-page-header-final-lock.css',
  'src/styles/closeflow-page-header-structure-lock.css',
];

const rows = [];
for (const rel of files) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) continue;
  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (
      line.includes('activity-page-header') ||
      line.includes('data-cf-page-header-part="copy"') ||
      line.includes('data-cf-page-header-part="kicker"') ||
      line.includes('cf-page-header-row') ||
      line.includes('> :last-child')
    ) {
      rows.push({ file: rel, line: index + 1, text: line.trim().slice(0, 260) });
    }
  });
}

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_STRUCTURE_LOCK_PACKET3_AUDIT.generated.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), count: rows.length, rows }, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_PAGE_HEADER_STRUCTURE_LOCK_PACKET3_AUDIT_OK');
console.log(JSON.stringify({ rows: rows.length }, null, 2));
