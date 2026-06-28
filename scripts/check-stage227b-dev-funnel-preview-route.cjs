const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const appPath = path.join(repoRoot, 'src/App.tsx');
const routesPath = path.join(repoRoot, 'src/lib/routes.ts');
const errors = [];

function fail(message) { errors.push(message); }
if (!fs.existsSync(appPath)) fail('Missing src/App.tsx');
if (!fs.existsSync(routesPath)) fail('Missing src/lib/routes.ts');
const app = fs.existsSync(appPath) ? fs.readFileSync(appPath, 'utf8') : '';
const routes = fs.existsSync(routesPath) ? fs.readFileSync(routesPath, 'utf8') : '';

if (!app.includes("const SalesFunnel = lazyPage(() => import('./pages/SalesFunnel'), 'SalesFunnel');")) {
  fail('SalesFunnel lazy import is missing');
}
if (!routes.includes("funnel: '/funnel'")) {
  fail('CLOSEFLOW_ROUTES.funnel is missing');
}
if (!routes.includes("devFunnel: '/dev/funnel'")) {
  fail('CLOSEFLOW_ROUTES.devFunnel is missing');
}
if (!app.includes('path={CLOSEFLOW_ROUTES.funnel}')) {
  fail('Protected /funnel route constant is missing');
}
if (!app.includes('path={CLOSEFLOW_ROUTES.devFunnel}')) {
  fail('Dev-only /dev/funnel preview route constant is missing');
}
if (!app.includes('import.meta.env.DEV ? <SalesFunnel /> : <Navigate to={loginPath()}')) {
  fail('Dev preview route must be gated by import.meta.env.DEV and redirect outside dev');
}
if (/path=\{CLOSEFLOW_ROUTES\.devFunnel\}[^\n]+isLoggedIn\s*\?/.test(app)) {
  fail('/dev/funnel must not require isLoggedIn');
}
if (/label:\s*'Dev Lejek'|path:\s*'\/dev\/funnel'/.test(fs.existsSync(path.join(repoRoot, 'src/components/Layout.tsx')) ? fs.readFileSync(path.join(repoRoot, 'src/components/Layout.tsx'), 'utf8') : '')) {
  fail('/dev/funnel must not be added to production sidebar navigation');
}

if (errors.length) {
  console.error('\nSTAGE227B DEV FUNNEL PREVIEW ROUTE GUARD FAILED');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('PASS STAGE227B dev-only funnel preview route guard');
