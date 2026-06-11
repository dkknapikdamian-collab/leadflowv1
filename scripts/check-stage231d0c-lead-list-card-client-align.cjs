const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function requireIncludes(label, content, token) {
  if (!content.includes(token)) {
    throw new Error(label + ' missing required token: ' + token);
  }
}

function requireNotIncludes(label, content, token) {
  if (content.includes(token)) {
    throw new Error(label + ' contains forbidden token: ' + token);
  }
}

const leads = read('src/pages/Leads.tsx');
const css = read('src/styles/closeflow-record-list-source-truth.css');

const requiredLeadsTokens = [
  'STAGE231D0C_LEAD_LIST_CARD_CLIENT_VIEW_FREEZE',
  'data-stage231d0c-lead-card-client-aligned="true"',
  'data-ui-dictionary="LeadListCard"',
  'cf-lead-row-client-aligned',
  'cf-lead-list-card-name',
  'title={contactLabel}',
  "title={'Wartość: ' + leadValueLabel}",
  'cf-lead-next-action-title',
];

for (const token of requiredLeadsTokens) {
  requireIncludes('Leads.tsx', leads, token);
}

const requiredCssTokens = [
  'STAGE231D0B-R10-R11_FIXED_COLUMN_AXIS',
  'STAGE231D0C_LEAD_LIST_CARD_CLIENT_VIEW_FREEZE',
  '--cf-lead-card-main-col',
  '--cf-lead-card-value-col',
  '--cf-lead-card-action-col',
  '--cf-lead-card-actions-col',
  'data-stage231d0c-lead-card-client-aligned="true"',
  'grid-template-columns: minmax(2.15rem, 2.5rem) var(--cf-lead-card-main-col) var(--cf-lead-card-value-col) var(--cf-lead-card-action-col) var(--cf-lead-card-actions-col)',
  '> .lead-main-cell',
  '> .lead-value-cell',
  '> .lead-action-cell',
  '> .lead-actions',
  '.lead-card-value-pill',
  '.cf-lead-next-action-title',
];

for (const token of requiredCssTokens) {
  requireIncludes('CSS source truth', css, token);
}

requireNotIncludes('Leads runtime', leads, 'data-ui-dictionary="ClientListCard"');

console.log('STAGE231D0C LeadListCard client-aligned card guard: PASS');
