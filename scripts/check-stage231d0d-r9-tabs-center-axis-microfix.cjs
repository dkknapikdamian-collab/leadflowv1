const fs = require('fs');
const path = require('path');

const root = process.cwd();
const visual = fs.readFileSync(path.join(root, 'src/styles/visual-stage13-case-detail-vnext.css'), 'utf8');
const rail = fs.readFileSync(path.join(root, 'src/styles/case-detail-stage228r9-shell-rail-lift.css'), 'utf8');

const failures = [];
function must(source, token, label) {
  if (!source.includes(token)) failures.push(label + ': ' + token);
}

must(visual, 'STAGE231D0D_R9_TABS_PILLS_TRUE_CENTER', 'missing R9 tabs center marker');
must(visual, 'justify-content: center !important;', 'tabs card not centered');
must(visual, 'margin-left: auto !important;', 'tabs inner missing auto left');
must(visual, 'margin-right: auto !important;', 'tabs inner missing auto right');
must(rail, 'STAGE231D0D_R9_MIDDLE_AND_RIGHT_AXIS_MICRO_LIFT', 'missing R9 axis marker');
must(rail, 'margin-top: -10px !important;', 'middle section not lifted');
must(rail, 'margin-top: -112px !important;', 'right rail not pulled to requested axis');
must(rail, '@media (max-width: 1220px)', 'missing responsive reset');

for (const [file, text] of [
  ['src/styles/visual-stage13-case-detail-vnext.css', visual],
  ['src/styles/case-detail-stage228r9-shell-rail-lift.css', rail],
]) {
  if (/\uFFFD|ďż˝/.test(text)) failures.push('replacement character found in ' + file);
}

if (failures.length) {
  console.error('STAGE231D0D-R9 tabs center and axis microfix guard: FAIL');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('STAGE231D0D-R9 tabs center and axis microfix guard: PASS');
