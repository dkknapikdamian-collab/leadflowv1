#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const failures = [];

const scanRoots = ['api', 'src/server'];
const exts = new Set(['.ts', '.tsx', '.js', '.cjs', '.mjs']);
const allowFiles = new Set([
  'scripts/check-no-body-workspace-trust.cjs',
  'scripts/check-workspace-scope.cjs',
  'tests/workspace-isolation.test.cjs',
]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(full, out);
    } else if (exts.has(path.extname(full))) {
      out.push(full);
    }
  }
  return out;
}
function rel(file) { return path.relative(root, file).replace(/\\/g, '/'); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function lineNo(text, index) { return text.slice(0, index).split(/\r?\n/).length; }

const forbidden = [
  /\bbody\s*\.\s*workspaceId\b/g,
  /\bbody\s*\.\s*workspace_id\b/g,
  /\breq\s*\.\s*body\s*\.\s*workspaceId\b/g,
  /\breq\s*\.\s*body\s*\.\s*workspace_id\b/g,
  /\bquery\s*\.\s*workspaceId\b/g,
  /\bquery\s*\.\s*workspace_id\b/g,
  /firstQueryValue\(\s*query\.workspaceId\s*\)/g,
  /firstQueryValue\(\s*query\.workspace_id\s*\)/g,
];

for (const base of scanRoots) {
  for (const file of walk(path.join(root, base))) {
    const r = rel(file);
    if (allowFiles.has(r)) continue;
    const text = read(file);
    for (const pattern of forbidden) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text))) {
        failures.push(`${r}:${lineNo(text, match.index)}: forbidden workspace trust pattern: ${match[0]}`);
      }
    }
  }
}

const requestScope = path.join(root, 'src/server/_request-scope.ts');
if (fs.existsSync(requestScope)) {
  const text = read(requestScope);
  if (!text.includes('STAGE15_NO_BODY_WORKSPACE_TRUST')) failures.push('src/server/_request-scope.ts missing STAGE15_NO_BODY_WORKSPACE_TRUST marker');
  if (text.includes('if (identity.userId || identity.email) return true')) failures.push('assertWorkspaceOwnerOrAdmin still allows any authenticated identity as workspace owner fallback');
}

if (failures.length) {
  console.error('No-body-workspace-trust guard failed.');
  for (const f of failures.slice(0, 120)) console.error('- ' + f);
  if (failures.length > 120) console.error(`...and ${failures.length - 120} more`);
  process.exit(1);
}
console.log('OK: no server trust in body/query workspaceId detected.');
