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
expect('src/components/Layout.tsx', 'VISUAL_STAGE_04_LEAD_DETAIL_ROUTE_SCOPE', 'Stage 04 route marker');
{
  const layout = read('src/components/Layout.tsx');
  if (layout.includes("const isLeadDetailRoute = location.pathname.startsWith('/leads/')") || layout.includes("const isLeadDetailRoute = /^\\/leads\\/[^/]+$/.test(location.pathname);")) {
    console.log('OK: src/components/Layout.tsx contains lead detail route detection');
  } else {
    throw new Error('src/components/Layout.tsx: missing lead detail route detection');
  }
}
expect('src/components/Layout.tsx', 'main-lead-detail', 'main-lead-detail class');
expect('src/components/Layout.tsx', "data-visual-stage-lead-detail={isLeadDetailRoute ? '04-lead-detail' : undefined}", 'Stage 04 data marker');
expect('src/pages/LeadDetail.tsx', 'LeadAiFollowupDraft', 'AI follow-up component remains');
expect('src/pages/LeadDetail.tsx', 'LeadAiNextAction', 'AI next action component remains');
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
expect('src/styles/visual-stage04-lead-detail.css', 'VISUAL_STAGE_04_LEAD_DETAIL_UI_SYSTEM', 'Stage 04 CSS marker');
expect('src/styles/visual-stage04-lead-detail.css', '.main-lead-detail', 'scoped CSS');
expect('src/styles/visual-stage04-lead-detail.css', 'layout-detail', 'layout-detail styling');
expect('src/styles/visual-stage04-lead-detail.css', 'person-card', 'person-card styling');
expect('src/styles/visual-stage04-lead-detail.css', 'hero.light', 'hero light styling');
expect('src/styles/visual-stage04-lead-detail.css', '@media (max-width: 760px)', 'mobile polish');
expect('src/index.css', '@import "./styles/visual-stage04-lead-detail.css";', 'Stage 04 CSS import');
console.log('OK: Visual Stage 04 LeadDetail guard passed.');
