const { fail, read, has, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE73_CUMULATIVE_PACKAGE_GUARD';
const p = pkg(label);
['check:stage70-today-decision-engine-starter','check:stage71-ai-draft-only-safety-guard','check:stage72-access-billing-plan-truth-guard','verify:stage70-82-cumulative'].forEach(s => { if(!p.scripts[s]) fail(label, 'package script missing ' + s); });
const manifest = read(label, 'docs/release/STAGE70_82_CUMULATIVE_MANIFEST_2026-05-05.md');
['Stage70','Stage71','Stage72','Stage82'].forEach(m => has(label, manifest, m, 'manifest'));
console.log('PASS ' + label);
