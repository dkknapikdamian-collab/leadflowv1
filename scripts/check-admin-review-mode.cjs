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
const isClickToAnnotate = toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D');

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

if (isClickToAnnotate) {
  expect(toolbar.includes('WiÄ™kszy cel') && toolbar.includes('Mniejszy cel'), 'Stage87D quick editor must support bigger/smaller target selection');
  expect(toolbar.includes('admin-tool-quick-editor'), 'Stage87D quick editor missing');
  expect(toolbar.includes('Uwaga *'), 'Stage87D review quick editor must require note field');
  expect(toolbar.includes('saveOnEnter'), 'Stage87D review quick editor must save with Enter');
  expect(toolbar.includes('data-admin-debug-selected-stage87d'), 'Stage87D must mark selected element');
  expect(toolbar.includes('data-admin-debug-saved-stage87d'), 'Stage87D must mark saved element');
} else {
  expect(toolbar.includes('Zaznacz wiÄ™kszy') && toolbar.includes('Zaznacz mniejszy'), 'Inspector must support bigger/smaller target selection');
  expect(toolbar.includes('Komentarz *'), 'Review dialog must require/comment field');
}

expect(toolbar.includes('Wybierz') || toolbar.includes('<select'), 'Inspector must expose candidate list');
expect(toolbar.includes('Obecne zachowanie') && toolbar.includes('Oczekiwane zachowanie'), 'Review dialog must include behavior fields');

if (fail.length) {
  console.error('Admin Review Mode guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log(isClickToAnnotate ? 'PASS ADMIN_REVIEW_MODE_STAGE87D_COMPAT' : 'PASS ADMIN_REVIEW_MODE_STAGE87');
