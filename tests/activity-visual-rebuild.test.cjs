const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const activity = fs.readFileSync(path.join(root, 'src/pages/Activity.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage8-activity-vnext.css'), 'utf8');
const header = 'Aktywno' + '\u015b\u0107';

function has(text) {
  assert.ok(activity.includes(text), `Brak: ${text}`);
}

has('AKTYWNO' + '\u015a\u0106');
has('<h1>' + header + '</h1>');
['Wszystko', 'Dzisiaj', 'Leady', 'Sprawy', 'Zadania'].forEach(has);
['activity-row-type', 'activity-row-title', 'activity-row-relation', 'activity-row-time'].forEach(has);

['task_updated', 'lead_status_changed', 'event_deleted'].forEach((label) => {
  assert.equal(activity.includes(`>{${label}}<`), false, `Surowy label w UI: ${label}`);
});

const rightRailCss = css
  .split(/\n(?=\.activity-right-rail|\.right-card\.activity-right-card|\.activity-right-card|\.activity-right-card-head)/)
  .filter((block) => block.startsWith('.activity-right-rail') || block.startsWith('.right-card.activity-right-card') || block.startsWith('.activity-right-card'))
  .join('\n');

['#000', '#020617', '#0b1220', '#101828'].forEach((color) => {
  assert.equal(rightRailCss.includes(color), false, `Ciemny wrapper w right rail: ${color}`);
});

[
  [66, 196, 185, 194, 130, 195, 132, 226, 128, 166, 100],
  [79, 116, 119, 196, 130, 194, 179, 114, 122],
  [195, 133, 194, 185, 114, 196, 130, 194, 179, 100, 197, 130, 111],
  [67, 121, 107, 108, 105, 99, 122, 110, 111, 196, 185, 226, 128, 186, 196, 132, 226, 128, 161],
]
  .map((codes) => String.fromCharCode(...codes))
  .forEach((bad) => {
    assert.equal(activity.includes(bad) || css.includes(bad), false, `Mojibake: ${bad}`);
  });

console.log('PASS activity visual rebuild');
