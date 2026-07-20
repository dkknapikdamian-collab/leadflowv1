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

expect('src/components/Layout.tsx', 'VISUAL_STAGE_04_LEAD_DETAIL_ROUTE_SCOPE', 'Stage04 route marker');
{
  const layout = read('src/components/Layout.tsx');
  if (layout.includes("const isLeadDetailRoute = location.pathname.startsWith('/leads/')") || layout.includes("const isLeadDetailRoute = /^\\/leads\\/[^/]+$/.test(location.pathname);")) {
    console.log('OK: src/components/Layout.tsx contains lead detail route detection');
  } else {
    throw new Error('src/components/Layout.tsx: missing lead detail route detection');
  }
}
expect('src/components/Layout.tsx', 'main-lead-detail', 'main-lead-detail class');
expect('src/components/Layout.tsx', "data-visual-stage-lead-detail={isLeadDetailRoute ? '04-lead-detail' : undefined}", 'Stage04 data marker');

reject('src/index.css', 'visual-stage04-lead-detail.css', 'inactive Stage04 LeadDetail CSS import');
expect('src/pages/LeadDetail.tsx', "../styles/visual-stage14-lead-detail-vnext.css", 'current Stage14 LeadDetail visual import');
expect('src/pages/LeadDetail.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Stage211C canvas import');
expect('src/pages/LeadDetail.tsx', "../styles/closeflow-shared-quick-actions-bar-stage227e3.css", 'current shared quick actions visual import');
expect('src/pages/LeadDetail.tsx', "../styles/closeflow-lead-detail-sales-signal-stage227e4.css", 'current sales signal visual import');
expect('src/pages/LeadDetail.tsx', 'STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_CARD', 'current no-static-AI-card source marker');
expect('src/pages/LeadDetail.tsx', 'STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_RAIL', 'current no-static-AI-rail source marker');
reject('src/pages/LeadDetail.tsx', 'LeadAiFollowupDraft', 'obsolete static AI follow-up component');
expect('src/pages/LeadDetail.tsx', 'LeadAiNextAction', 'AI next-action engine remains outside static rail');

expect('src/pages/LeadDetail.tsx', 'startLeadServiceInSupabase', 'lead to case service flow remains');
expect('src/pages/LeadDetail.tsx', 'associatedCase', 'associated case state remains');
expect('src/pages/LeadDetail.tsx', 'showServiceBanner', 'service banner remains');
expect('src/pages/LeadDetail.tsx', 'isQuickTaskOpen', 'quick task modal remains');
expect('src/pages/LeadDetail.tsx', 'isQuickEventOpen', 'quick event modal remains');
expect('src/pages/LeadDetail.tsx', 'handleCreateQuickTask', 'quick task create flow remains');
expect('src/pages/LeadDetail.tsx', 'handleCreateQuickEvent', 'quick event create flow remains');
expect('src/pages/LeadDetail.tsx', 'handleAddNote', 'note create flow remains');
expect('src/pages/LeadDetail.tsx', 'handleUpdateLead', 'lead edit flow remains');
expect('src/pages/LeadDetail.tsx', 'handleDeleteLead', 'lead delete flow remains');
expect('src/pages/LeadDetail.tsx', 'getLeadFinance', 'lead finance remains');
expect('src/pages/LeadDetail.tsx', 'TabsTrigger', 'tabs remain');

expect('src/styles/visual-stage04-lead-detail.css', 'VISUAL_STAGE_04_LEAD_DETAIL_UI_SYSTEM', 'Stage04 reference CSS marker');
expect('src/styles/visual-stage04-lead-detail.css', '.main-lead-detail', 'historical scoped CSS');
expect('src/styles/visual-stage04-lead-detail.css', 'layout-detail', 'historical layout-detail styling');
expect('src/styles/visual-stage04-lead-detail.css', 'person-card', 'historical person-card styling');
expect('src/styles/visual-stage04-lead-detail.css', 'hero.light', 'historical hero light styling');
expect('src/styles/visual-stage04-lead-detail.css', '@media (max-width: 760px)', 'historical mobile polish');
console.log('OK: Visual Stage04 LeadDetail guard reconciled with current LeadDetail source truth.');
