const fs = require('fs');
const path = require('path');

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');

function fail(message) {
  console.error('LAZY_PAGE_DEFAULT_RUNTIME_STAGE88_FAIL');
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(appPath)) fail('Missing src/App.tsx');
const app = fs.readFileSync(appPath, 'utf8').replace(/^\uFEFF/, '');

const lazyPageDeclCount = (app.match(/\bconst\s+lazyPage\s*=/g) || []).length;
if (lazyPageDeclCount !== 1) fail(`Expected exactly one lazyPage declaration, got ${lazyPageDeclCount}.`);

if (app.includes("lazy(() => import('./pages/")) {
  fail('Direct React.lazy page imports remain. Use lazyPage() for route pages.');
}

if (/import\s+\{\s*Activity\s*,\s*Calendar\s*,\s*Settings\s*\}\s+from\s+['\"]lucide-react['\"]/.test(app)) {
  fail('App.tsx imports Activity/Calendar/Settings icons while route constants use the same names.');
}

const routeRegex = /const\s+(\w+)\s*=\s*lazyPage\(\(\)\s*=>\s*import\(['\"](.+?)['\"]\),\s*['\"](\w+)['\"]\);/g;
const routes = [];
let match;
while ((match = routeRegex.exec(app)) !== null) {
  routes.push({ constName: match[1], importPath: match[2], exportName: match[3] });
}

if (routes.length !== 23) fail(`Expected 23 lazyPage routes, got ${routes.length}.`);

const seenConst = new Set();
for (const route of routes) {
  if (seenConst.has(route.constName)) fail(`Duplicate lazy route const: ${route.constName}`);
  seenConst.add(route.constName);
  const filePath = path.join(root, 'src', route.importPath.replace(/^\.\//, '') + '.tsx');
  if (!fs.existsSync(filePath)) fail(`Missing lazy page file for ${route.constName}: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const hasDefault = /export\s+default\b/.test(content) || /export\s*\{[^}]*\bas\s+default\b[^}]*\}/s.test(content);
  const namedPattern = new RegExp(`export\\s+(function|const|class)\\s+${route.exportName}\\b`);
  if (!hasDefault && !namedPattern.test(content)) {
    fail(`Lazy page ${route.constName} imports ${route.importPath}, but no default export or named export ${route.exportName} was found.`);
  }
}

console.log(`OK lazy page default runtime guard stage88 (${routes.length} routes checked, one lazyPage declaration)`);
