const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');

function fail(message) {
  console.error('STAGE231G_R4 FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

assert(!lead.includes("MissingItemQuickActionModal"), 'legacy MissingItemQuickActionModal import/render must be removed');
assert(!lead.includes('buildMissingItemModalDraft'), 'legacy local missing item draft builder must be removed from LeadDetail');
assert(!lead.includes('missingItemDialogOpen'), 'legacy missingItemDialogOpen state must be removed');
assert(!lead.includes('missingItemTitle'), 'legacy missingItemTitle state must be removed');
assert(!lead.includes('missingItemNote'), 'legacy missingItemNote state must be removed');
assert(!lead.includes('missingItemError'), 'legacy missingItemError state must be removed');
assert(!lead.includes('missingItemSaving'), 'legacy missingItemSaving state must be removed');
assert(!lead.includes('openLeadMissingItemDialog'), 'legacy openLeadMissingItemDialog must be removed');
assert(!lead.includes('handleSaveLeadMissingItem'), 'legacy handleSaveLeadMissingItem must be removed');
assert(!lead.includes('data-stage227c3a-lead-missing-modal-instance'), 'legacy local missing modal render marker must be removed');

assert(lead.includes("openLeadContextAction('blocker')"), 'canonical blocker path must remain wired through ContextActionDialogs');
assert(lead.includes('data-stage231g-r4-context-blocker-only="true"'), 'R4 context-blocker-only marker is missing');

const overflowStart = lead.indexOf('lead-detail-overflow-work-summary');
const overflowEnd = lead.indexOf('lead-detail-stage228b-work-action-center', overflowStart);
assert(overflowStart >= 0 && overflowEnd > overflowStart, 'overflow work summary section not found');
const overflow = lead.slice(overflowStart, overflowEnd);
assert(overflow.includes('data-stage231g-r4-overflow-missing-delete="true"'), 'overflow missing_item delete marker is missing');
assert(overflow.includes('handleDeleteLeadMissingItemStage228R15(entry)'), 'overflow missing_item delete must call hard missing delete route');
assert(overflow.includes('handleDeleteLinkedTask(entry.raw)'), 'normal task delete must remain for non-missing tasks');

assert(!css.includes('minmax(260px, 1fr) auto minmax(280px, auto)'), 'old 260/280 work-row grid must not return');
assert(!css.includes('minmax(220px, 1fr) auto minmax(220px, auto)'), 'old 220/220 work-row grid must not return');
assert(css.includes('grid-template-columns: 38px minmax(0, 1fr);'), 'medium-width safe work-row grid is missing');
assert(css.includes('.lead-detail-work-row__actions') && css.includes('grid-column: 2;'), 'actions must move to safe second row by default');
assert(css.includes('@media (min-width: 1280px)') && css.includes('grid-template-columns: 38px minmax(0, 1fr) max-content minmax(0, auto);'), 'desktop-safe 4-column work-row grid is missing');

console.log('STAGE231G_R4 PASS: LeadDetail closeout removes legacy missing modal, fixes overflow missing delete and hardens work-row layout.');
