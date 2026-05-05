const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

test('Stage88 data contract defines simple case financial summary', () => {
  const contract = read('src/lib/data-contract.ts');

  assert.match(contract, /expectedRevenue:\s*\[/);
  assert.match(contract, /paidAmount:\s*\[/);
  assert.match(contract, /remainingAmount:\s*\[/);
  assert.match(contract, /currency:\s*\[/);
  assert.match(contract, /remainingAmount:\s*number/);
  assert.match(contract, /Math\.max\(0, expectedRevenue - paidAmount\)/);
});

test('Stage88 APIs persist and expose financial fields for leads cases payments', () => {
  const leadsApi = read('api/leads.ts');
  const casesApi = read('api/cases.ts');
  const payments = read('src/server/payments.ts');

  assert.match(leadsApi, /payload\.currency = normalizeCurrency\(body\.currency\)/);
  assert.match(leadsApi, /expected_revenue:/);
  assert.match(leadsApi, /paid_amount:/);

  assert.match(casesApi, /expected_revenue:/);
  assert.match(casesApi, /paid_amount:/);
  assert.match(casesApi, /currency:/);

  assert.match(payments, /recalculateCasePaidAmount/);
  assert.match(payments, /PAID_PAYMENT_STATUSES/);
  assert.match(payments, /status=in\.\(\$\{statuses\}\)/);
});

test('Stage88 Supabase migration exists for case financial baseline', () => {
  const migration = read('supabase/sql/2026-05-05_case_financial_baseline_stage88.sql');
  const readme = read('supabase/sql/README.md');

  assert.match(migration, /alter table if exists public\.cases/);
  assert.match(migration, /add column if not exists expected_revenue/);
  assert.match(migration, /add column if not exists paid_amount/);
  assert.match(migration, /add column if not exists currency/);
  assert.match(migration, /alter table if exists public\.leads/);
  assert.match(readme, /2026-05-05_case_financial_baseline_stage88\.sql/);
});
