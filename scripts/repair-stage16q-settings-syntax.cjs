const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] || process.cwd();
const rel = 'src/pages/Settings.tsx';
const file = path.join(repo, rel);
if (!fs.existsSync(file)) throw new Error(rel + ' missing');
let source = fs.readFileSync(file, 'utf8');

// Stage16Q: normalize the Settings file first. Several earlier patch scripts mixed CRLF/LF
// and inserted plan visibility constants directly after the settingsSummary memo.
source = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

source = source.replace(
  /const DAILY_DIGEST_EMAIL_UI_VISIBLE = true;/g,
  'const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;',
);
source = source.replace(/Na darmowym Vercel cron dzia\u0142a raz dzie\u0144nie/g, 'Na darmowym Vercel cron dzia\u0142a raz dziennie');
source = source.replace(/Na darmowym Vercel cron dziala raz dziennie/g, 'Na darmowym Vercel cron dzia\u0142a raz dziennie');

const cleanBlock = `  const settingsSummary = useMemo(
    () => [
      { label: 'Konto', value: asText(profile.fullName || accountEmail, 'Operator') },
      { label: 'Workspace', value: workspaceName },
      { label: 'Plan', value: planLabel },
      { label: 'Dost\u0119p', value: accessLabel },
    ],
    [accessLabel, accountEmail, planLabel, profile.fullName, workspaceName],
  );

  const canUseGoogleCalendarByPlan = Boolean(isAdmin || isAppOwner || access?.features?.googleCalendar);
  const canUseDigestByPlan = Boolean(isAdmin || isAppOwner || access?.features?.digest);
  const digestUiVisibleByPlan = DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan;
  const digestActionsDisabled = !canUseDigestByPlan;
  const googleCalendarMissingText = googleCalendarStatus?.missing?.length
    ? googleCalendarStatus.missing.join(', ')
    : '';
  const googleCalendarConfigured = googleCalendarStatus?.configured === true;
  const googleCalendarConnected = googleCalendarStatus?.connected === true;

  // GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT`;

const marker = '  // GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT';
const settingsStart = source.indexOf('  const settingsSummary = useMemo(');
const markerIndex = source.indexOf(marker);
if (settingsStart === -1 || markerIndex === -1 || markerIndex <= settingsStart) {
  throw new Error('Could not locate settingsSummary/google calendar marker block in Settings.tsx');
}

source = source.slice(0, settingsStart) + cleanBlock + source.slice(markerIndex + marker.length);

// Remove accidental duplicate plan gate constants that may have survived after the clean block.
const firstCanUseGoogle = source.indexOf('  const canUseGoogleCalendarByPlan = Boolean(');
if (firstCanUseGoogle !== -1) {
  const before = source.slice(0, firstCanUseGoogle + 1);
  const after = source.slice(firstCanUseGoogle + 1).replace(/\n\s*const canUseGoogleCalendarByPlan = Boolean\([^\n]+\);/g, '');
  source = before + after;
}
const firstCanUseDigest = source.indexOf('  const canUseDigestByPlan = Boolean(');
if (firstCanUseDigest !== -1) {
  const before = source.slice(0, firstCanUseDigest + 1);
  const after = source.slice(firstCanUseDigest + 1).replace(/\n\s*const canUseDigestByPlan = Boolean\([^\n]+\);/g, '');
  source = before + after;
}
const firstDigestVisible = source.indexOf('  const digestUiVisibleByPlan = DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan;');
if (firstDigestVisible !== -1) {
  const before = source.slice(0, firstDigestVisible + 1);
  const after = source.slice(firstDigestVisible + 1).replace(/\n\s*const digestUiVisibleByPlan =[^\n]+;/g, '');
  source = before + after;
}

fs.writeFileSync(file, source.replace(/\n/g, '\r\n'), 'utf8');
console.log('OK: Stage16Q Settings syntax/visibility block repaired.');
console.log('- ' + rel);
