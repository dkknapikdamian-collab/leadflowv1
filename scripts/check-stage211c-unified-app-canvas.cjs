const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function fail(message) {
  console.error('STAGE211C_UNIFIED_APP_CANVAS_GUARD_FAIL: ' + message);
  process.exit(1);
}

const cssPath = path.join(repo, 'src/styles/closeflow-unified-page-canvas-stage211c.css');
if (!fs.existsSync(cssPath)) fail('missing unified canvas css file');

const css = fs.readFileSync(cssPath, 'utf8');
for (const required of [
  'STAGE211C_UNIFIED_APP_CANVAS',
  '--closeflow-unified-canvas',
  '[data-shell-main="true"]',
  '[data-shell-content="true"]',
  '[class$="-vnext-page"]',
  'background-image: none !important',
  '--stage211c-unified-app-canvas: 1'
]) {
  if (!css.includes(required)) fail('css missing required marker: ' + required);
}

const layoutPath = path.join(repo, 'src/components/Layout.tsx');
const layout = fs.readFileSync(layoutPath, 'utf8');
if (!layout.includes("closeflow-unified-page-canvas-stage211c.css")) {
  fail('Layout.tsx does not import unified canvas css');
}

const pagesDir = path.join(repo, 'src/pages');
const pageFiles = fs.readdirSync(pagesDir)
  .filter((name) => name.endsWith('.tsx'))
  .map((name) => path.join(pagesDir, name))
  .filter((file) => {
    const text = fs.readFileSync(file, 'utf8');
    return text.includes("from '../components/Layout'") || text.includes('from "../components/Layout"');
  });

const missing = [];
for (const file of pageFiles) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes("closeflow-unified-page-canvas-stage211c.css")) {
    missing.push(path.relative(repo, file));
  }
}

if (missing.length) {
  fail('layout page files missing unified canvas import: ' + missing.join(', '));
}

console.log('STAGE211C_UNIFIED_APP_CANVAS_GUARD_PASS');
