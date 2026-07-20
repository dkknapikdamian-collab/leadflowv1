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
expect('src/pages/Leads.tsx', "../styles/visual-stage20-lead-form-vnext.css", 'current Stage20 lead form CSS import');
expect('src/pages/Leads.tsx', "../styles/closeflow-page-header-v2.css", 'current page header CSS import');
expect('src/pages/Leads.tsx', "../styles/closeflow-record-list-source-truth.css", 'current record-list CSS import');
expect('src/pages/Leads.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Stage211C canvas import');
expect('src/pages/Leads.tsx', "../styles/closeflow-canvas-source-truth-stage211e.css", 'current Stage211E canvas import');
expect('src/pages/Leads.tsx', 'VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD', 'current Leads full rebuild marker');
expect('src/pages/Leads.tsx', 'VISUAL_STAGE18_LEADS_HTML_HARD_1TO1', 'current Stage18 Leads marker');
expect('src/pages/Leads.tsx', 'STAGE231D0C_LEAD_LIST_CARD_CLIENT_VIEW_FREEZE', 'current frozen list-card shell marker');
expect('src/pages/Leads.tsx', 'STAGE226R10_LEAD_CLIENT_SEPARATION_RUNTIME', 'current lead/client separation marker');

expect('src/styles/visual-stage03-leads.css', 'VISUAL_STAGE_03_LEADS_UI_SYSTEM', 'Stage03 reference CSS marker');
expect('src/styles/visual-stage03-leads.css', '.main-leads', 'historical scoped CSS');
expect('src/styles/visual-stage03-leads.css', 'grid-template-columns: repeat(5', 'historical grid-5 styling');
expect('src/styles/visual-stage03-leads.css', 'data-stage32-leads-value-layout', 'historical relation rail styling');
expect('src/styles/visual-stage03-leads.css', '@media (max-width:760px)', 'historical mobile polish');

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
