const fs = require('node:fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) { console.error('STAGE220A33_NO_TAB_SWITCH_RELOAD_DELETE_BLOB_GUARD: FAIL'); console.error(message); process.exit(1); }
function requireText(text, needle, label) { if (!text.includes(needle)) fail(label + ' missing: ' + needle); }

const visual = read('src/styles/visual-stage13-case-detail-vnext.css');
const chunk = read('src/pwa/chunk-asset-reload-guard.ts');
const pkg = JSON.parse(read('package.json'));

requireText(visual, 'STAGE220A33_DELETE_ACTION_NO_RED_BLOB', 'delete blob CSS marker');
requireText(visual, '.cf-case-detail-delete-action-stage220a32', 'delete action selector');
requireText(visual, 'background: transparent !important;', 'delete action transparent background');
requireText(visual, 'background-image: none !important;', 'delete action no background image');
requireText(visual, 'border-color: transparent !important;', 'delete action no red pill border');
requireText(visual, 'content: none !important;', 'delete pseudo element removed');
requireText(visual, 'stroke: #be123c', 'delete icon red stroke preserved');

requireText(chunk, 'STAGE220A33_NO_TAB_SWITCH_HARD_RELOAD', 'chunk guard A33 marker');
requireText(chunk, 'closeFlowWasHiddenInSession', 'tab switch session flag');
requireText(chunk, 'CLOSEFLOW_TAB_RETURN_RELOAD_SUPPRESSION_MS = 5 * 60 * 1000', 'five-minute tab suppression window');
requireText(chunk, "document.visibilityState !== 'visible'", 'hidden document reload suppression');
requireText(chunk, 'hasActiveCloseFlowUserInput', 'active form input detector');
requireText(chunk, 'hasUserStateToProtect', 'user state protection variable');
requireText(chunk, 'if (shouldDeferReloadForOpenCloseFlowModal(source)) return true;', 'reload deferred before hard reload');
requireText(chunk, 'window.location.reload();', 'hard reload remains only after guard allows it');
requireText(chunk, 'closeFlowWasHiddenInSession = true;', 'hidden tab marks session protected');
requireText(String(pkg.scripts?.prebuild || ''), 'node scripts/check-stage220a33-no-tab-switch-reload-delete-blob.cjs', 'prebuild A33 guard wiring');

console.log('STAGE220A33_NO_TAB_SWITCH_RELOAD_DELETE_BLOB_GUARD: OK');
