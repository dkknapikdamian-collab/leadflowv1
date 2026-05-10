#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: rel, message: 'Missing file' });
    return '';
  }
  results.push({ level: 'PASS', scope: rel, message: 'File exists' });
  return fs.readFileSync(full, 'utf8');
}
function pass(scope, message){ results.push({ level:'PASS', scope, message }); }
function fail(scope, message){ results.push({ level:'FAIL', scope, message }); }
function includes(scope, text, needle, message){ text.includes(needle) ? pass(scope, message || `Found ${needle}`) : fail(scope, `${message || 'Missing'} [needle=${JSON.stringify(needle)}]`); }
function notIncludes(scope, text, needle, message){ !text.includes(needle) ? pass(scope, message || `Absent ${needle}`) : fail(scope, `${message || 'Forbidden'} [needle=${JSON.stringify(needle)}]`); }
function section(title){ console.log(`\n== ${title} ==`); }

const files = {
  component: 'src/components/finance/LeadValuePanel.tsx',
  css: 'src/styles/finance/closeflow-finance.css',
  leads: 'src/pages/Leads.tsx',
  leadDetail: 'src/pages/LeadDetail.tsx',
  relation: 'src/lib/relation-value.ts',
  dataContract: 'src/lib/data-contract.ts',
  fallback: 'src/lib/supabase-fallback.ts',
  apiLeads: 'api/leads.ts',
  migration: 'supabase/migrations/20260509_lead_value_ux_fin4.sql',
  doc: 'docs/finance/CLOSEFLOW_LEAD_VALUE_UX_2026-05-09.md',
};

const component = read(files.component);
const css = read(files.css);
const leads = read(files.leads);
const leadDetail = read(files.leadDetail);
const relation = read(files.relation);
const dataContract = read(files.dataContract);
const fallback = read(files.fallback);
const apiLeads = read(files.apiLeads);
const migration = read(files.migration);
const doc = read(files.doc);

section('FIN-4 marker');
for (const [scope, text] of [[files.component, component], [files.css, css], [files.migration, migration], [files.doc, doc]]) {
  includes(scope, text, 'FIN-4_CLOSEFLOW_LEAD_VALUE_UX_V1', 'FIN-4 marker exists');
}

section('LeadValuePanel contract');
for (const needle of ['export function LeadValuePanel', 'Wartość i prowizja opcjonalnie', 'Wartość potencjalna', 'Model prowizji', 'Procent prowizji', 'Notatka finansowa', 'normalizeCommissionMode', 'calculateCommissionAmount']) {
  includes(files.component, component, needle, `Component contains ${needle}`);
}
notIncludes(files.component, component, 'fetch(', 'Component has no raw fetch');
notIncludes(files.component, component, 'window.location.reload', 'Component has no reload');
notIncludes(files.component, component, 'updateLeadInSupabase', 'Component delegates persistence');

section('Visual source of truth');
for (const needle of ['.cf-finance-lead-value-panel', '.cf-finance-lead-value-panel__toggle', '.cf-finance-lead-value-panel__body', '.cf-finance-lead-value-panel__actions']) {
  includes(files.css, css, needle, `Finance CSS contains ${needle}`);
}
includes(files.component, component, "../ui/button", 'Uses shared Button');
includes(files.component, component, "../ui/input", 'Uses shared Input');

section('Leads integration');
includes(files.leads, leads, "../components/finance/LeadValuePanel", 'Leads imports LeadValuePanel');
includes(files.leads, leads, '<LeadValuePanel', 'Leads renders LeadValuePanel');
for (const needle of ['commissionMode', 'commissionRate', 'commissionAmount', 'financeNote']) {
  includes(files.leads, leads, needle, `Leads handles ${needle}`);
}

section('LeadDetail integration');
includes(files.leadDetail, leadDetail, "../components/finance/LeadValuePanel", 'LeadDetail imports LeadValuePanel');
includes(files.leadDetail, leadDetail, '<LeadValuePanel', 'LeadDetail renders LeadValuePanel');
for (const needle of ['commissionMode', 'commissionRate', 'commissionAmount', 'financeNote']) {
  includes(files.leadDetail, leadDetail, needle, `LeadDetail handles ${needle}`);
}

section('Persistence contract');
for (const needle of ['contract_value', 'commission_mode', 'commission_base', 'commission_rate', 'commission_amount', 'commission_status', 'finance_note']) {
  includes(files.migration, migration, needle, `Migration contains ${needle}`);
  includes(files.apiLeads, apiLeads, needle, `api/leads handles ${needle}`);
}
includes(files.apiLeads, apiLeads, 'applyLeadFinancePayload', 'api/leads uses FIN-4 finance payload helper');
includes(files.fallback, fallback, 'commissionMode?:', 'supabase fallback type has commissionMode');
includes(files.fallback, fallback, 'financeNote?:', 'supabase fallback type has financeNote');

section('Data normalization and relation value');
for (const needle of ['contractValue', 'commissionMode', 'commissionBase', 'commissionRate', 'commissionAmount', 'commissionStatus', 'financeNote']) {
  includes(files.dataContract, dataContract, needle, `data-contract contains ${needle}`);
}
for (const needle of ['leadValue', 'lead_value', 'leadPotentialValue', 'lead_potential_value']) {
  includes(files.relation, relation, needle, `relation-value contains ${needle}`);
}

section('Documentation');
for (const needle of ['Źródłem prawdy dla wyglądu', 'Nie tworzy lokalnej wyspy wizualnej', 'Leads.tsx', 'LeadDetail.tsx']) {
  includes(files.doc, doc, needle, `Doc contains ${needle}`);
}

section('Report');
for (const item of results) console.log(`${item.level} ${item.scope}: ${item.message}`);
const failed = results.filter((item) => item.level === 'FAIL');
console.log(`\nSummary: ${results.length - failed.length} pass, ${failed.length} fail.`);
if (failed.length) {
  console.error('\nFAIL CLOSEFLOW_LEAD_VALUE_UX_FIN4_FAILED');
  process.exit(1);
}
console.log('\nCLOSEFLOW_LEAD_VALUE_UX_FIN4_OK');
