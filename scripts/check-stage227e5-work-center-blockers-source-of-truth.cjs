const fs = require('fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL STAGE227E5_WORK_CENTER_BLOCKERS_SOURCE_OF_TRUTH: ${message}`);
  process.exit(1);
}

function mustContain(source, fragment, label = fragment) {
  if (!source.includes(fragment)) fail(`missing: ${label}`);
  pass(`contains: ${label}`);
}

function mustNotContain(source, fragment, label = fragment) {
  if (source.includes(fragment)) fail(`forbidden: ${label}`);
  pass(`not contains: ${label}`);
}

mustContain(lead, 'STAGE227E5_WORK_CENTER_BLOCKERS_SOURCE_OF_TRUTH', 'stage marker');
mustContain(lead, 'data-stage227e5-work-center-blockers-source="true"', 'central work center E5 marker');
mustContain(lead, 'data-stage228b-lead-work-action-center="true"', 'work action center remains');
mustContain(lead, 'data-stage228d-lead-action-center-accordion="true"', 'accordion source remains');
mustContain(lead, "key: 'next' as LeadActionAccordionGroup", 'next group remains');
mustContain(lead, "key: 'blockers' as LeadActionAccordionGroup", 'blockers group remains');
mustContain(lead, "key: 'active' as LeadActionAccordionGroup", 'active group remains');
mustContain(lead, 'Najbliższe działania', 'next actions label remains in central work center');
mustContain(lead, 'Braki i blokady', 'blockers label remains in central work center');
mustContain(lead, 'Wszystkie aktywne', 'active label remains in central work center');

mustContain(lead, 'openLinkedTaskEditor(entry.raw)', 'task edit action remains');
mustContain(lead, 'openLinkedEventEditor(entry.raw)', 'event edit action remains');
mustContain(lead, 'handleRescheduleLinkedTask(entry.raw, 24 * 60 * 60 * 1000', 'task tomorrow action remains');
mustContain(lead, 'handleRescheduleLinkedEvent(entry.raw, 24 * 60 * 60 * 1000', 'event tomorrow action remains');
mustContain(lead, 'handleToggleLinkedTask(entry.raw)', 'task done action remains');
mustContain(lead, 'handleToggleLinkedEvent(entry.raw)', 'event done action remains');
mustContain(lead, 'handleDeleteLinkedTask(entry.raw)', 'task delete action remains');
mustContain(lead, 'handleDeleteLinkedEvent(entry.raw)', 'event delete action remains');

mustContain(lead, 'data-stage227e5-right-rail-upcoming-actions-removed="true"', 'right rail duplicate removal marker');
mustNotContain(lead, 'data-stage216j3d-upcoming-actions-card="true"', 'right rail upcoming card removed');
mustNotContain(lead, 'lead-detail-upcoming-actions-card', 'right rail upcoming class removed');
mustNotContain(lead, 'lead-detail-upcoming-actions-list', 'right rail upcoming list removed');
mustNotContain(lead, 'data-stage216j3d-upcoming-action-row="true"', 'right rail upcoming rows removed');

mustContain(lead, '<QuickActionsBar', 'QuickActionsBar remains in right rail');
mustContain(lead, 'data-lead-finance-panel="true"', 'finance panel remains in right rail');

mustContain(pkg, 'check:stage227e5-work-center-blockers-source-of-truth', 'package check script');
mustContain(pkg, 'test:stage227e5-work-center-blockers-source-of-truth', 'package test script');

console.log('PASS STAGE227E5_WORK_CENTER_BLOCKERS_SOURCE_OF_TRUTH');
