const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const targets = [
  'src/pages/LeadDetail.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Today.tsx',
];

const forbiddenSnippets = [
  'Następny krok',
  'Nastepny krok',
  'Co teraz zrobić z tym leadem',
  'Co teraz zrobic z tym leadem',
];

for (const rel of targets) {
  const full = path.join(root, rel);
  const source = fs.readFileSync(full, 'utf8');
  for (const snippet of forbiddenSnippets) {
    assert.equal(
      source.includes(snippet),
      false,
      `${rel} still contains forbidden UI phrase: ${snippet}`,
    );
  }
}

console.log('PASS no-next-step-ui guard');
