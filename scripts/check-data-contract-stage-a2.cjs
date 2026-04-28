const fs = require('fs');
const path = require('path');

const root = process.cwd();
const bridgePath = path.join(root, 'src', 'lib', 'supabase-fallback.ts');
const packagePath = path.join(root, 'package.json');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Brak pliku: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(content, needle, label) {
  if (!content.includes(needle)) throw new Error(`Brak wymaganego kontraktu A2: ${label}`);
  console.log(`OK: ${label}`);
}

const bridge = read(bridgePath);
const pkg = read(packagePath);

[
  "from './data-contract'",
  'normalizeLeadListContract(context.leads)',
  'normalizeTaskListContract(context.tasks)',
  'normalizeEventListContract(context.events)',
  'normalizeCaseListContract(context.cases)',
  '.then(normalizeLeadListContract)',
  '.then((row) => normalizeLeadContract(row))',
  '.then(normalizeTaskListContract)',
  '.then(normalizeEventListContract)',
  '.then(normalizeCaseListContract)',
  '.then((row) => normalizeCaseContract(row))',
].forEach((needle) => assertIncludes(bridge, needle, `supabase-fallback.ts zawiera ${needle}`));

assertIncludes(pkg, 'check:data-contract-stage-a2', 'package.json ma skrypt Stage A2');
assertIncludes(pkg, 'check-data-contract-stage-a2.cjs', 'package.json odpala guard Stage A2');

console.log('OK: Stage A2 client data contract bridge guard passed.');
