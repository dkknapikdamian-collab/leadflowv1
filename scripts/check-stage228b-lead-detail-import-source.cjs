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

const imports = extractImports(source);
const bySource = (name) => imports.filter((entry) => entry.source === name).flatMap((entry) => importNames(entry.spec));
const react = bySource('react');
const router = bySource('react-router-dom');
const lucide = bySource('lucide-react');

const failures = [];
for (const name of ['FormEvent', 'ReactNode', 'useEffect', 'useMemo', 'useRef', 'useState']) {
  if (!react.includes(name)) failures.push(`react import missing ${name}`);
}
for (const name of ['useNavigate', 'useParams']) {
  if (!router.includes(name)) failures.push(`react-router-dom import missing ${name}`);
}
for (const name of ['AlertTriangle', 'ArrowLeft', 'ArrowRight', 'CheckCircle2', 'Clock', 'DollarSign', 'Edit2', 'Loader2', 'Mail', 'Mic', 'MicOff', 'MoreVertical', 'Phone', 'Plus', 'Trash2']) {
  if (!lucide.includes(name)) failures.push(`lucide-react import missing ${name}`);
}

for (const bad of ['useNavigate', 'useParams', 'useRef', 'useState', 'useMemo', 'useEffect', 'FormEvent', 'ReactNode']) {
  if (lucide.includes(bad)) failures.push(`${bad} must never be imported from lucide-react`);
}
for (const bad of ['ArrowLeft', 'ArrowRight', 'AlertTriangle', 'CheckCircle2', 'Clock', 'DollarSign', 'Edit2', 'Loader2', 'Mail', 'Mic', 'MicOff', 'MoreVertical', 'Phone', 'Plus', 'Trash2']) {
  if (react.includes(bad)) failures.push(`${bad} must never be imported from react`);
  if (router.includes(bad)) failures.push(`${bad} must never be imported from react-router-dom`);
}

if (failures.length) {
  console.error('STAGE228B_R13_LEAD_DETAIL_IMPORT_SOURCE_GUARD FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, stage: 'STAGE228B_R13_CANONICAL_IMPORTS_REPAIR', guard: 'check:stage228b-lead-detail-import-source' }, null, 2));
