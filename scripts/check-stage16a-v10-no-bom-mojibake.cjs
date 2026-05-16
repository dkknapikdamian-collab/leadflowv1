const fs = require('fs');
const path = require('path');
const root = process.cwd();
const files = [
  'package.json',
  'src/pages/TasksStable.tsx',
  'src/styles/closeflow-metric-tiles.css',
  'src/styles/closeflow-page-header.css',
  'scripts/check-closeflow-metric-visual-parity-contract.cjs',
  'docs/ui/CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A_2026-05-08.md',
];
function fail(message) { console.error('[stage16a-v10-no-bom-mojibake] FAIL: ' + message); process.exit(1); }
function read(rel) { return fs.readFileSync(path.join(root, rel)); }
for (const rel of files) {
  const buffer = read(rel);
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) fail(rel + ' has UTF-8 BOM');
  const text = buffer.toString('utf8');
  const markers = ['\u0139', '\u00c5', '\u0105', '\u0107', '\u0119', '\u00F3', '\u00D3', '\ufffd', '\u0081', '\u0082', '\u0083', '\u0084', '\u0085'];
  const hit = markers.find((marker) => text.includes(marker));
  if (hit) fail(rel + ' contains mojibake marker ' + JSON.stringify(hit));
}
const pkg = JSON.parse(read('package.json').toString('utf8'));
if (!pkg.scripts || pkg.scripts['check:stage16a-v10-no-bom-mojibake'] !== 'node scripts/check-stage16a-v10-no-bom-mojibake.cjs') {
  fail('package.json missing check:stage16a-v10-no-bom-mojibake');
}
const tasks = read('src/pages/TasksStable.tsx').toString('utf8');
for (const token of ['Zadanie bez tytu\u0142u', 'Zaleg\u0142e', 'Dzi\u015B', 'Nie uda\u0142o si\u0119 zapisa\u0107 zadania.', 'Lista zada\u0144', 'Od\u015Bwie\u017C', 'Usu\u0144', '\u015Aredni', 'Pomi\u0144']) {
  if (!tasks.includes(token)) fail('TasksStable missing repaired Polish token: ' + token);
}
console.log('CLOSEFLOW_STAGE16A_V10_NO_BOM_MOJIBAKE_OK');
