const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP';
const files = {
  client: path.join(root, 'src/pages/ClientDetail.tsx'),
  run: path.join(root, '_project/runs/STAGE231D0_R4_CLIENT_WORKSPACE_UX_FINAL_RUNNER_FIX_RUN.md'),
  obsidian: path.join(root, '_project/obsidian_payloads/STAGE231D0_R4_CLIENT_WORKSPACE_UX_FINAL_RUNNER_FIX_OBSIDIAN_PAYLOAD.md'),
  vst: path.join(root, '_project/VISUAL_SOURCE_OF_TRUTH.md'),
};

function read(file) { return fs.readFileSync(file, 'utf8'); }
function count(text, token) { return text.split(token).length - 1; }
function fail(errors) {
  console.error(`${STAGE}: FAIL`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const errors = [];
console.log(`${STAGE}: start`);
for (const [name, file] of Object.entries(files)) {
  if (!fs.existsSync(file)) errors.push(`missing required file: ${path.relative(root, file)}`);
}
if (errors.length) fail(errors);

const client = read(files.client);
const run = read(files.run);
const obsidian = read(files.obsidian);
const vst = read(files.vst);

for (const token of [
  STAGE,
  'Ładowanie klienta...',
  'SPRAWA ZAMKNIĘTA',
  'data-stage231d0-finance-icon-source-truth="payment"',
  '<EntityIcon entity="payment" className="h-4 w-4" />',
]) {
  if (!client.includes(token)) errors.push(`ClientDetail missing token ${JSON.stringify(token)}`);
}

for (const token of [
  'Ĺadowanie klienta...',
  'Ĺadowanie klienta...',
  'SPRAWA ZAMKNIÄTA',
  'SPRAWA ZAMKNIÄTA',
  'â€˘',
  'â€¢',
]) {
  if (client.includes(token)) errors.push(`ClientDetail forbidden mojibake token ${JSON.stringify(token)}`);
}

const financeAnchor = 'data-client-left-finance-tile="true"';
const financeIndex = client.indexOf(financeAnchor);
if (financeIndex < 0) {
  errors.push('ClientDetail missing left finance tile anchor');
} else {
  const financeWindow = client.slice(Math.max(0, financeIndex - 2500), Math.min(client.length, financeIndex + 4500));
  if (!financeWindow.includes('data-stage231d0-finance-icon-source-truth="payment"')) {
    errors.push('left finance tile missing D0 finance source truth attribute');
  }
  if (!financeWindow.includes('<EntityIcon entity="payment" className="h-4 w-4" />')) {
    errors.push('left finance tile does not use EntityIcon payment');
  }
  if (financeWindow.includes('<EntityIcon entity="case" className="h-4 w-4" />')) {
    errors.push('left finance tile still uses EntityIcon case');
  }
}

const clientFinanceAriaCount = count(client, 'aria-label="Finanse klienta"');
if (clientFinanceAriaCount !== 1) {
  errors.push(`ClientDetail expected exactly one aria-label="Finanse klienta", found ${clientFinanceAriaCount}`);
}

for (const [name, text] of [['run', run], ['obsidian', obsidian]]) {
  for (const token of ['VISUAL SOURCE OF TRUTH', 'audyt ryzyk', 'następny krok', 'STAGE231D0-R4']) {
    if (!text.includes(token)) errors.push(`${name} missing token ${JSON.stringify(token)}`);
  }
}
if (!vst.includes('STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY')) {
  errors.push('VST map missing D0A consistency marker');
}

for (const [name, text] of [['ClientDetail', client], ['run', run], ['obsidian', obsidian], ['VST', vst]]) {
  if (/\n\n$/u.test(text)) errors.push(`${name} has blank line at EOF`);
  if (/[�]/u.test(text)) errors.push(`${name} contains replacement character`);
}

if (errors.length) fail(errors);
console.log(`${STAGE}: PASS`);
