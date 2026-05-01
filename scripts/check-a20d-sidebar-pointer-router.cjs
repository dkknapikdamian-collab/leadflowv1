#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
function expect(condition, message) { if (!condition) fail.push(message); }

const layout = read('src/components/Layout.tsx');
expect(/useNavigate/.test(layout), 'Layout.tsx missing useNavigate');
expect(/const navigate = useNavigate\(\)/.test(layout), 'Layout.tsx missing navigate hook');
expect(/handleSidebarPointerRouter/.test(layout), 'Layout.tsx missing sidebar pointer router handler');
expect(/onPointerDownCapture=\{handleSidebarPointerRouter\}/.test(layout), 'Layout.tsx missing root pointer capture handler');
expect(/data-sidebar-pointer-router="true"/.test(layout), 'Layout.tsx missing sidebar pointer router marker');
expect(/document\.querySelectorAll<HTMLElement>/.test(layout), 'Layout.tsx missing coordinate-based nav lookup');
expect(/navigate\(path\)/.test(layout), 'Layout.tsx missing direct navigate(path) call');
expect(/data-nav-path=\{item\.path\}/.test(layout), 'Layout.tsx missing mobile nav data-nav-path');

const indexCss = read('src/index.css');
expect(/stageA20d-sidebar-unified-nav-tone\.css/.test(indexCss), 'src/index.css missing A20d nav tone import');
const css = read('src/styles/stageA20d-sidebar-unified-nav-tone.css');
expect(/STAGE_A20D_SIDEBAR_UNIFIED_NAV_TONE/.test(css), 'A20d CSS marker missing');
expect(/\.nav-btn/.test(css), 'A20d CSS must style nav buttons');
expect(/background:\s*rgba\(15, 23, 42, 0\.52\)\s*!important/.test(css), 'A20d CSS must unify inactive nav tone');

const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a20d-sidebar-pointer-router'], 'package.json missing check:a20d-sidebar-pointer-router');

if (fail.length) {
  console.error('A20d sidebar pointer router guard failed.');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}
console.log('OK: A20d sidebar pointer router guard passed.');
