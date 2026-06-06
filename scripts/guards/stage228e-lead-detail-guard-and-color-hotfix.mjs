import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL Stage228E: ${message}`);
    process.exit(1);
  }
}

const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
const guardD = read('scripts/guards/stage228d-lead-detail-real-fix.mjs');
const pkg = JSON.parse(read('package.json'));

assert(css.includes('STAGE228E_LEAD_DETAIL_GUARD_AND_COLOR_HOTFIX'), 'missing Stage228E CSS marker');
assert(css.includes('.lead-detail-stage228d-action-center .lead-detail-action-accordion-group--next .lead-detail-action-accordion-content'), 'blue accordion content must inherit full color');
assert(css.includes('.lead-detail-stage228d-action-center .lead-detail-action-accordion-group--blockers .lead-detail-action-accordion-content'), 'amber accordion content must inherit full color');
assert(css.includes('.lead-detail-stage228d-action-center .lead-detail-action-accordion-group--active .lead-detail-action-accordion-content'), 'green accordion content must inherit full color');
assert(/\.lead-detail-stage228d-action-center\s+\.lead-detail-action-accordion-content\s+\.lead-detail-light-empty,[\s\S]*?background:\s*transparent\s*!important/i.test(css), 'empty states inside accordion must be transparent');
assert(/\.lead-detail-stage228d-action-center\s+\.lead-detail-work-row[\s\S]*?background:\s*transparent\s*!important/i.test(css), 'work rows inside accordion must be transparent');
assert(!guardD.includes("css.includes('background: transparent !important;\\n  border-color"), 'Stage228D guard must not use brittle exact newline string');
assert(guardD.includes('hasTransparentInnerAccordion'), 'Stage228D guard must use semantic transparent-background check');
assert(pkg.scripts?.['verify:stage228d-lead-detail-real-fix'] === 'node scripts/guards/stage228d-lead-detail-real-fix.mjs', 'Stage228D verify script missing');
assert(pkg.scripts?.['verify:stage228e-lead-detail-guard-and-color-hotfix'] === 'node scripts/guards/stage228e-lead-detail-guard-and-color-hotfix.mjs', 'Stage228E verify script missing');

console.log('PASS Stage228E lead detail guard and color hotfix');
