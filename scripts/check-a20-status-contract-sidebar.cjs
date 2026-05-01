#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const domain = read('src/lib/domain-statuses.ts');
for (const token of [
  'export type LeadStatus',
  'export type CaseStatus',
  'export type TaskStatus',
  'export type EventStatus',
  'export type PortalItemStatus',
  'export type AiDraftStatus',
  'export type BillingStatus',
  'normalizeLeadStatus',
  'normalizeCaseStatus',
  'normalizeTaskStatus',
  'normalizeEventStatus',
  'normalizePortalItemStatus',
  'normalizeAiDraftStatus',
  'normalizeBillingStatus',
  'LEAD_STATUS_OPTIONS',
]) {
  expect(domain.includes(token), `domain-statuses.ts missing ${token}`);
}

const statuses = read('src/lib/statuses.ts');
expect(/export \* from ['"]\.\/domain-statuses['"]/.test(statuses), 'statuses.ts must re-export domain-statuses');

const options = read('src/lib/options.ts');
expect(/LEAD_STATUS_OPTIONS/.test(options), 'options.ts must derive STATUS_OPTIONS from domain contract');
expect(!/export const STATUS_OPTIONS = \[\s*\{/.test(options), 'options.ts still has inline lead status list');

const dataContract = read('src/lib/data-contract.ts');
for (const token of [
  'normalizeLeadStatus',
  'normalizeCaseStatus',
  'normalizeTaskStatus',
  'normalizeEventStatus',
  'normalizePortalItemStatus',
  'normalizeAiDraftStatus',
  'normalizeBillingStatus',
]) {
  expect(dataContract.includes(token), `data-contract.ts missing ${token}`);
}

const leadsApi = read('api/leads.ts');
expect(/normalizeLeadStatus/.test(leadsApi), 'api/leads.ts must validate lead status through domain normalizer');
expect(/LEAD_STATUS_VALUES/.test(leadsApi), 'api/leads.ts must use canonical lead status values');

const casesApi = read('api/cases.ts');
expect(/normalizeCaseStatus/.test(casesApi), 'api/cases.ts must validate case status through domain normalizer');
expect(/CASE_STATUS_VALUES/.test(casesApi), 'api/cases.ts must use canonical case status values');

const workItemsApi = read('api/work-items.ts');
expect(/normalizeTaskStatus/.test(workItemsApi), 'api/work-items.ts must validate task status through domain normalizer');
expect(/normalizeEventStatus/.test(workItemsApi), 'api/work-items.ts must validate event status through domain normalizer');

const migrationsDir = path.join(root, 'supabase', 'migrations');
const migrationText = fs.readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .map((name) => fs.readFileSync(path.join(migrationsDir, name), 'utf8'))
  .join('\n');
expect(/leads_status_domain_check/.test(migrationText), 'Supabase migration missing leads status check');
expect(/cases_status_domain_check/.test(migrationText), 'Supabase migration missing cases status check');
expect(/work_items_status_domain_check/.test(migrationText), 'Supabase migration missing work_items status check');
expect(/ai_drafts_status_domain_check/.test(migrationText), 'Supabase migration missing ai_drafts status check');

expect(!fs.existsSync(path.join(root, 'firebase-blueprint.json')), 'firebase-blueprint.json must be archived as legacy');
expect(fs.existsSync(path.join(root, 'docs', 'legacy', 'firebase-blueprint.legacy.json')), 'legacy firebase blueprint archive missing');

const indexCss = read('src/index.css');
expect(/stageA20-sidebar-today-click-fix\.css/.test(indexCss), 'index.css missing A20 sidebar fix import');

const sidebarCss = read('src/styles/stageA20-sidebar-today-click-fix.css');
expect(/nav-group:first-child/.test(sidebarCss), 'A20 sidebar css must target first nav group');
expect(/pointer-events:\s*auto\s*!important/.test(sidebarCss), 'A20 sidebar css must force pointer events for nav');
expect(/z-index:\s*80\s*!important/.test(sidebarCss), 'A20 sidebar css must raise sidebar z-index');

const docs = read('docs/DOMAIN_STATUSES_CONTRACT.md') + '\n' + read('docs/STAGE_A20_STATUS_CONTRACT_SIDEBAR_FIX.md');
for (const token of ['LeadStatus', 'CaseStatus', 'TaskStatus', 'EventStatus', 'PortalItemStatus', 'AiDraftStatus', 'BillingStatus']) {
  expect(docs.includes(token), `docs missing ${token}`);
}

const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a20-status-contract-sidebar'], 'package.json missing check:a20-status-contract-sidebar');

if (fail.length) {
  console.error('A20 status/sidebar guard failed.');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}

console.log('OK: A20 status contract/sidebar guard passed.');