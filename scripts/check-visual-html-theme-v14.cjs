const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
function expect(file, text, label) {
  const body = read(file);
  if (!body.includes(text)) throw new Error(`${file}: missing ${label || text}`);
  console.log(`OK: ${file} contains ${label || text}`);
}
expect('src/index.css', '@import "./styles/visual-html-theme-v14.css";', 'v14 css import');
expect('src/styles/visual-html-theme-v14.css', 'VISUAL_HTML_THEME_V14_CSS', 'v14 css marker');
expect('src/styles/visual-html-theme-v14.css', '.app.cf-html-shell', 'real html shell selector');
expect('src/styles/visual-html-theme-v14.css', '[data-visual-stage-cases="07-cases"]', 'cases route selector');
expect('src/components/Layout.tsx', 'VISUAL_HTML_THEME_V14_LAYOUT', 'v14 layout marker');
expect('src/components/Layout.tsx', 'cf-html-shell', 'html shell class on root');
expect('src/components/Layout.tsx', 'Lead &rarr; klient &rarr; sprawa', 'html-like brand subtitle');
console.log('OK: Visual HTML theme v14 guard passed.');
