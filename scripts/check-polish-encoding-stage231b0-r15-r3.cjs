const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const files = [
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/components/finance/FinanceMiniSummary.tsx',
  'src/components/ContextActionDialogs.tsx',
  'src/components/ClientCreateDialog.tsx',
  'src/components/EventCreateDialog.tsx',
  'src/components/TaskCreateDialog.tsx',
];

const mojibakeTokens = [
  'Ă…â€š', 'Ă…ÂĽ', 'Ă…Âş', 'Ă…â€ş', 'Ă…â€ž', 'Ă…â€ş', 'Ă…Ĺˇ', 'Ă…Â»', 'Ă…Âą',
  'Ă„â€¦', 'Ă„â„˘', 'Ă„â€ˇ', 'Ă„Ĺ‚', 'ĂÂł', 'Ă˘â‚¬â„˘', 'Ă˘â‚¬â€ś', 'Ă˘â‚¬â€ť', 'ďż˝',
];

const failures = [];
for (const rel of files) {
  const abs = path.join(repo, rel);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'utf8');
  for (const token of mojibakeTokens) {
    if (text.includes(token)) {
      failures.push(`${rel}: found mojibake token ${JSON.stringify(token)}`);
    }
  }
}

if (failures.length) {
  console.error('STAGE231B0_R15_R3_POLISH_ENCODING FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231B0_R15_R3_POLISH_ENCODING PASS');
