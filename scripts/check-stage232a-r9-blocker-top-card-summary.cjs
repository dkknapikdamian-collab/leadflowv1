const fs = require('fs');
const assert = require('assert');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

function must(text, token, label) {
  assert.ok(text.includes(token), label + ' missing: ' + token);
}
function mustNot(text, token, label) {
  assert.ok(!text.includes(token), label + ' forbidden token: ' + token);
}

must(lead, 'STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING', 'R9 marker');

const cardMatch = lead.match(/<article className="lead-detail-top-card lead-detail-callout-red"[\s\S]*?<\/article>/m);
assert.ok(cardMatch, 'blocker top card exists');
const card = cardMatch[0];

must(card, 'data-stage232a-r9-blocker-top-card-summary="true"', 'top card summary marker');
must(card, "openLeadContextAction('blocker')", 'top card always can add Brak');
must(card, 'Zobacz wszystkie braki', 'top card can open all Braki');
must(card, "setLeadActionOpenGroup('blockers')", 'top card opens blockers accordion');
must(card, 'activeMissingItemEntriesStage228R19R2.length > 0 ? (', 'view all checks all active missing');
mustNot(card, 'handleResolveLeadMissingItemStage228R13', 'top card must not resolve single Brak');
mustNot(card, 'handleDeleteLeadMissingItemStage228R15', 'top card must not delete single Brak');
mustNot(card, 'leadBlockerEntries[0]?.title', 'top card must not pick one Brak title');

must(lead, "data-stage232a-r9-row-actions={group.key === 'blockers' ? 'missing-only' : 'default'}", 'row actions marker');
must(lead, "group.key === 'blockers' ? (", 'blockers rows have missing-only branch');
must(lead, 'data-stage228r13-lead-missing-resolve-action="true"', 'list rows retain resolve action');
must(lead, 'data-stage228r15-lead-missing-delete-action="true"', 'list rows retain delete action');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING',
  guard: 'check-stage232a-r9-blocker-top-card-summary'
}, null, 2));
