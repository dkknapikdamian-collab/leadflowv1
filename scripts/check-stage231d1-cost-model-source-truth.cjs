const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const STAGE = 'STAGE231D1_COST_MODEL_SOURCE_TRUTH';
const failures = [];

function read(rel) {
  const abs = path.join(repo, rel);
  if (!fs.existsSync(abs)) {
    failures.push(`missing required file: ${rel}`);
    return '';
  }
  return fs.readFileSync(abs, 'utf8');
}

function requireToken(rel, token, label = token) {
  const text = read(rel);
  if (!text.includes(token)) failures.push(`${rel}: missing token ${JSON.stringify(label)}`);
}

function forbidToken(rel, token, label = token) {
  const text = read(rel);
  if (text.includes(token)) failures.push(`${rel}: forbidden token ${JSON.stringify(label)}`);
}

function assertNoMojibake(rel) {
  const text = read(rel);
  for (const bad of ['Ă', 'Ĺ', 'Ä', 'Å', 'Â', '�', 'ďż˝']) {
    if (text.includes(bad)) failures.push(`${rel}: mojibake/replacement char detected: ${bad}`);
  }
}

console.log(`${STAGE}: start`);

const costFile = 'src/lib/finance/case-costs-source.ts';
const sourceFile = 'src/lib/finance/case-finance-source.ts';
const packageFile = 'package.json';
const runFile = '_project/runs/STAGE231D1_COST_MODEL_SOURCE_TRUTH_RUN.md';
const obsidianFile = '_project/obsidian_payloads/STAGE231D1_COST_MODEL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md';

requireToken(costFile, STAGE);
requireToken(costFile, 'CASE_COST_FINANCE_LABELS');
requireToken(costFile, "costsIncurred: 'Koszty poniesione'");
requireToken(costFile, "costsToReimburse: 'Koszty do zwrotu'");
requireToken(costFile, "costsReimbursed: 'Koszty zwrócone'");
requireToken(costFile, "totalToCollect: 'Razem do pobrania'");
requireToken(costFile, 'CASE_COST_STATUSES');
requireToken(costFile, 'CASE_COST_KINDS');
requireToken(costFile, 'normalizeCaseCost(');
requireToken(costFile, 'normalizeCaseCosts(');
requireToken(costFile, 'getCaseCostsSummary(');
requireToken(costFile, 'getCaseTotalToCollectSummary(');
requireToken(costFile, 'commissionRemainingAmount + costsToReimburseAmount');
requireToken(costFile, "source: rows.length > 0 ? 'case_costs' : 'empty'");

requireToken(sourceFile, "export * from './case-costs-source.js';");
requireToken(packageFile, 'check:stage231d1-cost-model-source-truth');
requireToken(packageFile, 'test:stage231d1-cost-model-source-truth');

for (const rel of [runFile, obsidianFile]) {
  requireToken(rel, STAGE);
  requireToken(rel, 'VISUAL SOURCE OF TRUTH');
  requireToken(rel, 'audyt ryzyk');
  requireToken(rel, 'następny krok');
  requireToken(rel, 'D1 nie dodaje SQL');
  requireToken(rel, 'bez zmian runtime UI');
}

for (const rel of [costFile, runFile, obsidianFile]) assertNoMojibake(rel);
forbidToken(costFile, 'width: 7');
forbidToken(costFile, 'height: 1');
forbidToken(costFile, 'font-size: 13px');
forbidToken(costFile, 'font-size: 17px');
forbidToken(costFile, 'font-size: 19px');

if (failures.length) {
  console.error(`${STAGE}: FAIL`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`${STAGE}: PASS`);
