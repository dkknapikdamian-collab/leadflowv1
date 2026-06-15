const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const app = fs.readFileSync(path.join(repo, 'src/App.tsx'), 'utf8');
const today = fs.readFileSync(path.join(repo, 'src/pages/TodayStable.tsx'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(/import\(['"]\.\/pages\/TodayStable['"]\)/.test(app), 'Active Today route must lazy-import TodayStable.');
assert(!/const\s+Today\s*=\s*lazyPage\(\(\)\s*=>\s*import\(['"]\.\/pages\/Today['"]\)/.test(app), 'Active Today route must not use legacy Today.tsx.');

assert(today.includes('STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH'), 'TodayStable must contain STAGE232B marker.');
assert(/leads\s*:\s*['"]Wymaga ruchu['"]/.test(today), 'Owner-control tile label must remain Wymaga ruchu.');
assert(today.includes('actionRequiredRows'), 'TodayStable must use explicit actionRequiredRows source.');
assert(!today.includes('ownerControlBaseline.items.length'), 'Owner-control tile count must not read ownerControlBaseline.items.length directly.');
assert(!today.includes('To nie jest kalendarz'), 'Today UI must not contain developer/helper explanatory copy.');
assert(!today.includes('data-stage232b-owner-control-helper'), 'Today UI must not contain STAGE232B helper paragraph marker.');
assert(today.includes('upcomingRowsAll'), 'TodayStable must keep upcomingRowsAll full-count source.');
assert(today.includes('upcomingRowsPreview'), 'TodayStable must keep upcomingRowsPreview source.');
assert(today.includes('data-stage232b-upcoming-preview-disclosure'), 'TodayStable must disclose upcoming preview count.');
assert(today.includes('getStage232BTaskTileLabel'), 'TodayStable must use dynamic task tile label helper.');
assert(today.includes('Zadania dziś i zaległe'), 'Task tile must handle today plus overdue tasks truthfully.');
assert(today.includes('Zaległe zadania'), 'Task tile must handle overdue-only tasks truthfully.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232B_R8_TODAY_LABEL_AND_HELPER_COPY_FIX',
  contract: 'Today keeps Wymaga ruchu, no developer helper copy, full upcoming count with preview disclosure, and dynamic task labels.'
}, null, 2));
