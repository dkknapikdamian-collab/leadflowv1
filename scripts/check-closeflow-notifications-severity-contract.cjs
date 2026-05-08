const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (message) => {
  console.error('CLOSEFLOW_NOTIFICATIONS_SEVERITY_CONTRACT_STAGE11_FAIL: ' + message);
  process.exit(1);
};

const file = 'src/pages/NotificationsCenter.tsx';
if (!exists(file)) fail('NotificationsCenter is missing');
const text = read(file);

for (const token of [
  'notificationRowSeverity',
  'cf-severity-dot',
  'cf-severity-pill',
  'data-cf-severity={notificationRowSeverity(row.status)}',
]) {
  if (!text.includes(token)) fail('NotificationsCenter missing severity contract token: ' + token);
}

if (text.includes('rowIconClass(row.status, row.kind)')) {
  fail('row icon still uses local rowIconClass severity styling');
}
if (text.includes("'notifications-status-' + row.status")) {
  fail('status pill still uses local notifications-status-* severity styling');
}

const forbiddenClassNames = [
  'notification-severity-fix',
  'severity-v2',
  'alert-repair',
  'notification-alert-fix',
];
for (const token of forbiddenClassNames) {
  if (text.includes(token)) fail('NotificationsCenter contains forbidden local class name: ' + token);
}

const controlChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;
if (controlChars.test(text)) fail('NotificationsCenter contains control characters');

const badCharCodes = [0xfffd, 0x00c2, 0x00c3];
for (const code of badCharCodes) {
  if (text.includes(String.fromCharCode(code))) fail('NotificationsCenter contains suspicious mojibake/control code: U+' + code.toString(16).toUpperCase());
}

const severityStatusLine = text.split(/\r?\n/).find((line) => line.includes('cf-severity-pill') && line.includes('row.status'));
if (!severityStatusLine) fail('cannot find cf-severity-pill row status line');
if (/rose-|red-|amber-/.test(severityStatusLine)) {
  fail('row status severity line contains local rose/red/amber class');
}

const severityIconLine = text.split(/\r?\n/).find((line) => line.includes('cf-severity-dot') && line.includes('notificationRowSeverity'));
if (!severityIconLine) fail('cannot find cf-severity-dot row icon line');
if (/rose-|red-|amber-/.test(severityIconLine)) {
  fail('row icon severity line contains local rose/red/amber class');
}

const alertCss = read('src/styles/closeflow-alert-severity.css');
for (const token of ['--cf-alert-error-text', '.cf-severity-dot', '.cf-severity-pill']) {
  if (!alertCss.includes(token)) fail('alert severity contract missing token: ' + token);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:closeflow-notifications-severity-contract'] !== 'node scripts/check-closeflow-notifications-severity-contract.cjs') {
  fail('package.json missing check:closeflow-notifications-severity-contract');
}

console.log('CLOSEFLOW_NOTIFICATIONS_SEVERITY_CONTRACT_STAGE11_OK: classified=4 severity=2 exceptions=2');
