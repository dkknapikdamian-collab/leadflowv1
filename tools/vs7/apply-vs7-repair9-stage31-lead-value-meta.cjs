#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const leadsPath = path.join(root, 'src/pages/Leads.tsx');
if (!fs.existsSync(leadsPath)) {
  throw new Error('Missing src/pages/Leads.tsx');
}

let source = fs.readFileSync(leadsPath, 'utf8');
const before = source;

const signatureOld = "function buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string) {";
const signatureNew = "function buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string, leadValueLabel: string = '') {";

if (source.includes(signatureOld)) {
  source = source.replace(signatureOld, signatureNew);
} else if (!source.includes(signatureNew)) {
  throw new Error('Cannot find buildLeadCompactMeta signature to update');
}

if (!source.includes('function buildLeadValueLabel(lead: any)')) {
  const insertBefore = /\nfunction buildLeadCompactMeta\(lead: any, linkedCase: CaseRecord \| undefined, sourceLabel: string, leadValueLabel: string = ''\) \{/;
  const helper = `
function buildLeadValueLabel(lead: any) {
  const value = Number(lead?.dealValue || lead?.value || lead?.budget || 0);
  if (!Number.isFinite(value) || value <= 0) return '';
  return value.toLocaleString('pl-PL') + ' PLN';
}
`;
  if (!insertBefore.test(source)) {
    throw new Error('Cannot find buildLeadCompactMeta insertion point');
  }
  source = source.replace(insertBefore, helper + '\nfunction buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string, leadValueLabel: string = \'\') {');
}

const returnWithValue = /return\s*\[\s*sourceLabel,\s*leadValueLabel,\s*company,\s*contact,\s*caseLabel,\s*\]\.filter\(Boolean\)\.join\(' · '\);/m;
const returnWithoutValue = /return\s*\[\s*sourceLabel,\s*company,\s*contact,\s*caseLabel,\s*\]\.filter\(Boolean\)\.join\(' · '\);/m;
if (!returnWithValue.test(source)) {
  if (!returnWithoutValue.test(source)) {
    throw new Error('Cannot find buildLeadCompactMeta return list to update');
  }
  source = source.replace(returnWithoutValue, "return [\n    sourceLabel,\n    leadValueLabel,\n    company,\n    contact,\n    caseLabel,\n  ].filter(Boolean).join(' · ');");
}

source = source.replace(
  /const sourceLabel = formatLeadSourceLabel\(lead\.source\);\r?\n(?!\s*const leadValueLabel = buildLeadValueLabel\(lead\);)/g,
  "const sourceLabel = formatLeadSourceLabel(lead.source);\n      const leadValueLabel = buildLeadValueLabel(lead);\n",
);

source = source.replaceAll(
  'buildLeadCompactMeta(lead, linkedCase, sourceLabel)',
  'buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel)',
);

if (!source.includes('buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel)')) {
  throw new Error('Stage31 expected 4-argument buildLeadCompactMeta call is still missing');
}
if (!source.includes('function buildLeadValueLabel(lead: any)')) {
  throw new Error('Stage31 lead value label helper is missing');
}
if (!source.includes('leadValueLabel,')) {
  throw new Error('Stage31 lead value label is not included in compact meta list');
}

if (source !== before) {
  fs.writeFileSync(leadsPath, source, 'utf8');
}

console.log('CLOSEFLOW_VS7_REPAIR9_STAGE31_LEAD_VALUE_META_PATCHED');
