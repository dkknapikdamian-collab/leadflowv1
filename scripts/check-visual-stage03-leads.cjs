#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
}

function expect(file, text, label = text) {
  const body = read(file);
  if (!body.includes(text)) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}

function reject(file, text, label = text) {
  const body = read(file);
  if (body.includes(text)) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}

expect('src/components/Layout.tsx', 'VISUAL_STAGE_03_LEADS_ROUTE_SCOPE', 'Stage03 route marker');
expect('src/components/Layout.tsx', "const isLeadsRoute = location.pathname === '/leads';", 'leads route detection');
expect('src/components/Layout.tsx', 'main-leads', 'main-leads class');
expect('src/components/Layout.tsx', "data-visual-stage-leads={isLeadsRoute ? '03-leads' : undefined}", 'Stage03 data marker');

reject('src/index.css', 'visual-stage03-leads.css', 'inactive Stage03 Leads CSS import');
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual source-truth entrypoint');
expect('src/pages/Leads.tsx', "../styles/closeflow-record-list-source-truth.css", 'current record-list CSS import');
expect('src/styles/closeflow-visual-source-truth.css', './owners/closeflow-page-header-responsive.css', 'page-header semantic owner');
expect('src/styles/closeflow-visual-source-truth.css', './owners/closeflow-records-and-rails.css', 'records/rails semantic owner');
expect('src/styles/closeflow-visual-source-truth.css', './owners/closeflow-page-adapters.css', 'page adapter semantic owner');
expect('src/styles/owners/closeflow-responsive-adapters.css', 'LF-UI-SOT-007_OWNER', 'responsive scoped-owner evidence');
reject('src/styles/closeflow-visual-source-truth.css', 'visual-stage03-leads.css', 'historical Stage03 CSS in active graph');

expect('src/pages/Leads.tsx', "consumeGlobalQuickAction() === 'lead'", 'global lead trigger compatibility');
expect('src/pages/Leads.tsx', 'const [isNewLeadOpen, setIsNewLeadOpen]', 'add lead modal');
expect('src/pages/Leads.tsx', 'handleCreateLead', 'create lead flow');
expect('src/pages/Leads.tsx', 'insertLeadToSupabase', 'lead persistence');
expect('src/pages/Leads.tsx', 'findEntityConflictsInSupabase', 'duplicate conflict preflight');
expect('src/pages/Leads.tsx', 'EntityConflictDialog', 'duplicate conflict resolution UI');
expect('src/pages/Leads.tsx', 'handleArchiveLead', 'archive lead flow');
expect('src/pages/Leads.tsx', 'handleRestoreLead', 'restore lead flow');
expect('src/pages/Leads.tsx', 'toggleTrashView', 'trash toggle');
expect('src/pages/Leads.tsx', 'searchQuery', 'search state');
expect('src/pages/Leads.tsx', 'StatShortcutCard', 'metric filters');
expect('src/pages/Leads.tsx', 'SimpleFiltersCard', 'current simple filters rail');
expect('src/pages/Leads.tsx', 'TopValueRecordsCard', 'current top-value rail');
expect('src/pages/Leads.tsx', 'buildContactCadenceGrid', 'contact cadence filter');
expect('src/pages/Leads.tsx', 'buildLostLeadRescue', 'lost lead rescue filter');
expect('src/pages/Leads.tsx', 'sanitizeNewLeadCreatePayloadA1', 'lead-only creation sanitization');
expect('src/pages/Leads.tsx', 'ConfirmDialog', 'archive confirmation contract');

console.log('OK: Visual Stage03 Leads guard reconciled with current Leads source truth.');
