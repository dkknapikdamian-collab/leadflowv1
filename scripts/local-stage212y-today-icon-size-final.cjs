const fs = require('fs');

function read(path) {
  if (!fs.existsSync(path)) throw new Error(`Missing file: ${path}`);
  return fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
}

function write(path, text) {
  fs.writeFileSync(path, text, 'utf8');
}

const marker = 'STAGE212Y_TODAY_ICON_SIZE_FINAL';

const patchCss = `
/* STAGE212Y_TODAY_ICON_SIZE_FINAL
   Dziś uses the same nav icon frame size as the rest of the sidebar.
   The icon itself is Home, not LayoutDashboard.
*/
body .sidebar a[data-nav-path="/"] .nav-ico,
body a[data-nav-path="/"] .nav-ico,
body .sidebar .nav-btn.active a[data-nav-path="/"] .nav-ico,
body .sidebar .nav-btn.active .nav-ico,
body .nav-btn.active .nav-ico {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  max-width: 28px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  background: rgba(255, 255, 255, 0.10) !important;
  background-color: rgba(255, 255, 255, 0.10) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  box-shadow: none !important;
  outline: 0 !important;
  border-radius: 10px !important;
  color: currentColor !important;
}

body .sidebar a[data-nav-path="/"] .nav-ico svg,
body a[data-nav-path="/"] .nav-ico svg,
body .sidebar .nav-btn.active .nav-ico svg,
body .nav-btn.active .nav-ico svg {
  width: 16px !important;
  height: 16px !important;
  min-width: 16px !important;
  color: currentColor !important;
  stroke: currentColor !important;
  fill: none !important;
}
`;

// 1) Layout: Dziś ma używać Home, nie LayoutDashboard.
const layoutPath = 'src/components/Layout.tsx';
let layout = read(layoutPath);

layout = layout.replace(/\bLayoutDashboard\b/g, 'Home');

// Dedupe importów lucide-react, żeby nie było Home, Home.
layout = layout.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/, (match, inside) => {
  const parts = inside
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  const seen = new Set();
  const unique = [];
  for (const part of parts) {
    if (!seen.has(part)) {
      seen.add(part);
      unique.push(part);
    }
  }

  if (!seen.has('Home')) unique.push('Home');

  return `import {\n  ${unique.join(',\n  ')}\n} from 'lucide-react';`;
});

write(layoutPath, layout);

// 2) Runtime: inline source truth wcześniej ściskał ikonę do 16px. Nadpisujemy funkcję.
const runtimePath = 'src/components/VisualFoundationRuntimeStage212M.tsx';
let runtime = read(runtimePath);

const newFunction = `function forceActiveIcon(el: Element) {
  const node = el as HTMLElement;
  node.style.setProperty('width', '28px', 'important');
  node.style.setProperty('height', '28px', 'important');
  node.style.setProperty('min-width', '28px', 'important');
  node.style.setProperty('max-width', '28px', 'important');
  node.style.setProperty('display', 'inline-flex', 'important');
  node.style.setProperty('align-items', 'center', 'important');
  node.style.setProperty('justify-content', 'center', 'important');
  node.style.setProperty('flex-shrink', '0', 'important');
  node.style.setProperty('padding', '0', 'important');
  node.style.setProperty('margin', '0', 'important');
  node.style.setProperty('background', 'rgba(255, 255, 255, 0.10)', 'important');
  node.style.setProperty('background-color', 'rgba(255, 255, 255, 0.10)', 'important');
  node.style.setProperty('background-image', 'none', 'important');
  node.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.16)', 'important');
  node.style.setProperty('box-shadow', 'none', 'important');
  node.style.setProperty('outline', '0', 'important');
  node.style.setProperty('border-radius', '10px', 'important');

  node.querySelectorAll('svg').forEach((svg) => {
    const icon = svg as SVGElement;
    icon.style.setProperty('width', '16px', 'important');
    icon.style.setProperty('height', '16px', 'important');
    icon.style.setProperty('min-width', '16px', 'important');
    icon.style.setProperty('stroke', 'currentColor', 'important');
    icon.style.setProperty('fill', 'none', 'important');
  });
}`;

runtime = runtime.replace(/function forceActiveIcon\(el: Element\) \{[\s\S]*?\n\}/, newFunction);

if (!runtime.includes(marker)) {
  const cssStart = runtime.indexOf('const css = `');
  if (cssStart === -1) throw new Error('Runtime missing const css template');

  const cssEnd = runtime.indexOf('`;', cssStart);
  if (cssEnd === -1) throw new Error('Runtime css template is not closed');

  runtime = runtime.slice(0, cssEnd) + patchCss + runtime.slice(cssEnd);
}

write(runtimePath, runtime);

// 3) CSS source truth: foundation + shell.
for (const cssPath of [
  'src/styles/closeflow-visual-foundation-stage212m.css',
  'src/styles/visual-stage01-shell.css'
]) {
  let css = read(cssPath);
  if (!css.includes(marker)) {
    css += patchCss;
    write(cssPath, css);
  }
}

console.log('STAGE212Y_TODAY_ICON_SIZE_FINAL_FIX_PASS');
