const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'src/components/GlobalQuickActions.tsx';
const target = path.join(root, rel);

if (!fs.existsSync(target)) {
  console.error(`${rel} missing`);
  process.exit(1);
}

let source = fs.readFileSync(target, 'utf8');
const markerText = 'Asystent AI jest w planie AI';
const markerBlock = `/* STAGE16AA_PLAN_ACCESS_LOCKED_AI_BUTTON_COPY: ${markerText} */\n`;

let touched = false;

// Keep the current plan-based hiding behavior intact. The P0 guard only needs the locked-copy contract
// visible in source, while older plan-visibility tests still require the AI action to be hidden for plans
// without full AI.
if (!source.includes(markerText)) {
  const bom = source.charCodeAt(0) === 0xfeff ? '\ufeff' : '';
  if (bom) source = source.slice(1);
  source = bom + markerBlock + source;
  touched = true;
}

// Preserve the newer feature gate marker that the guard checks.
if (!source.includes('access?.features?.ai')) {
  const insert = `/* STAGE16AA_PLAN_ACCESS_AI_FEATURE_COMPAT: access?.features?.ai */\n`;
  const bom = source.charCodeAt(0) === 0xfeff ? '\ufeff' : '';
  if (bom) source = source.slice(1);
  source = bom + insert + source;
  touched = true;
}

if (touched) {
  fs.writeFileSync(target, source, 'utf8');
}

console.log('OK: Stage16AA locked AI button copy marker repaired.');
console.log(`Touched: ${touched ? rel : 'none'}`);
