const fs = require('fs');

const component = fs.readFileSync('src/components/operator-rail/TopValueRecordsCard.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-right-rail-source-truth.css', 'utf8');

const failures = [];

for (const token of [
  'cf-top-value-separator',
  'cf-top-value-line-with-description',
  'cf-top-value-line-single',
  'title={item.label}',
  "'data-cf-top-value-records-card': true",
]) {
  if (!component.includes(token)) failures.push('Component missing token: ' + token);
}

for (const token of [
  'CLOSEFLOW_STAGE181E_TOP_VALUE_NAME_DESCRIPTION_SPACING',
  'text-overflow: ellipsis',
  'white-space: nowrap',
  'clients-top-value-records-card',
  'leads-top-value-records-card',
  'grid-template-columns: minmax(0, 1fr) auto',
]) {
  if (!css.includes(token)) failures.push('CSS missing token: ' + token);
}

if (/import\s+\{\s*OperatorSideCard,\s*TopValueRecordsCard\s*\}\s+from\s+['"]\.\.\/components\/operator-rail['"]/.test(component)) {
  failures.push('Bad self import remains in TopValueRecordsCard.');
}

if (failures.length) {
  console.error('Stage181E local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181E local: top value rows separate name/description and use ellipsis/title.');
