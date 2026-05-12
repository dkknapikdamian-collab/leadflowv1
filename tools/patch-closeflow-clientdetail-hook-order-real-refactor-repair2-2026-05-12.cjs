const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientDetailPath = path.join(root, 'src/pages/ClientDetail.tsx');
const checkPath = path.join(root, 'scripts/check-closeflow-clientdetail-hook-order-real-refactor.cjs');
const docPath = path.join(root, 'docs/release/CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_REAL_REFACTOR_2026-05-12.md');
const packagePath = path.join(root, 'package.json');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}
function countPadding(source) {
  const markers = [
    /CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING/g,
    /Mirrors skipped hooks:\s*useMemo/g,
    /useMemo\s*\(\s*\(\s*\)\s*=>\s*null\s*,\s*\[\s*\]\s*\)\s*;/g,
  ];
  return markers.reduce((sum, rx) => sum + ((source.match(rx) || []).length), 0);
}

if (!fs.existsSync(clientDetailPath)) {
  throw new Error('Missing src/pages/ClientDetail.tsx');
}

let source = read(clientDetailPath);
const beforeCount = countPadding(source);
if (beforeCount <= 0) {
  console.log('OK: no empty hook padding found in ClientDetail. Keeping file unchanged.');
} else {
  const beforeSource = source;

  // Remove the hotfix padding blocks, including comments and the following empty useMemo call.
  source = source.replace(/\n?[ \t]*\/\*\s*CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING[\s\S]*?\*\/\s*useMemo\s*\(\s*\(\s*\)\s*=>\s*null\s*,\s*\[\s*\]\s*\)\s*;[ \t]*\r?\n?/g, '\n');

  // Remove any older padding comment variant that only carried the "Mirrors skipped hooks" text.
  source = source.replace(/\n?[ \t]*\/\*[\s\S]{0,360}?Mirrors skipped hooks:\s*useMemo[\s\S]{0,360}?\*\/\s*useMemo\s*\(\s*\(\s*\)\s*=>\s*null\s*,\s*\[\s*\]\s*\)\s*;[ \t]*\r?\n?/g, '\n');

  // Final safety sweep for standalone empty hook calls left behind by earlier failed scripts.
  source = source.replace(/^\s*useMemo\s*\(\s*\(\s*\)\s*=>\s*null\s*,\s*\[\s*\]\s*\)\s*;\s*$/gm, '');

  // Normalize excess blank lines caused by removal, but do not reformat the whole file.
  source = source.replace(/\n{4,}/g, '\n\n\n');

  const afterCount = countPadding(source);
  if (afterCount > 0) {
    const sample = source
      .split(/\r?\n/)
      .map((line, index) => ({ line, index: index + 1 }))
      .filter(({ line }) => /CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING|Mirrors skipped hooks:\s*useMemo|useMemo\s*\(\s*\(\s*\)\s*=>\s*null/.test(line))
      .slice(0, 10)
      .map(({ line, index }) => `${index}: ${line}`)
      .join('\n');
    throw new Error('ClientDetail still contains empty hook padding after cleanup. Remaining lines:\n' + sample);
  }

  if (source === beforeSource) {
    throw new Error('ClientDetail padding was detected but no source change was produced.');
  }

  if (!source.includes('export default function ClientDetail()')) {
    throw new Error('ClientDetail export marker disappeared after cleanup. Aborting.');
  }

  write(clientDetailPath, source);
  console.log(`OK: removed empty ClientDetail useMemo hook padding markers (${beforeCount} -> 0).`);
}

const check = `const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const source = fs.readFileSync(file, 'utf8');

const forbidden = [
  'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING',
  'Mirrors skipped hooks: useMemo',
];
for (const marker of forbidden) {
  if (source.includes(marker)) {
    throw new Error('Forbidden ClientDetail hook padding marker still present: ' + marker);
  }
}

const emptyUseMemo = /useMemo\\s*\\(\\s*\\(\\s*\\)\\s*=>\\s*null\\s*,\\s*\\[\\s*\\]\\s*\\)\\s*;/;
if (emptyUseMemo.test(source)) {
  throw new Error('Forbidden empty useMemo(() => null, []) padding still present in ClientDetail.');
}

if (!source.includes('export default function ClientDetail()')) {
  throw new Error('ClientDetail export marker missing.');
}

console.log('OK closeflow-clientdetail-hook-order-real-refactor: no empty hook padding remains in ClientDetail.');
`;
write(checkPath, check);

const doc = `# CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_REAL_REFACTOR_2026-05-12

## Goal

Remove the temporary ClientDetail React #310 hook-order padding added as a hotfix.

## Decision

The previous emergency repair used empty \`useMemo(() => null, [])\` calls as hook-count padding. This repair removes those padding calls and adds a guard so they cannot silently return.

## Scope

- \`src/pages/ClientDetail.tsx\`
- \`scripts/check-closeflow-clientdetail-hook-order-real-refactor.cjs\`
- \`package.json\`

## Completion criteria

- \`npm run check:closeflow-clientdetail-hook-order-real-refactor\` passes.
- \`npm run build\` passes.
- \`ClientDetail.tsx\` contains no empty \`useMemo(() => null, [])\` padding.

## Note

If React #310 returns after deployment, the remaining issue is structural and the next step is a component split: data/container wrapper plus loaded ClientDetail view component. That is the correct surgical fix, not more hook padding.
`;
write(docPath, doc);

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-clientdetail-hook-order-real-refactor'] = 'node scripts/check-closeflow-clientdetail-hook-order-real-refactor.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('OK patch-closeflow-clientdetail-hook-order-real-refactor-repair2: cleanup and guard applied.');
