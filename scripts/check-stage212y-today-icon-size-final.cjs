const fs = require('fs');

function fail(message) {
  console.error('STAGE212Y_GUARD_FAIL: ' + message);
  process.exit(1);
}

function read(path) {
  if (!fs.existsSync(path)) fail(`missing file: ${path}`);
  return fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
}

const marker = 'STAGE212Y_TODAY_ICON_SIZE_FINAL';

const layout = read('src/components/Layout.tsx');
const runtime = read('src/components/VisualFoundationRuntimeStage212M.tsx');
const foundation = read('src/styles/closeflow-visual-foundation-stage212m.css');
const shell = read('src/styles/visual-stage01-shell.css');

if (layout.includes('LayoutDashboard')) {
  fail('LayoutDashboard still remains in Layout.tsx');
}

if (!layout.includes('Home')) {
  fail('Home icon is missing in Layout.tsx');
}

if (!layout.includes("label: 'Dziś'")) {
  fail('Dziś label missing in Layout.tsx');
}

for (const [name, text] of [
  ['VisualFoundationRuntimeStage212M.tsx', runtime],
  ['closeflow-visual-foundation-stage212m.css', foundation],
  ['visual-stage01-shell.css', shell],
]) {
  if (!text.includes(marker)) {
    fail(`${name} missing Stage212Y marker`);
  }

  if (!text.includes('a[data-nav-path="/"] .nav-ico')) {
    fail(`${name} missing today nav icon selector`);
  }

  if (!text.includes("width: 28px") && !text.includes("'28px'")) {
    fail(`${name} missing 28px icon frame width`);
  }

  if (!text.includes("height: 28px") && !text.includes("'28px'")) {
    fail(`${name} missing 28px icon frame height`);
  }

  if (!text.includes("width: 16px") && !text.includes("'16px'")) {
    fail(`${name} missing 16px svg icon width`);
  }
}

console.log('STAGE212Y_TODAY_ICON_SIZE_FINAL_GUARD_PASS');
