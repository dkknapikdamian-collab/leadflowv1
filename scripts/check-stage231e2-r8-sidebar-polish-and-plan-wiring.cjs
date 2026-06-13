const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error('STAGE231E2_R8_FAIL: ' + message);
    process.exit(1);
  }
}

const layout = read('src/components/Layout.tsx');
const plans = read('src/lib/plans.ts');
const matrix = read('_project/06_STAGE231E2_PLAN_ENTITLEMENT_MATRIX.md');
const billing = read('src/pages/Billing.tsx');
const settings = read('src/pages/Settings.tsx');

const trialCardMatch = layout.match(/function TrialCard\([\s\S]*?\n\}\nfunction UserCard/);
assert(trialCardMatch, 'Layout.tsx must contain TrialCard followed by UserCard.');
const trialCard = trialCardMatch[0];

for (const bad of ['\uFFFD', '\u00C4', '\u00C5', '\u0139', '\u00E2']) {
  assert(!trialCard.includes(bad), 'TrialCard must not contain mojibake character code: ' + bad.charCodeAt(0));
}

assert(trialCard.includes('Trial aktywny'), 'Layout sidebar active trial label must be explicit: Trial aktywny.');
assert(trialCard.includes('Dost\\u0119p') || trialCard.includes('DostÄ™p'), 'Layout must include safe Polish label for Dostep.');
assert(trialCard.includes('P\\u0142atno\\u015b\\u0107') || trialCard.includes('PĹ‚atnoĹ›Ä‡'), 'Layout must include safe Polish label for Platnosc.');
assert(trialCard.includes('Status dost\\u0119pu') || trialCard.includes('Status dostÄ™pu'), 'Layout must include safe Polish fallback for Status dostepu.');

const planIds = [
  ['free', 'free'],
  ['basic', 'basic'],
  ['pro', 'pro'],
  ['ai', 'ai'],
  ['trial', 'trial_14d'],
];

for (const pair of planIds) {
  const key = pair[0];
  const value = pair[1];
  assert(new RegExp(key + ": '" + value + "'").test(plans), 'PLAN_IDS.' + key + ' must be ' + value + '.');
}

for (const key of ['free', 'basic', 'pro', 'ai', 'trial']) {
  assert(new RegExp('\\[PLAN_IDS\\.' + key + '\\]:').test(plans), 'PLAN_DEFINITIONS must include PLAN_IDS.' + key + '.');
}

for (const feature of [
  'ai',
  'fullAi',
  'digest',
  'lightParser',
  'lightDrafts',
  'googleCalendar',
  'weeklyReport',
  'csvImport',
  'recurringReminders',
  'browserNotifications',
]) {
  assert(new RegExp(feature + ':\\s*boolean').test(plans), 'PlanFeatures missing ' + feature + '.');
  assert(matrix.includes('`' + feature + '`') || matrix.includes(feature), 'Matrix missing feature row: ' + feature + '.');
}

for (const limit of [
  'activeLeads',
  'activeTasks',
  'activeEvents',
  'activeTasksAndEvents',
  'activeDrafts',
  'aiDaily',
  'aiMonthly',
]) {
  assert(new RegExp(limit + ':\\s*number \\| null').test(plans), 'PlanLimits missing ' + limit + '.');
  assert(matrix.includes('`' + limit + '`') || matrix.includes(limit), 'Matrix missing limit row: ' + limit + '.');
}

assert(/TRIAL_DAYS\s*=\s*14/.test(plans), 'Trial must be 14 days.');
assert(/googleCalendar:\s*PLAN_IDS\.pro/.test(plans), 'Google Calendar minimum plan must be Pro.');
assert(/weeklyReport:\s*PLAN_IDS\.pro/.test(plans), 'Weekly report minimum plan must be Pro.');
assert(/csvImport:\s*PLAN_IDS\.pro/.test(plans), 'CSV import minimum plan must be Pro.');
assert(/recurringReminders:\s*PLAN_IDS\.pro/.test(plans), 'Recurring reminders minimum plan must be Pro.');
assert(/digest:\s*PLAN_IDS\.basic/.test(plans), 'Digest minimum plan must be Basic.');
assert(/lightParser:\s*PLAN_IDS\.basic/.test(plans), 'Light parser minimum plan must be Basic.');
assert(/lightDrafts:\s*PLAN_IDS\.basic/.test(plans), 'Light drafts minimum plan must be Basic.');
assert(/browserNotifications:\s*PLAN_IDS\.basic/.test(plans), 'Browser notifications minimum plan must be Basic.');
assert(/ai:\s*PLAN_IDS\.ai/.test(plans), 'AI minimum plan must be AI.');
assert(/fullAi:\s*PLAN_IDS\.ai/.test(plans), 'Full AI minimum plan must be AI.');

assert(/\[PLAN_IDS\.free\]:[\s\S]*features:\s*\{\s*\.\.\.NO_FEATURES\s*\}/.test(plans), 'Free plan must use NO_FEATURES.');
assert(/\[PLAN_IDS\.basic\]:[\s\S]*features:\s*\{\s*\.\.\.BASIC_FEATURES\s*\}/.test(plans), 'Basic plan must use BASIC_FEATURES.');
assert(/\[PLAN_IDS\.pro\]:[\s\S]*features:\s*\{\s*\.\.\.PRO_FEATURES\s*\}/.test(plans), 'Pro plan must use PRO_FEATURES.');
assert(/\[PLAN_IDS\.ai\]:[\s\S]*features:\s*\{\s*\.\.\.AI_FEATURES\s*\}/.test(plans), 'AI plan must use AI_FEATURES.');
assert(/\[PLAN_IDS\.trial\]:[\s\S]*features:\s*\{\s*\.\.\.AI_FEATURES\s*\}/.test(plans), 'Trial must inherit AI_FEATURES during active trial.');

assert(/trial_21d:\s*PLAN_IDS\.trial/.test(plans), 'Legacy trial_21d alias must still map to trial_14d.');

for (const alias of [
  'closeflow_basic',
  'closeflow_basic_yearly',
  'closeflow_pro',
  'closeflow_pro_yearly',
  'closeflow_ai',
  'closeflow_ai_yearly',
]) {
  assert(plans.includes(alias + ':'), 'Plan alias missing: ' + alias + '.');
}

for (const text of ['Free', 'Basic', 'Pro', 'AI', 'Trial', 'Google Calendar', 'Parser tekstu', 'Poranny digest', 'Raport tygodniowy', 'Asystent AI']) {
  assert(billing.includes(text) || matrix.includes(text), 'Billing/matrix missing expected plan copy: ' + text);
}

assert(/humanAccessStatus/.test(settings), 'Settings must derive access label from access model.');
assert(/STAGE231E2_R8_PLAN_WIRING_CONFIRMATION/.test(matrix), 'Matrix must include R8 plan wiring confirmation.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231E2_R8_SIDEBAR_POLISH_AND_PLAN_WIRING_GUARD',
  contract: 'sidebar Polish labels are safe and every plan id/definition/feature minimum is wired in the plan model and matrix'
}, null, 2));