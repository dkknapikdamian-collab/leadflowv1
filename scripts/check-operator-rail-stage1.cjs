#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (message) => { console.error('FAIL:', message); process.exit(1); };
const ok = (message) => console.log('OK:', message);

[
  'src/components/operator-rail/OperatorSideCard.tsx',
  'src/components/operator-rail/SimpleFiltersCard.tsx',
  'src/components/operator-rail/TopValueRecordsCard.tsx',
  'src/components/operator-rail/index.ts',
].forEach((rel) => {
  if (!exists(rel)) fail('Missing operator rail component: ' + rel);
});

const clients = read('src/pages/Clients.tsx');
const leads = read('src/pages/Leads.tsx');

if (!clients.includes("from '../components/operator-rail'")) fail('Clients.tsx does not import operator-rail.');
if (!clients.includes('<SimpleFiltersCard')) fail('Clients.tsx does not use SimpleFiltersCard.');
if (!clients.includes('<OperatorSideCard')) fail('Clients.tsx does not use OperatorSideCard for lead attention rail.');
if (/<aside\s+className="right-card"/.test(clients)) fail('Clients.tsx still contains raw aside.right-card.');
if (!clients.includes('data-clients-lead-attention-rail')) fail('Clients lead attention marker was lost.');
if (!clients.includes('leadsNeedingClientOrCaseLink.length')) fail('Clients lead attention data flow was lost.');
if (!clients.includes('slice(0, 5)')) fail('Clients lead attention top-5 limit was lost.');

if (!leads.includes("from '../components/operator-rail'")) fail('Leads.tsx does not import operator-rail.');
if (!leads.includes('<TopValueRecordsCard')) fail('Leads.tsx does not use TopValueRecordsCard.');
if (/<aside\s+className="right-card lead-right-card lead-top-relations"/.test(leads)) fail('Leads.tsx still contains raw top value aside.');
if (!leads.includes('data-relation-value-board')) fail('Leads relation value marker was lost.');
if (!leads.includes('mostValuableRelations.map')) fail('Leads most valuable data flow was lost.');
if (!leads.includes('slice(0, 5)')) fail('Leads top value top-5 limit was lost.');

const operatorSideCard = read('src/components/operator-rail/OperatorSideCard.tsx');
if (!operatorSideCard.includes('right-card')) fail('OperatorSideCard must preserve right-card class contract.');
if (operatorSideCard.includes('right-card-new') || operatorSideCard.includes('lead-top-relations-v2') || operatorSideCard.includes('clients-top-relations-v2')) {
  fail('Forbidden v2/new right rail class detected.');
}

ok('operator rail Stage 1 contract is wired.');
