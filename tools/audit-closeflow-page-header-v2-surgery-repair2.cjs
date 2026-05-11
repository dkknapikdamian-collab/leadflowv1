const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const files = [
  'src/pages/TasksStable.tsx',
  'src/pages/Templates.tsx',
  'src/pages/Activity.tsx',
  'src/pages/Clients.tsx',
  'src/components/CloseFlowPageHeaderV2.tsx',
  'src/styles/closeflow-page-header-v2.css',
];

const terms = [
  'CloseFlowPageHeaderV2',
  'cf-page-header-v2',
  'data-cf-page-header',
  'className="cf-page-header',
  'cf-page-header-row',
  'cf-page-hero-layout',
  'activity-page-header',
  'closeflow-page-header-card-source-truth',
  'closeflow-page-header-final-lock',
  'closeflow-page-header-structure-lock',
  'closeflow-page-header-copy-left-only',
];

const rows = [];
for (const rel of files) {
  const file = path.join(repo, rel);
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (terms.some((term) => line.includes(term))) {
      rows.push({ file: rel, line: index + 1, text: line.trim().slice(0, 260) });
    }
  });
}

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_PAGE_HEADER_V2_SURGERY_REPAIR2_AUDIT.generated.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_REPAIR2_AUDIT_OK');
console.log(JSON.stringify({ rows: rows.length }, null, 2));
