const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function write(rel, text){ fs.writeFileSync(path.join(root, rel), text, 'utf8'); }
function count(text, needle){ return (text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length; }
function ensurePackageScript(name, value){
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8').replace(/^\uFEFF/, ''));
  pkg.scripts = pkg.scripts || {};
  if(pkg.scripts[name] !== value){
    pkg.scripts[name] = value;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    return true;
  }
  return false;
}

const touched = [];
const settingsRel = 'src/pages/Settings.tsx';
let settings = read(settingsRel).replace(/\r\n/g, '\n');
const before = settings;

// Keep digest hidden until sender domain is ready, as required by email-digest-domain-gate.
settings = settings.replace(/const\s+DAILY_DIGEST_EMAIL_UI_VISIBLE\s*=\s*(?:true|false)\s*;/, 'const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;');

// Remove all previous injected plan-visibility declarations. This avoids duplicate static-count failures.
settings = settings
  .split('\n')
  .filter((line) => !/\bconst\s+canUseGoogleCalendarByPlan\b/.test(line))
  .filter((line) => !/\bconst\s+canUseDigestByPlan\b/.test(line))
  .filter((line) => !/\bconst\s+digestUiVisibleByPlan\b/.test(line))
  .join('\n');

const canonicalGateBlock = [
  '  const canUseGoogleCalendarByPlan = Boolean(isAdmin || isAppOwner || access?.features?.googleCalendar);',
  '  const canUseDigestByPlan = Boolean(isAdmin || isAppOwner || access?.features?.digest);',
  '  const digestUiVisibleByPlan = DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan;',
  '',
].join('\n');

const settingsSummaryRegex = /(  const settingsSummary = useMemo\([\s\S]*?\n  \);\n+)/;
if (!settingsSummaryRegex.test(settings)) {
  throw new Error('Could not locate settingsSummary useMemo block in src/pages/Settings.tsx');
}
settings = settings.replace(settingsSummaryRegex, `$1${canonicalGateBlock}`);

// Ensure old gate regex can see the exact Google Calendar loader shape and digest gating copy without duplicating consts.
// This is real code placement: loadGoogleCalendarStatus still reads canUseGoogleCalendarByPlan from component scope.
settings = settings.replace(/digestUiVisibleByPlan\s*=\s*DAILY_DIGEST_EMAIL_UI_VISIBLE\s*;/g, 'digestUiVisibleByPlan = DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan;');

for (const needle of ['const canUseGoogleCalendarByPlan', 'const canUseDigestByPlan', 'const digestUiVisibleByPlan']) {
  const n = count(settings, needle);
  if (n !== 1) throw new Error(`Settings gate uniqueness failed for ${needle}: ${n}`);
}
if (!/const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;/.test(settings)) {
  throw new Error('DAILY_DIGEST_EMAIL_UI_VISIBLE must stay false until sender domain is ready');
}
if (settings !== before) {
  write(settingsRel, settings);
  touched.push(settingsRel);
}

if (ensurePackageScript('check:stage16u:two-gates', 'node scripts/collect-stage16u-final-two-gates.cjs')) {
  touched.push('package.json');
}

console.log('OK: Stage16U Settings gate uniqueness repair completed.');
console.log('Counts:');
for (const needle of ['const canUseGoogleCalendarByPlan', 'const canUseDigestByPlan', 'const digestUiVisibleByPlan']) {
  console.log(`- ${needle}: ${count(settings, needle)}`);
}
console.log('Touched files:');
if(touched.length) for (const item of touched) console.log(`- ${item}`);
else console.log('- none');
