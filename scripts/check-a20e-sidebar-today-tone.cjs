#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const fail = [];
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function expect(condition, message) { if (!condition) fail.push(message); }
const cssPath = 'src/styles/stageA20e-sidebar-today-tone-lock.css';
expect(fs.existsSync(path.join(root, cssPath)), 'A20e sidebar tone CSS missing');
const css = fs.existsSync(path.join(root, cssPath)) ? read(cssPath) : '';
expect(css.includes('STAGE_A20E_SIDEBAR_TODAY_TONE_LOCK'), 'A20e CSS marker missing');
expect(/filter:\s*none\s*!important/.test(css), 'A20e CSS must disable dimming filters');
expect(/opacity:\s*1\s*!important/.test(css), 'A20e CSS must force full opacity');
expect(/data-sidebar-pointer-router/.test(css), 'A20e CSS must scope to sidebar pointer router shell');
const indexCss = read('src/index.css');
expect(indexCss.includes("stageA20e-sidebar-today-tone-lock.css"), 'index.css missing A20e import');
const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a20e-sidebar-today-tone'], 'package.json missing check:a20e-sidebar-today-tone');
if (fail.length) {
  console.error('A20e sidebar Today tone guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('OK: A20e sidebar Today tone guard passed.');
