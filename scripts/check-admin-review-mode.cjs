#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
const targeting = read('src/components/admin-tools/dom-targeting.ts');
const candidates = read('src/components/admin-tools/dom-candidates.ts');

expect(toolbar.includes("reviewMode === 'collect'"), 'Review collect mode missing');
expect(toolbar.includes("reviewMode === 'browse'") || toolbar.includes('Browse'), 'Review browse mode missing');
expect(toolbar.includes('event.preventDefault()'), 'Collect must prevent default');
expect(toolbar.includes('event.stopPropagation()'), 'Collect must stop propagation');
expect(toolbar.includes('pickAdminTargetCandidate'), 'Review must use targeting selection');
expect(targeting.includes('event.composedPath'), 'Targeting must use event.composedPath');
expect(targeting.includes('[data-admin-tool-ui="true"]'), 'Targeting must ignore admin toolbar');
expect(candidates.includes('score += 100'), 'Candidate scoring must reward native actions');
expect(candidates.includes('score += 90'), 'Candidate scoring must reward interactive roles');
expect(candidates.includes('score -= 100'), 'Candidate scoring must penalize html/body/svg/path');
expect(toolbar.includes('Zaznacz większy') && toolbar.includes('Zaznacz mniejszy'), 'Inspector must support bigger/smaller target selection');
expect(toolbar.includes('Wybierz') || toolbar.includes('<select'), 'Inspector must expose candidate list');
expect(toolbar.includes('Komentarz *'), 'Review dialog must require/comment field');
expect(toolbar.includes('Obecne zachowanie') && toolbar.includes('Oczekiwane zachowanie'), 'Review dialog must include behavior fields');

if (fail.length) {
  console.error('Admin Review Mode guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('PASS ADMIN_REVIEW_MODE_STAGE87');
