const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

const candidates = ['src/pages/SupportCenter.tsx', 'src/pages/Help.tsx'].filter(exists);
if (!candidates.length) {
  fail('Support page not found. Checked src/pages/SupportCenter.tsx and src/pages/Help.tsx');
  process.exit();
}

const pageFile = candidates.find((file) => read(file).includes('data-support-ticket-list="true"')) || candidates[0];
const support = read(pageFile);

const forbidden = [
  'Zgłoszenia i status.',
  'Szybkie linki',
  'Status aplikacji',
];

for (const marker of forbidden) {
  if (support.includes(marker)) fail(`${pageFile} still includes forbidden text: ${marker}`);
  else pass(`${marker} removed`);
}

const forbiddenKontaktRightCard = /<section\b(?=[^>]*className=(?:"[^"]*support-right-card[^"]*"|'[^']*support-right-card[^']*'))[\s\S]*?Kontakt[\s\S]*?<\/section>/;
if (forbiddenKontaktRightCard.test(support)) {
  fail(`${pageFile} still includes Kontakt inside support-right-card`);
} else {
  pass('Kontakt right-card removed');
}

const required = [
  'data-support-ticket-list="true"',
  'Moje zgłoszenia',
  'Brak odpowiedzi',
  'support-ticket-status',
  'formatSupportStatus',
];

for (const marker of required) {
  if (!support.includes(marker)) fail(`${pageFile} misses required marker: ${marker}`);
  else pass(`${marker} present`);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:support-visible-ticket-list'] !== 'node scripts/check-closeflow-support-visible-ticket-list.cjs') {
  fail('package.json misses check:support-visible-ticket-list script');
} else {
  pass('package.json script present');
}

if (!process.exitCode) {
  console.log('OK: support visible ticket list guard passed.');
}
