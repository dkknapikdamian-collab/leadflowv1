const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg) { console.error('STAGE231D3_CLIENT_FINANCE_COSTS_ROLLUP: FAIL:', msg); process.exit(1); }
function assertIncludes(file, token, label) {
  const content = read(file);
  if (!content.includes(token)) fail(`${file}: missing ${label}: ${token}`);
}

console.log('STAGE231D3_CLIENT_FINANCE_COSTS_ROLLUP: start');

const finance = 'src/components/finance/FinanceMiniSummary.tsx';
const supabase = 'src/lib/supabase-fallback.ts';
const pkg = JSON.parse(read('package.json'));

assertIncludes(finance, 'STAGE231D3_CLIENT_FINANCE_COSTS_ROLLUP_MASS_GUARD_V1', 'stage marker');
assertIncludes(finance, 'fetchCaseCostsFromSupabase', 'client finance fetches costs');
assertIncludes(finance, 'getCaseCostsSummary', 'client finance uses central cost summary');
assertIncludes(finance, 'CASE_COST_FINANCE_LABELS.costsToReimburse', 'costs label source truth');
assertIncludes(finance, 'CASE_COST_FINANCE_LABELS.totalToCollect', 'total-to-collect label source truth');
assertIncludes(finance, 'loadedCaseCosts', 'loaded costs state');
assertIncludes(finance, 'data-stage231d3-client-costs-to-reimburse="true"', 'client costs metric marker');
assertIncludes(finance, 'data-stage231d3-client-total-to-collect="true"', 'client total metric marker');
assertIncludes(finance, 'data-stage231d3-row-costs-to-reimburse="true"', 'row costs metric marker');
assertIncludes(finance, 'data-stage231d3-row-total-to-collect="true"', 'row total metric marker');

assertIncludes(supabase, 'export async function fetchCaseCostsFromSupabase', 'case costs fetch helper');
assertIncludes(supabase, "query.set('resource', 'costs')", 'consolidated costs resource query');
assertIncludes(supabase, "'/api/cases?resource=costs'", 'consolidated costs create endpoint');
assertIncludes(supabase, 'export async function createCaseCostInSupabase', 'case costs create helper');

if (fs.existsSync(path.join(root, 'api/case-costs.ts'))) fail('api/case-costs.ts must not exist on Vercel Hobby');
const apiFiles = fs.readdirSync(path.join(root, 'api')).filter((name) => name.endsWith('.ts'));
if (apiFiles.length > 12) fail(`api function budget exceeded: ${apiFiles.length}/12`);

if (!pkg.scripts?.['check:stage231d3-client-finance-costs-rollup']) fail('missing package script check:stage231d3-client-finance-costs-rollup');
if (!pkg.scripts?.['test:stage231d3-client-finance-costs-rollup']) fail('missing package script test:stage231d3-client-finance-costs-rollup');

const forbidden = [
  'scripts/check-stage231d3r1',
  'scripts/check-stage231d3r2',
  'scripts/check-stage231d3r3',
  'scripts/check-stage231d3r4',
  'scripts/check-stage231d3r5',
];
for (const token of forbidden) {
  if (read('package.json').includes(token)) fail(`package contains failed D3 leftover token: ${token}`);
}

console.log(`api function files: ${apiFiles.length} / 12`);
console.log('STAGE231D3_CLIENT_FINANCE_COSTS_ROLLUP: PASS');
