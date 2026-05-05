const fs = require('fs');
const path = require('path');
const root = process.cwd();
function fail(label, message) { console.error('FAIL ' + label + ': ' + message); process.exit(1); }
function read(label, rel) { const file = path.join(root, rel); if(!fs.existsSync(file)) fail(label, 'missing ' + rel); return fs.readFileSync(file, 'utf8'); }
function has(label, text, marker, rel) { if(!text.includes(marker)) fail(label, rel + ' missing marker: ' + marker); }
function pkg(label) { return JSON.parse(read(label, 'package.json')); }
module.exports = { root, fail, read, has, pkg };
