const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ROOT = path.resolve(__dirname, '..');
const TOKENS = ["TGVhZHkgZG8gc3BpxJljaWE=","QnJhayBrbGllbnRhIGFsYm8gc3ByYXd5IHByenkgYWt0eXdueW0gdGVtYWNpZQ==","ZGF0YS1jbGllbnRzLWxlYWQtYXR0ZW50aW9uLXJhaWw=","Y2xpZW50cy1sZWFkLWF0dGVudGlvbi1jYXJk","bGVhZC1hdHRlbnRpb24=","bGVhZHNOZWVkaW5nQ2xpZW50T3JDYXNlTGluaw==","U1RBR0U3NF9DTElFTlRTX0xFQURTX1RPX0xJTktfRU1QVFlfQ09QWQ=="].map((x) => Buffer.from(x, 'base64').toString('utf8'));
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.next', 'coverage'].includes(entry.name)) continue;
      walk(full, out);
    } else if (/\.(ts|tsx|js|jsx|cjs|mjs|css|scss|md|json|txt)$/i.test(full)) {
      out.push(full);
    }
  }
  return out;
}
function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function badFiles(scope) {
  const files = scope.flatMap((rel) => walk(path.join(ROOT, rel)));
  const bad = [];
  for (const file of files) {
    const body = fs.readFileSync(file, 'utf8');
    if (TOKENS.some((token) => body.includes(token))) bad.push(path.relative(ROOT, file).replace(/\\/g, '/'));
  }
  return [...new Set(bad)].sort();
}
module.exports = { ROOT, TOKENS, read, badFiles, assert };
