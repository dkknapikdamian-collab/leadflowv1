const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const appPath = path.join(repoRoot, 'src/App.tsx');
const errors = [];

function fail(message) { errors.push(message); }
if (!fs.existsSync(appPath)) fail('Missing src/App.tsx');
const app = fs.existsSync(appPath) ? fs.readFileSync(appPath, 'utf8') : '';

if (!app.includes("const SalesFunnel = lazyPage(() => import('./pages/SalesFunnel'), 'SalesFunnel');")) {
  fail('SalesFunnel lazy import is missing');
}
if (!app.includes('path="/funnel"')) {
  fail('Protected /funnel route is missing');
}
if (!app.includes('path="/dev/funnel"')) {
  fail('Dev-only /dev/funnel preview route is missing');
}
if (!app.includes('import.meta.env.DEV ? <SalesFunnel /> : <Navigate to="/login" />')) {
  fail('Dev preview route must be gated by import.meta.env.DEV and redirect outside dev');
}
if (/path="\/dev\/funnel"[^\n]+isLoggedIn\s*\?/.test(app)) {
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
