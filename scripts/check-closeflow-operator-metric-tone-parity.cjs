const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
const component = read('src/components/ui-system/OperatorMetricTiles.tsx');
for (const needle of ['OperatorMetricTone', 'data-cf-operator-metric-tone', 'data-cf-operator-metric-value-tone', 'data-cf-operator-metric-id']) {
  if (!component.includes(needle)) throw new Error('OperatorMetricTiles.tsx missing ' + needle);
}
const css = read('src/styles/closeflow-operator-metric-tiles.css');
for (const tone of ['neutral', 'blue', 'green', 'red', 'amber', 'purple']) {
  if (!css.includes('--cf-operator-tone-' + tone)) throw new Error('CSS missing tone variables for ' + tone);
  if (!css.includes('data-cf-operator-metric-tone="' + tone + '"')) throw new Error('CSS missing tone selector for ' + tone);
}
if (!css.includes('-webkit-text-fill-color')) throw new Error('CSS must hard-lock value text fill color');
if (!css.includes('stroke: currentColor')) throw new Error('CSS must lock SVG color to currentColor');
const stat = read('src/components/StatShortcutCard.tsx');
for (const phrase of ['bez ruchu', 'bez sprawy', 'zaleg', 'blok', 'wartosc', 'gotowe']) {
  if (!stat.includes(phrase)) throw new Error('StatShortcutCard tone resolver missing phrase: ' + phrase);
}
console.log('CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W_CHECK_OK');
console.log('tone_source=OperatorMetricTone');
console.log('value_and_icon_color=shared_tone');
