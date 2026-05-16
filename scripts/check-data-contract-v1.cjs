#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const viewFiles = [
  'src/pages/Today.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
].map((p) => path.join(root, p));

const forbiddenAccessPatterns = [
  /\.(scheduled_at|start_at|lead_id|case_id|client_id)\b/g,
  /\[['\"](scheduled_at|start_at|lead_id|case_id|client_id)['\"]\]/g,
];

const violations = [];
for (const file of viewFiles) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of forbiddenAccessPatterns) {
    const matches = content.match(pattern);
    if (matches && matches.length) {
      violations.push(`${path.relative(root, file)} has legacy field access (${matches[0]})`);
    }
  }
}

if (violations.length) {
  console.error('DATA_CONTRACT_V1_GUARD_FAILED');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log('OK DATA_CONTRACT_V1_GUARD');
