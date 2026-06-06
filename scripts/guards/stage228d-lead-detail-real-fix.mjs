import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL Stage228D: ${message}`);
    process.exit(1);
  }
}

const lead = read('src/pages/LeadDetail.tsx');
const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
const pkg = JSON.parse(read('package.json'));

assert(lead.includes('STAGE228D_LEAD_DETAIL_REAL_FIX'), 'missing TSX stage marker');
assert(lead.includes("type LeadActionAccordionGroup = 'next' | 'blockers' | 'active' | null"), 'missing lead accordion group type');
assert(lead.includes("useState<LeadActionAccordionGroup>('next')"), 'missing default-open next accordion state');
assert(lead.includes('setLeadActionOpenGroup((current) => current === group.key ? null : group.key)'), 'missing single-open toggle behavior');
assert(lead.includes('data-stage228d-lead-action-center-accordion="true"'), 'missing lead action center accordion marker');
assert(lead.includes('data-stage228d-lead-right-quick-actions="true"'), 'missing right quick actions marker');
assert(!lead.includes('<h2>Powiązana sprawa</h2>'), 'related case side card heading still rendered');
assert(!lead.includes('lead-detail-stage228b-r14-quick-actions" data-stage228b-lead-quick-actions'), 'old middle quick actions strip still rendered');
assert(lead.includes('Dodaj wpłatę'), 'right quick actions must include payment action');

assert(css.includes('STAGE228D_LEAD_DETAIL_REAL_FIX'), 'missing CSS stage marker');
assert(css.includes('.lead-detail-action-accordion-group--next'), 'missing blue full-tone group CSS');
assert(css.includes('.lead-detail-action-accordion-group--blockers'), 'missing amber full-tone group CSS');
assert(css.includes('.lead-detail-action-accordion-group--active'), 'missing green full-tone group CSS');
assert(css.includes('background: transparent !important;\n  border-color: rgba(15, 23, 42, 0.12) !important;'), 'inner accordion content must not force white card background');
assert(css.includes('.lead-detail-right-quick-actions-card'), 'missing right quick actions CSS');
assert(css.includes('.lead-detail-data-panel-row-copy'), 'missing phone/email row clipping fix');

assert(pkg.scripts?.['verify:stage228d-lead-detail-real-fix'] === 'node scripts/guards/stage228d-lead-detail-real-fix.mjs', 'package verify script missing');

console.log('PASS Stage228D lead detail real fix guard');
