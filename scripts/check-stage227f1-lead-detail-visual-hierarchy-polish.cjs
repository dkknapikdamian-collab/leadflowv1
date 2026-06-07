const fs = require('fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');

let failures = 0;
function pass(label) { console.log(`PASS ${label}`); }
function fail(label) { failures += 1; console.error(`FAIL STAGE227F1_VISUAL_HIERARCHY_POLISH: ${label}`); }
function expect(condition, label) { condition ? pass(label) : fail(`missing: ${label}`); }
function reject(condition, label) { condition ? fail(`still contains: ${label}`) : pass(`not contains: ${label}`); }

const workMarker = 'data-stage227f1-work-center="true"';
const workIdx = lead.indexOf(workMarker);
const workSlice = workIdx >= 0 ? lead.slice(Math.max(0, workIdx - 1400), workIdx + 2600) : '';

expect(lead.includes('STAGE227F1_LEAD_DETAIL_VISUAL_HIERARCHY_POLISH'), 'Stage227F1 runtime marker');
expect(lead.includes('data-stage227f1-decision-dashboard="true"'), 'decision dashboard marker');
expect(lead.includes('data-stage227e3-next-step-card="true"'), 'next step decision card marker');
expect(lead.includes('data-stage227e3-potential-card="true"'), 'potential decision card marker');
expect(lead.includes('data-stage227e3-silence-risk-card="true"'), 'silence/risk decision card marker');
expect(lead.includes('data-stage227e3-blocker-card="true"'), 'blocker decision card marker');
expect(lead.includes('data-stage227e5-work-center-blockers-source="true"'), 'E5 work center source remains');
expect(workIdx >= 0, 'F1 work center marker');
expect(/<h2>[^<]*leada<\/h2>/.test(workSlice), 'work center title remains');
reject(lead.includes('CO ROBIMY TERAZ?'), 'work center super-heading copy');
reject(workSlice.includes('lead-detail-box-kicker'), 'work center kicker element');

expect(css.includes('STAGE227F1_LEAD_DETAIL_VISUAL_HIERARCHY_POLISH'), 'CSS F1 marker');
expect(css.includes('data-stage227f1-decision-dashboard'), 'decision dashboard CSS selector');
expect(/grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/.test(css), 'desktop grid uses four equal columns');
expect(css.includes('data-stage227f1-work-center'), 'work center CSS selector');
expect(css.includes('lead-detail-main-column') && css.includes('lead-detail-section-card'), 'lower sections neutralization is scoped to LeadDetail sections');

if (failures) {
  console.error(`\nStage227F1 guard failures: ${failures}`);
  process.exit(1);
}

console.log('PASS STAGE227F1_VISUAL_HIERARCHY_POLISH');