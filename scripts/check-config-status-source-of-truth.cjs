#!/usr/bin/env node
const fs = require('node:fs');
const assert = require('node:assert/strict');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function must(source, token, label) {
  assert.ok(source.includes(token), `${label} missing: ${token}`);
}

function mustNot(source, pattern, label) {
  const match = typeof pattern === 'string' ? source.includes(pattern) : pattern.test(source);
  assert.equal(match, false, `${label} forbidden pattern found: ${pattern}`);
}

const configFiles = [
  'src/lib/config/lead-status.ts',
  'src/lib/config/case-status.ts',
  'src/lib/config/client-status.ts',
  'src/lib/config/funnel-stages.ts',
  'src/lib/config/badges.ts',
  'src/lib/config/owner-risk.ts',
  'src/lib/config/calendar-status.ts',
  'src/lib/config/finance.ts',
  'src/lib/config/index.ts',
];

for (const file of configFiles) {
  assert.ok(fs.existsSync(file), `config file missing: ${file}`);
}

const leadConfig = read('src/lib/config/lead-status.ts');
const caseConfig = read('src/lib/config/case-status.ts');
const clientConfig = read('src/lib/config/client-status.ts');
const funnelConfig = read('src/lib/config/funnel-stages.ts');
const badgesConfig = read('src/lib/config/badges.ts');
const calendarConfig = read('src/lib/config/calendar-status.ts');
const financeConfig = read('src/lib/config/finance.ts');
const indexConfig = read('src/lib/config/index.ts');

for (const token of [
  'LEAD_STATUS_CONFIG',
  'LEAD_STATUS_OPTIONS',
  'getLeadStatusLabel',
  'getLeadStatusTone',
  'getLeadStatusPillClass',
]) must(leadConfig, token, 'lead status config');

for (const token of [
  'CASE_STATUS_CONFIG',
  'CASE_STATUS_OPTIONS',
  'CASE_ITEM_STATUS_LABELS',
  'CASE_CLOSED_STATUSES',
  'getCaseStatusLabel',
  'getCaseStatusHint',
  'getCaseItemStatusLabel',
  'getCaseClientPillClass',
]) must(caseConfig, token, 'case status config');

for (const token of [
  'CLIENT_STATUS_CONFIG',
  'CLIENT_STATUS_OPTIONS',
  'getClientStatusLabel',
]) must(clientConfig, token, 'client status config');

for (const token of [
  'FUNNEL_STAGE_CONFIG',
  'FUNNEL_OWNER_TILE_CONFIG',
  'resolveFunnelStageFilterTone',
  'getOwnerRiskLabel',
  'getOwnerRiskBadgeClass',
]) must(funnelConfig, token, 'funnel config');

for (const token of [
  'OWNER_SILENCE_BADGE_LABELS',
  'getStatusPillClass',
  'getClientNextActionToneClass',
]) must(badgesConfig, token, 'badge config');

for (const token of [
  'TASK_STATUS_LABELS',
  'CALENDAR_EVENT_STATUS_LABELS',
  'isDoneStatus',
]) must(calendarConfig, token, 'calendar status config');

for (const token of [
  'PAYMENT_STATUS_LABELS',
  'PAYMENT_TYPE_LABELS',
  'getBillingStatusLabel',
]) must(financeConfig, token, 'finance config');

for (const token of [
  "export * from './lead-status'",
  "export * from './case-status'",
  "export * from './client-status'",
  "export * from './funnel-stages'",
  "export * from './badges'",
  "export * from './calendar-status'",
  "export * from './finance'",
  "export * from './owner-risk'",
]) must(indexConfig, token, 'config barrel');

const activePages = [
  'src/pages/Leads.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/Cases.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/SalesFunnel.tsx',
];

for (const file of activePages) {
  const source = read(file);
  must(source, '../lib/config/', `${file} config import`);
  mustNot(source, /const\s+(?:LEAD_STATUS_LABELS|CASE_STATUS_LABELS|CASE_STATUS_HINTS|ITEM_STATUS_LABELS|TASK_STATUS_LABELS|EVENT_STATUS_LABELS|STATUS_COLORS|STATUS_COLOR_MAP|statusColorMap|leadStatusLabels|caseStatusLabels)\b/, file);
  mustNot(source, /const\s+STATUS_OPTIONS\s*=\s*\[/, file);
}

const casesLib = read('src/lib/cases.ts');
must(casesLib, "from './config/case-status'", 'cases bridge must reuse config');
mustNot(casesLib, /switch\s*\(\s*normalizeCaseStatus\(status\)\s*\)/, 'cases bridge local status switch');

const optionsLib = read('src/lib/options.ts');
must(optionsLib, "from './config/lead-status'", 'options lead status source');
mustNot(optionsLib, "from './domain-statuses'", 'options local domain direct status source');

console.log(JSON.stringify({
  ok: true,
  guard: 'guard:config:status-source-of-truth',
  configFiles: configFiles.length,
  activePagesChecked: activePages.length,
  contract: [
    'lead/case/client status labels and tones live in src/lib/config',
    'funnel owner tiles and risk labels live in src/lib/config/funnel-stages',
    'work item done/calendar labels live in src/lib/config/calendar-status',
    'active page components cannot define local status label/color maps',
  ],
}, null, 2));
