const fs = require('fs');
const file = 'src/pages/ClientDetail.tsx';
const src = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const lines = src.split(/\r?\n/);
const startIndex = lines.findIndex((line) =>
  line.includes('export default function ClientDetail') ||
  line.includes('function ClientDetail(') ||
  line.includes('const ClientDetail')
);
if (startIndex < 0) {
  console.error('Missing ClientDetail component start');
  process.exit(2);
}
function stripStrings(line) {
  return line
    .replace(/\`(?:\\.|[^\`])*\`/g, '\`\`')
    .replace(/"(?:\\.|[^"])*"/g, '""')
    .replace(/'(?:\\.|[^'])*'/g, "''");
}
const hookRegex = /\b(useState|useEffect|useMemo|useCallback|useRef|useWorkspace|useParams|useNavigate)\s*\(/;
const returnRegex = /^\s*(if\s*\(.+\)\s*)?return\b/;
let depth = 0;
let entered = false;
let endIndex = lines.length - 1;
const topLevelHooks = [];
const topLevelReturns = [];
const nestedHookLike = [];
for (let i = startIndex; i < lines.length; i += 1) {
  const raw = lines[i];
  const line = stripStrings(raw);
  for (const char of line) {
    if (char === '{') { depth += 1; entered = true; }
    if (char === '}') depth -= 1;
  }
  const currentDepth = depth;
  if (hookRegex.test(raw)) {
    const hit = { line: i + 1, depth: currentDepth, text: raw.trim() };
    if (currentDepth <= 1) topLevelHooks.push(hit);
    else nestedHookLike.push(hit);
  }
  if (returnRegex.test(raw) && currentDepth <= 1) {
    topLevelReturns.push({ line: i + 1, depth: currentDepth, text: raw.trim() });
  }
  if (entered && depth <= 0 && i > startIndex) {
    endIndex = i;
    break;
  }
}
const firstReturn = topLevelReturns[0]?.line || null;
const hooksAfterFirstReturn = firstReturn ? topLevelHooks.filter((hook) => hook.line > firstReturn) : [];
console.log('ClientDetail component lines:', String(startIndex + 1) + '-' + String(endIndex + 1));
console.log('ClientDetail top-level hooks:', topLevelHooks.length);
console.log('ClientDetail top-level returns:', topLevelReturns.length);
if (firstReturn) console.log('First top-level return:', firstReturn, topLevelReturns[0].text);
if (hooksAfterFirstReturn.length) {
  console.error('FAIL ClientDetail has top-level hooks after first top-level return. This can cause React #310.');
  hooksAfterFirstReturn.forEach((hook) => console.error(hook.line + ': ' + hook.text));
  process.exit(1);
}
console.log('PASS ClientDetail top-level hook order guard');
if (nestedHookLike.length) {
  console.log('Nested hook-like lines ignored by top-level guard:', nestedHookLike.length);
}
