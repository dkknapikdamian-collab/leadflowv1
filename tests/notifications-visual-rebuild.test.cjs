const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'NotificationsCenter.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage10-notifications-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const combined = page + '\n' + css;

function has(text) {
  assert.ok(page.includes(text) || css.includes(text), `Missing: ${text}`);
}

has('Powiadomienia');
has('POWIADOMIENIA');
has('Przypomnienia, zaleg\u0142e rzeczy i alerty, kt\u00F3rych nie mo\u017Cesz przegapi\u0107.');

['Wszystkie', 'Do reakcji', 'Zaleg\u0142e', 'Dzisiaj', 'Nadchodz\u0105ce'].forEach(has);
['kindLabel(row.kind)', 'row.title', 'row.relationLabel', 'row.timeLabel', 'row.statusLabel'].forEach((needle) => {
  assert.ok(page.includes(needle), `Notification row does not include ${needle}`);
});
['Otw\u00F3rz', 'Od\u0142\u00F3\u017C', 'Przeczytane'].forEach(has);
['15m', '1h', 'Jutro'].forEach(has);

['notification_runtime', 'browser_permission_denied', 'digest_job_failed'].forEach((technicalLabel) => {
  assert.ok(!page.includes('>' + technicalLabel + '<'), `Technical label leaked as copy: ${technicalLabel}`);
});

assert.ok(!page.includes('JSON.stringify'), 'Notifications list must not render JSON.stringify output');
assert.ok(!page.includes('<pre'), 'Notifications list must not render raw preformatted technical output');

const rightRailStart = css.indexOf('.notifications-right-rail');
assert.ok(rightRailStart >= 0, 'Missing notifications-right-rail CSS');
const rightRailSlice = css.slice(rightRailStart, css.indexOf('@media', rightRailStart));
['#000', '#020617', '#0b1220', '#101828'].forEach((dark) => {
  assert.ok(!rightRailSlice.includes(dark), `Dark wrapper color leaked in notifications right rail: ${dark}`);
});
assert.ok(rightRailSlice.includes('background: transparent'), 'Right rail wrapper must be transparent');
assert.ok(rightRailSlice.includes('background: rgba(255, 255, 255, 0.92)'), 'Right rail cards must be light');
assert.ok(rightRailSlice.includes('border: 1px solid #e4e7ec'), 'Right rail cards must use light border');

const badMojibakeSamples = [
  [66, 313, 8218, 196, 8230, 100],
  [79, 116, 119, 258, 322, 114, 122],
  [197, 185, 114, 258, 322, 100, 322, 111],
  [67, 121, 107, 108, 105, 99, 122, 110, 111, 313, 8250, 196, 8225],
].map((codes) => String.fromCharCode(...codes));

badMojibakeSamples.forEach((bad) => {
  assert.ok(!combined.includes(bad), 'Mojibake found');
});

console.log('PASS notifications visual rebuild');
