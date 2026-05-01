#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
function expect(condition, message) { if (!condition) fail.push(message); }
const indexCss = read('src/index.css');
expect(/stageA20c-sidebar-today-hitbox-fix\.css/.test(indexCss), 'src/index.css missing A20c sidebar hitbox import');
const css = read('src/styles/stageA20c-sidebar-today-hitbox-fix.css');
expect(/STAGE_A20C_SIDEBAR_TODAY_HITBOX_FIX/.test(css), 'A20c CSS marker missing');
expect(/\.main-today\[data-shell-main="true"\]/.test(css), 'A20c CSS must target Today main');
expect(/pointer-events:\s*none\s*!important/.test(css), 'A20c CSS must disable pointer events on Today main shell');
expect(/> \[data-shell-content="true"\] \*/.test(css), 'A20c CSS must restore pointer events for Today content children');
expect(/\.sidebar\[data-shell-sidebar="true"\]/.test(css), 'A20c CSS must target shell sidebar');
expect(/z-index:\s*2147483000\s*!important/.test(css), 'A20c CSS must raise sidebar above Today layers');
expect(/nav-btn/.test(css) && /touch-action:\s*manipulation\s*!important/.test(css), 'A20c CSS must preserve nav click/touch hitbox');
const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a20c-sidebar-hitbox'], 'package.json missing check:a20c-sidebar-hitbox');
if (fail.length) {
  console.error('A20c sidebar hitbox guard failed.');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}
console.log('OK: A20c sidebar hitbox guard passed.');
