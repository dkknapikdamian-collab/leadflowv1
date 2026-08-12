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

function rejectPattern(file, pattern, label = String(pattern)) {
  const body = read(file);
  if (pattern.test(body)) throw new Error(`${file}: forbidden ${label}`);
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
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual owner entrypoint');
expect('src/styles/owners/closeflow-page-adapters.css', 'main-lead-detail', 'canonical LeadDetail page scope');
expect('src/styles/owners/closeflow-page-adapters.css', 'layout-detail', 'canonical LeadDetail layout adapter');
expect('src/styles/owners/closeflow-rails-and-detail.css', 'lead-detail-action-accordion', 'canonical LeadDetail action adapter');
expect('src/styles/owners/closeflow-responsive-adapters.css', '@media (max-width: 760px)', 'canonical mobile adapter');
rejectPattern('src/pages/LeadDetail.tsx', /<LeadAiFollowupDraft\b/, 'rendered static AI follow-up component');
rejectPattern('src/pages/LeadDetail.tsx', /<LeadAiNextAction\b/, 'rendered static AI next-action component');

expect('src/pages/LeadDetail.tsx', 'startLeadServiceInSupabase', 'lead service persistence remains');
expect('src/pages/LeadDetail.tsx', 'startLeadToCaseHandoff', 'current lead-to-case handoff remains');
expect('src/pages/LeadDetail.tsx', 'caseDetailPath', 'current case navigation remains');
expect('src/pages/LeadDetail.tsx', 'fetchCasesFromSupabase', 'associated case lookup remains');
expect('src/pages/LeadDetail.tsx', 'STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS', 'shared context action source marker');
expect('src/pages/LeadDetail.tsx', 'openLeadContextAction', 'shared lead action launcher remains');
expect('src/pages/LeadDetail.tsx', 'openContextQuickAction({', 'shared context action host remains');
expect('src/pages/LeadDetail.tsx', "openLeadContextAction('task')", 'task creation routes through shared action');
expect('src/pages/LeadDetail.tsx', "openLeadContextAction('event')", 'event creation routes through shared action');
expect('src/pages/LeadDetail.tsx', "window.addEventListener('closeflow:context-action-saved'", 'shared action save listener remains');
reject('src/pages/LeadDetail.tsx', 'isQuickTaskOpen', 'obsolete local quick task modal state');
reject('src/pages/LeadDetail.tsx', 'isQuickEventOpen', 'obsolete local quick event modal state');
expect('src/pages/LeadDetail.tsx', 'insertTaskToSupabase', 'task persistence remains');
expect('src/pages/LeadDetail.tsx', 'insertEventToSupabase', 'event persistence remains');
expect('src/pages/LeadDetail.tsx', 'insertActivityToSupabase', 'note and activity persistence remains');
expect('src/pages/LeadDetail.tsx', 'updateLeadInSupabase', 'lead edit persistence remains');
expect('src/pages/LeadDetail.tsx', 'deleteLeadFromSupabase', 'lead delete persistence remains');
expect('src/pages/LeadDetail.tsx', 'fetchPaymentsFromSupabase', 'lead finance read remains');
expect('src/pages/LeadDetail.tsx', 'createPaymentInSupabase', 'lead finance write remains');
expect('src/pages/LeadDetail.tsx', 'getActivityTimelineTitle', 'activity timeline title remains');
expect('src/pages/LeadDetail.tsx', 'getActivityTimelineDescription', 'activity timeline description remains');
expect('src/pages/LeadDetail.tsx', 'TabsTrigger', 'tabs remain');

console.log('OK: Visual Stage04 LeadDetail guard reconciled with current LeadDetail source truth.');
