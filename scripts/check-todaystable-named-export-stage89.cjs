const fs = require('fs');
const path = require('path');

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
const todayPath = path.join(root, 'src', 'pages', 'TodayStable.tsx');

function fail(message) {
  console.error('TODAYSTABLE_NAMED_EXPORT_STAGE89_FAIL');
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(appPath)) fail('Missing src/App.tsx');
if (!fs.existsSync(todayPath)) fail('Missing src/pages/TodayStable.tsx');

const app = fs.readFileSync(appPath, 'utf8').replace(/^\uFEFF/, '');
const today = fs.readFileSync(todayPath, 'utf8').replace(/^\uFEFF/, '');

if (!/const\s+Today\s*=\s*lazyPage\(\(\)\s*=>\s*import\(['\"]\.\/pages\/TodayStable['\"]\),\s*['\"]TodayStable['\"]\);/.test(app)) {
  fail('App.tsx must load Today through lazyPage(() => import(./pages/TodayStable), TodayStable).');
}

if (!/export\s+default\s+function\s+TodayStable\s*\(/.test(today)) {
  fail('TodayStable.tsx must keep default export function TodayStable.');
}

if (!/export\s*\{\s*TodayStable\s*\}\s*;/.test(today)) {
  fail('TodayStable.tsx must also expose named export TodayStable for lazyPage fallback.');
}

const namedExportCount = (today.match(/export\s*\{\s*TodayStable\s*\}\s*;/g) || []).length;
if (namedExportCount !== 1) {
  fail(`Expected exactly one named TodayStable export, got ${namedExportCount}.`);
}

console.log('OK TodayStable named export runtime guard stage89');
