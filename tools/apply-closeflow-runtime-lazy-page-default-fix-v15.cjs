const fs = require('fs');
const path = require('path');

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
const projectDir = path.join(root, '_project');
const runsDir = path.join(projectDir, 'runs');
const auditsDir = path.join(root, 'docs', 'audits');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '') : '';
}
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}
function appendOnce(file, marker, block) {
  const current = read(file);
  if (current.includes(marker)) return;
  const next = current.trimEnd() + '\n\n' + block.trimEnd() + '\n';
  write(file, next);
}
function fail(message) {
  console.error('CLOSEFLOW_LAZY_PAGE_DEFAULT_FIX_V15_FAIL');
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(appPath)) fail('Missing src/App.tsx');
let app = read(appPath);

// This import is unused in App routing and collides by name with lazy route constants.
app = app.replace("import { Activity, Calendar, Settings } from 'lucide-react';\n", '');
app = app.replace('import { Activity, Calendar, Settings } from "lucide-react";\n', '');

const lazyConstRe = /const\s+([A-Za-z0-9_]+)\s*=\s*lazy\(\(\)\s*=>\s*import\((['"])(\.\/pages\/[^'"]+)\2\)\);/g;
const matches = [...app.matchAll(lazyConstRe)];
if (!matches.length && !app.includes('lazyPage(() => import(')) {
  fail('No lazy page imports found and lazyPage wrapper not present. Refusing to patch blindly.');
}

const helper = `const lazyPage = (loader: () => Promise<any>, exportName: string) => lazy(async () => {\n  const mod = await loader();\n  const component = mod?.default ?? mod?.[exportName];\n  if (!component) {\n    throw new Error(\`CLOSEFLOW_LAZY_PAGE_DEFAULT_MISSING: \${exportName}\`);\n  }\n  return { default: component };\n});\n\n`;

if (!app.includes('const lazyPage = (loader: () => Promise<any>, exportName: string)')) {
  const firstLazyIndex = app.search(lazyConstRe);
  if (firstLazyIndex < 0) fail('Could not find insertion point for lazyPage helper.');
  app = app.slice(0, firstLazyIndex) + helper + app.slice(firstLazyIndex);
}

app = app.replace(lazyConstRe, (full, name, quote, importPath) => {
  return `const ${name} = lazyPage(() => import('${importPath}'), '${name}');`;
});

write(appPath, app);

const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const report = `# CloseFlow runtime lazy page default fix v15\n\n## FAKT\n- Runtime error reported after v14: APP_ROUTE_RENDER_FAILED and TypeError reading default.\n- App routes are loaded through React.lazy.\n- React.lazy expects modules resolving to an object with a valid default component.\n- v15 adds lazyPage wrapper that accepts module.default or a named export matching the route variable.\n- v15 removes unused lucide icon route-name collision import from src/App.tsx when present.\n\n## DECYZJA\n- This is a runtime hardening hotfix only.\n- No route paths, UI copy, product behavior or business logic are intentionally changed.\n- Add a guard so future lazy route chunks cannot silently miss default/named component exports.\n\n## Manual test\n- Deploy/redeploy.\n- Hard refresh.\n- Confirm login/root page renders.\n- If the same old chunk remains, clear service worker/site cache.\n`;
write(path.join(runsDir, `${stamp}_runtime_lazy_page_default_fix_v15.md`), report);
write(path.join(auditsDir, 'lazy-page-default-runtime-fix-v15-2026-05-15.md'), report);

appendOnce(
  path.join(projectDir, '06_GUARDS_AND_TESTS.md'),
  'Lazy page default runtime guard v15',
  `## 2026-05-15 - Lazy page default runtime guard v15\n- node scripts/check-lazy-page-default-runtime-stage88.cjs`
);
appendOnce(
  path.join(projectDir, '08_CHANGELOG_AI.md'),
  'v15 runtime lazy page default fix',
  `## 2026-05-15 - v15 runtime lazy page default fix\n- Added lazyPage wrapper for React.lazy route chunks.\n- Added guard for lazy route default/named exports.\n- No UI/routing/product logic change intended.`
);
appendOnce(
  path.join(projectDir, '10_PROJECT_TIMELINE.md'),
  'v15 runtime lazy page default fix',
  `## 2026-05-15 - v15 runtime lazy page default fix\n- Hardened lazy route imports after APP_ROUTE_RENDER_FAILED with default export read error.`
);

console.log('OK v15 lazy page default fix applied.');
