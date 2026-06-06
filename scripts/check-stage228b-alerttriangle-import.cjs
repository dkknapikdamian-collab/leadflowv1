const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/pages/LeadDetail.tsx');
const source = fs.readFileSync(file, 'utf8');

function extractImports(text) {
  const imports = [];
  const re = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?/g;
  let match;
  while ((match = re.exec(text))) imports.push({ full: match[0], spec: match[1], source: match[2] });
  return imports;
}

function importNames(spec) {
  const m = spec.match(/\{([\s\S]*?)\}/);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((part) => part.trim().replace(/^type\s+/, '').replace(/\s+as\s+.*$/, '').trim())
    .filter(Boolean);
}

const usesAlertTriangle = /<\s*AlertTriangle\b|\bAlertTriangle\b/.test(source.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, ''));
const lucideNames = extractImports(source).filter((entry) => entry.source === 'lucide-react').flatMap((entry) => importNames(entry.spec));
const failures = [];

if (usesAlertTriangle && !lucideNames.includes('AlertTriangle')) failures.push('LeadDetail uses AlertTriangle but does not import it from lucide-react.');
if (lucideNames.includes('useNavigate')) failures.push('useNavigate must not be imported from lucide-react.');
if (lucideNames.includes('useParams')) failures.push('useParams must not be imported from lucide-react.');

if (failures.length) {
  console.error('STAGE228B_R13_ALERTTRIANGLE_IMPORT_GUARD FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, stage: 'STAGE228B_R13_CANONICAL_IMPORTS_REPAIR', guard: 'check:stage228b-alerttriangle-import', usesAlertTriangle }, null, 2));
