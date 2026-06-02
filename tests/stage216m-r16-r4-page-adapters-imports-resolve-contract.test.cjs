const fs = require('fs');
const path = require('path');

const adaptersFile = 'src/styles/page-adapters/page-adapters.css';
const text = fs.readFileSync(adaptersFile, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const stale = "@import '../stage216m-r15-r2-client-notes-source-truth-actual-repair.css';";
assert(!text.includes(stale), 'Stale R15-R2 CSS import must not stay in page-adapters.css.');
assert(text.includes("@import '../stage216m-r15-r5-client-notes-source-truth-final-repair.css';"), 'R15-R5 CSS import must remain.');
assert(text.includes("@import '../stage216m-r16-r3-client-note-modal-portal-lock.css';"), 'R16-R3 CSS import must remain.');

const importRegex = /@import\s+['"]([^'"]+)['"];?/g;
let match;
const missing = [];
while ((match = importRegex.exec(text))) {
  const importPath = match[1];
  if (!importPath.endsWith('.css')) continue;
  const resolved = path.normalize(path.join(path.dirname(adaptersFile), importPath));
  if (!fs.existsSync(resolved)) missing.push(`${importPath} -> ${resolved}`);
}

assert(missing.length === 0, 'page-adapters.css contains unresolved imports:\n' + missing.join('\n'));
console.log('OK Stage216M-R16-R4 page-adapters imports resolve contract');