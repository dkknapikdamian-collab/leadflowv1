const fs = require('fs');
const file = 'src/pages/ClientDetail.tsx';
const src = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const lines = src.split(/\r?\n/);
const startIndex = lines.findIndex((line) => line.includes('export default function ClientDetail') || line.includes('function ClientDetail(') || line.includes('const ClientDetail'));
if (startIndex < 0) { console.error('Missing ClientDetail component start'); process.exit(2); }
const hookRegex = /\b(useState|useEffect|useMemo|useCallback|useRef|useWorkspace|useParams|useNavigate)\s*\(/;
const returnRegex = /^\s*(if\s*\(.+\)\s*)?return\b/;
const hooks = [];
const returns = [];
for (let i = startIndex; i < lines.length; i += 1) {
  const line = lines[i];
  if (hookRegex.test(line)) hooks.push({ line: i + 1, text: line.trim() });
  if (returnRegex.test(line)) returns.push({ line: i + 1, text: line.trim() });
}
const firstReturn = returns[0]?.line || null;
const hooksAfterFirstReturn = firstReturn ? hooks.filter((hook) => hook.line > firstReturn) : [];
console.log('ClientDetail hooks:', hooks.length);
console.log('ClientDetail returns:', returns.length);
if (firstReturn) console.log('First return:', firstReturn, returns[0].text);
if (hooksAfterFirstReturn.length) {
  console.error('FAIL ClientDetail has hooks after first return. This can cause React #310.');
  hooksAfterFirstReturn.forEach((hook) => console.error(hook.line + ': ' + hook.text));
  process.exit(1);
}
console.log('PASS ClientDetail no hooks after first return');
