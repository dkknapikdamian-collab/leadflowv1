const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'CLOSEFLOW_PANEL_LINK_GUARD_CLIENTDETAIL_DIAG_REPAIR4_2026_05_11';

function file(rel) { return path.join(root, rel); }
function read(rel) {
  const target = file(rel);
  if (!fs.existsSync(target)) throw new Error('Missing file: ' + rel);
  return fs.readFileSync(target, 'utf8').replace(/^\uFEFF/, '');
}
function write(rel, content) {
  fs.mkdirSync(path.dirname(file(rel)), { recursive: true });
  fs.writeFileSync(file(rel), content, 'utf8');
}

function replaceNamedTest(source, testName, replacement) {
  const marker = "test('" + testName + "', () => {";
  const start = source.indexOf(marker);
  if (start < 0) throw new Error('Cannot find test block: ' + testName);
  const nextTest = source.indexOf("\ntest('", start + marker.length);
  const end = nextTest >= 0 ? nextTest : source.length;
  const before = source.slice(0, start);
  const after = source.slice(end).replace(/^\n+/, '\n');
  return before + replacement.trimEnd() + '\n\n' + after.replace(/^\n+/, '');
}

function patchPanelDeleteTest() {
  const rel = 'tests/panel-delete-actions-v1.test.cjs';
  let src = read(rel);
  const testName = 'Panel trash actions keep cards navigable through Link wrappers';
  const replacement = [
    "test('Panel trash actions keep cards navigable through Link wrappers', () => {",
    "  const clients = read('src/pages/Clients.tsx');",
    "  const leads = read('src/pages/Leads.tsx');",
    "",
    "  assert.match(clients, /<Link\\s+to=\\{`\\/clients\\/\\$\\{client\\.id\\}`\\}\\s+className=\"block\"/);",
    "  assert.match(clients, /event\\.preventDefault\\(\\)/);",
    "  assert.match(clients, /event\\.stopPropagation\\(\\)/);",
    "  assert.match(leads, /<Link[\\s\\S]{0,360}to=\\{`\\/leads\\//);",
    "  assert.match(leads, /className=\"block\"/);",
    "  assert.match(leads, /event\\.preventDefault\\(\\)/);",
    "  assert.match(leads, /event\\.stopPropagation\\(\\)/);",
    "});",
  ].join('\n');

  if (src.includes("/<Link\\s+to=\\{`\\/clients\\/\\$\\{client\\.id\\}`\\}\\s+className=\"block\"/")) {
    return false;
  }

  const next = replaceNamedTest(src, testName, replacement);
  if (next === src) return false;
  if (!next.includes("<Link\\s+to=\\{`\\/clients")) throw new Error('Panel test patch did not insert client Link guard');
  if (!next.includes("<Link[\\s\\S]{0,360}to=\\{`\\/leads\\/")) throw new Error('Panel test patch did not insert lead Link guard');
  write(rel, next);
  return true;
}

function writeClientDetailDiagnostic() {
  const rel = 'tools/diagnose-clientdetail-hook-order-2026-05-11.cjs';
  const content = String.raw`const fs = require('fs');
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
`;
  write(rel, content);
  return true;
}

function writeReleaseDoc(results) {
  const rel = 'docs/release/CLOSEFLOW_PANEL_LINK_GUARD_CLIENTDETAIL_DIAG_REPAIR4_2026-05-11.md';
  const content = `# CloseFlow panel link guard + ClientDetail diag repair4

## Stage

${STAGE}

## Cel

Naprawia dwa problemy po paczkach repair1-repair3:

1. Test panel delete nie jest już kruchy na dokładny string \`className=\"relative group/client-card\"\`.
2. Diagnostic ClientDetail ignoruje \`return\` wewnątrz callbacków i sprawdza tylko top-level hook order.
3. Nieudane lokalne repair tools są czyszczone przez apply script, żeby nie brudziły commita.

## Wynik patcha

- panel test changed: ${results.panelTestChanged}
- diagnostic changed: ${results.diagnosticChanged}

## Weryfikacja

\`\`\`powershell
node --check tools/diagnose-clientdetail-hook-order-2026-05-11.cjs
node tools/diagnose-clientdetail-hook-order-2026-05-11.cjs
node --test tests/panel-delete-actions-v1.test.cjs
npm.cmd run build
npm.cmd run verify:closeflow:quiet
\`\`\`
`;
  write(rel, content);
  return true;
}

const results = {
  panelTestChanged: patchPanelDeleteTest(),
  diagnosticChanged: writeClientDetailDiagnostic(),
};
writeReleaseDoc(results);
console.log('PASS ' + STAGE);
console.log(JSON.stringify(results, null, 2));
