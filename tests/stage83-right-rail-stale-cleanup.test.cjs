const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const tokens = [
  ['Leady do ', 'spi\u0119cia'].join(''),
  ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
  ['data-clients-lead-', 'attention-rail'].join(''),
  ['clients-lead-', 'attention-card'].join(''),
  ['lead-', 'attention'].join(''),
  ['leadsNeedingClientOr', 'CaseLink'].join(''),
  ['STAGE74_CLIENTS_LEADS_TO_LINK_', 'EMPTY_COPY'].join(''),
  ['STALE_CLIENTS_LEAD_LINKING_COPY_', 'REMOVED'].join(''),
];
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp, out);
    else if (/\.(tsx?|jsx?|cjs|mjs|css)$/.test(entry.name)) out.push(fp);
  }
  return out;
}
test('old clients rail copy and attributes are absent from source guards and scripts', () => {
  const files = ['src','tests','scripts'].flatMap((d) => walk(path.join(root, d)));
  const offenders = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (tokens.some((t) => text.includes(t))) offenders.push(path.relative(root, file));
  }
  assert.deepEqual(offenders, []);
});
