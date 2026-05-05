const fs = require('fs');
const path = require('path');
function read(rel) { return fs.readFileSync(path.join(process.cwd(), rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(process.cwd(), rel)); }
function pkg() { return JSON.parse(read('package.json')); }
function fail(scope, message) { console.error('FAIL ' + scope + ': ' + message); process.exit(1); }
function requireIncludes(scope, rel, markers) {
  if (!exists(rel)) fail(scope, 'missing ' + rel);
  const text = read(rel);
  for (const marker of markers) if (!text.includes(marker)) fail(scope, rel + ' missing marker: ' + marker);
}
function requireScript(scope, name, command) {
  const scripts = pkg().scripts || {};
  if (scripts[name] !== command) fail(scope, 'package.json missing script ' + name);
}
module.exports = { read, exists, pkg, fail, requireIncludes, requireScript };
