const { fail, read, has, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE79_CUMULATIVE_MANIFEST_GUARD';
const manifest = read(label, 'docs/release/STAGE70_82_CUMULATIVE_MANIFEST_2026-05-05.md');
for (let i = 70; i <= 82; i++) has(label, manifest, 'Stage' + i, 'manifest');
if (!pkg(label).scripts['check:stage79-cumulative-manifest-guard']) fail(label, 'package script missing');
console.log('PASS ' + label);
