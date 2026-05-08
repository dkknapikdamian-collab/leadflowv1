const fs = require('fs');
const path = require('path');

const root = process.cwd();
const src = path.join(root, 'src');
const exts = new Set(['.tsx', '.ts', '.jsx', '.js']);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (exts.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function lineNo(text, idx) {
  return text.slice(0, idx).split(/\r?\n/).length;
}

const actionPattern = /(Trash2|Usuń|UsuĹ„|delete|Delete|destructive)/;
const blockingActionPattern = /(Trash2|Usuń|UsuĹ„)/;
const localDangerPattern = /(text|bg|border|ring)-(red|rose)-[0-9]{2,3}/;
const localDangerGlobalPattern = /(text|bg|border|ring)-(red|rose)-[0-9]{2,3}/g;
const allowedSharedFiles = new Set(['src/components/entity-actions.tsx']);
const findings = [];
const blockingFindings = [];

for (const file of walk(src)) {
  const text = fs.readFileSync(file, 'utf8');
  if (!actionPattern.test(text)) continue;

  let match;
  while ((match = localDangerGlobalPattern.exec(text))) {
    findings.push({ file: rel(file), line: lineNo(text, match.index), className: match[0] });
  }

  if (allowedSharedFiles.has(rel(file))) continue;

  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!blockingActionPattern.test(line)) return;
    const start = Math.max(0, index - 3);
    const end = Math.min(lines.length, index + 4);
    const windowText = lines.slice(start, end).join('\n');
    const localDanger = windowText.match(localDangerPattern);
    if (localDanger) {
      blockingFindings.push({ file: rel(file), line: index + 1, className: localDanger[0] });
    }
  });
}

const requiredFiles = [
  'src/components/entity-actions.tsx',
  'src/styles/closeflow-action-tokens.css',
];

for (const required of requiredFiles) {
  if (!fs.existsSync(path.join(root, required))) {
    blockingFindings.push({ file: required, line: 1, className: 'missing shared danger contract file' });
  }
}

const actionTokensPath = path.join(root, 'src/styles/closeflow-action-tokens.css');
const actionTokens = fs.existsSync(actionTokensPath) ? fs.readFileSync(actionTokensPath, 'utf8') : '';

for (const token of ['--cf-action-danger-text', '--cf-action-danger-bg', '--cf-action-danger-border', '.cf-entity-action-danger']) {
  if (!actionTokens.includes(token)) {
    blockingFindings.push({ file: 'src/styles/closeflow-action-tokens.css', line: 1, className: `missing ${token}` });
  }
}

if (blockingFindings.length) {
  console.error('FAIL: local danger/red styling is too close to delete/trash/destructive actions.');
  for (const finding of blockingFindings) console.error(`- ${finding.file}:${finding.line} ${finding.className}`);
  process.exit(1);
}

if (findings.length) {
  console.warn('AUDIT: legacy local danger/red classes still exist in files that mention delete/destructive. They are not adjacent to delete/trash actions.');
  for (const finding of findings.slice(0, 80)) console.warn(`- ${finding.file}:${finding.line} ${finding.className}`);
} else {
  console.log('OK: no local danger/red classes found in files that mention delete/destructive.');
}

console.log('OK: danger style contract audit completed.');
