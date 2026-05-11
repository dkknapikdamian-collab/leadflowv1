const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientDetailPath = path.join(root, 'src/pages/ClientDetail.tsx');
const checkPath = path.join(root, 'scripts/check-closeflow-client-finance-summary.cjs');

function read(abs) {
  if (!fs.existsSync(abs)) throw new Error(`Missing file: ${path.relative(root, abs)}`);
  return fs.readFileSync(abs, 'utf8');
}
function write(abs, text) {
  fs.writeFileSync(abs, text, 'utf8');
}

let text = read(clientDetailPath);
const before = text;

const desired = `<ClientFinanceRelationSummary
            client={client}
            clientId={String((client as any)?.id || '')}
          />`;

// Repair the known bad ETAP8 insertion where client={client} was added as JSX text/child after a self-closing component.
const brokenPattern = /<ClientFinanceRelationSummary\s+clientId=\{String\(\(client as any\)\?\.id \|\| ''\)\}\s*\/>(?:\r?\n\s*)client=\{client\}/m;
if (brokenPattern.test(text)) {
  text = text.replace(brokenPattern, desired);
}

// If the component is present but still lacks the client prop inside the opening tag, normalize it.
const singleLinePattern = /<ClientFinanceRelationSummary\s+clientId=\{String\(\(client as any\)\?\.id \|\| ''\)\}\s*\/>/m;
if (singleLinePattern.test(text)) {
  text = text.replace(singleLinePattern, desired);
}

if (!text.includes('client={client}')) {
  throw new Error('ClientDetail still does not pass client={client} into ClientFinanceRelationSummary.');
}
if (/ClientFinanceRelationSummary[^>]*\/>(?:\r?\n\s*)client=\{client\}/m.test(text)) {
  throw new Error('ClientDetail still contains client={client} outside ClientFinanceRelationSummary tag.');
}
if (text !== before) {
  write(clientDetailPath, text);
}

let check = read(checkPath);
if (!check.includes('ClientFinanceRelationSummary[^>]*client=\\{client\\}')) {
  const needle = "assertIncludes(clientDetail, 'client={client}', 'ClientDetail must pass client to finance summary');";
  const replacement = `${needle}\nconst clientDetailSource = read(clientDetail);\nif (/ClientFinanceRelationSummary[^>]*\\/>\\s*client=\\{client\\}/m.test(clientDetailSource)) {\n  throw new Error('ClientDetail passes client={client} outside ClientFinanceRelationSummary tag.');\n}\nif (!/<ClientFinanceRelationSummary[\\s\\S]*?client=\\{client\\}[\\s\\S]*?\\/>/m.test(clientDetailSource)) {\n  throw new Error('ClientDetail must pass client={client} inside ClientFinanceRelationSummary tag.');\n}`;
  if (!check.includes(needle)) {
    throw new Error('Could not find ClientDetail client assertion in ETAP8 check script.');
  }
  check = check.replace(needle, replacement);
  write(checkPath, check);
}

console.log('CLOSEFLOW_ETAP8_CLIENT_FINANCE_JSX_PROP_REPAIR_OK');
