#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
const lead = read('src/pages/LeadDetail.tsx');
const leads = read('src/pages/Leads.tsx');
const css = read('src/styles/visual-stage14-lead-detail-vnext.css');

function pass(name) { return { ok: true, name }; }
function fail(name, details = '') { return { ok: false, name, details }; }
function has(text, needle) { return text.includes(needle); }

const accordionMarker = 'data-stage228d-lead-action-visible-limit="5"';
const accordionIndex = lead.indexOf(accordionMarker);
const overflowSection = accordionIndex === -1 ? lead : lead.slice(0, accordionIndex);

const requiredLeadMarkers = [
  'data-stage231g-potential-edit-action',
  'data-stage231g-next-step-action',
  'data-stage231g-risk-action',
  'data-stage231g-blocker-action',
  'data-stage231g-work-row-layout',
  'data-stage231g-finance-edit-potential',
  'data-stage231g-potential-input',
];

const checks = [];
for (const marker of requiredLeadMarkers) checks.push(has(lead, marker) ? pass('LeadDetail marker ' + marker) : fail('LeadDetail marker ' + marker));
checks.push(has(leads, 'data-stage231g-lead-create-potential-input') ? pass('Lead create potential input marker') : fail('Lead create potential input marker'));
checks.push(has(leads, 'Potencja') && has(leads, 'dealValue') ? pass('Lead create exposes potential and dealValue') : fail('Lead create exposes potential and dealValue'));
checks.push(/dealValue:\s*Number\(editLead\.dealValue\)\s*\|\|\s*0/.test(lead) ? pass('LeadDetail update still saves dealValue') : fail('LeadDetail update still saves dealValue'));
checks.push(/dealValue:\s*Number\(newLead\.dealValue\)\s*\|\|\s*0/.test(leads) ? pass('Lead create still persists dealValue') : fail('Lead create still persists dealValue'));
checks.push(has(lead, 'lead-detail-work-row__content') ? pass('LeadDetail work rows have content block') : fail('LeadDetail work rows have content block'));
checks.push(has(lead, 'lead-detail-work-row__status') ? pass('LeadDetail work rows have status block') : fail('LeadDetail work rows have status block'));
checks.push(has(lead, 'lead-detail-work-row__actions') ? pass('LeadDetail work rows have actions block') : fail('LeadDetail work rows have actions block'));
checks.push(has(css, 'STAGE231G_R6_WORK_ROW_LAYOUT_FINAL') && has(css, 'flex-wrap: wrap') && has(css, 'overflow-wrap: anywhere') ? pass('LeadDetail CSS supports readable wrapped work-row layout') : fail('LeadDetail CSS supports readable wrapped work-row layout'));
checks.push(has(lead, 'function isMissingItemTimelineEntry') ? pass('Missing-item helper exists') : fail('Missing-item helper exists'));
checks.push(!overflowSection.includes("group.key === 'blockers' && entry.kind === 'task'") ? pass('Overflow section does not rely on stale group.key blockers check') : fail('Overflow section does not rely on stale group.key blockers check'));
checks.push(['note', 'task', 'event', 'missing', 'lost', 'service'].every((key) => lead.includes("key: '" + key + "'") || lead.includes('key: "' + key + '"')) ? pass('Lead quick actions retain note/task/event/missing/lost/service') : fail('Lead quick actions retain note/task/event/missing/lost/service'));
checks.push(!/^\uFEFF/.test(read('scripts/check-stage231g-lead-detail-operational-wiring.cjs')) ? pass('Guard has no BOM') : fail('Guard has no BOM'));

const failed = checks.filter((entry) => !entry.ok);
if (failed.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE231G_R6', failed }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE231G_R6', checked: checks.length }, null, 2));
