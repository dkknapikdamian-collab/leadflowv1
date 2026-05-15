const fs = require('fs');
const path = require('path');

const root = process.cwd();
const todayPath = path.join(root, 'src', 'pages', 'TodayStable.tsx');

function fail(message) {
  console.error('TODAYSTABLE_NAMED_EXPORT_V21_FAIL');
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(todayPath)) fail('Missing src/pages/TodayStable.tsx');
let text = fs.readFileSync(todayPath, 'utf8').replace(/^\uFEFF/, '');

if (!/export\s+default\s+function\s+TodayStable\s*\(/.test(text)) {
  fail('TodayStable.tsx does not contain export default function TodayStable(...). Refusing blind patch.');
}

if (!/export\s*\{\s*TodayStable\s*\}\s*;/.test(text)) {
  text = text.trimEnd() + '\n\n/* CLOSEFLOW_V21_TODAYSTABLE_NAMED_EXPORT: fallback for lazyPage runtime interop. */\nexport { TodayStable };\n';
  fs.writeFileSync(todayPath, text, 'utf8');
}

console.log('OK v21 TodayStable named export fix applied.');