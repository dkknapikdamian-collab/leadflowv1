const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const reportsDir = path.join(repo, 'docs', 'reports');

function escapeSuspiciousChars(value) {
  return value.replace(/[ÄĹĂÅÃ]/g, function (ch) {
    return '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
  }).replace(/â€/g, '\\u00e2\\u20ac');
}

function walk(dir, result = []) {
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(target, result);
    else result.push(target);
  }
  return result;
}

let changed = 0;
for (const file of walk(reportsDir)) {
  if (!/\.(json|md|txt)$/i.test(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = escapeSuspiciousChars(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
  }
}

console.log('Polish text reports sanitized: ' + changed);
