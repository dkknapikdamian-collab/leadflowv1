const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function must(condition, message) {
  if (!condition) throw new Error(message);
}

const css = read('src/index.css');
const packageJson = JSON.parse(read('package.json'));
const viteConfig = read('vite.config.ts');

must(css.includes('@import "tailwindcss" source("./");'), 'src/index.css must use @import "tailwindcss" source("./");');
must(!css.includes('@import "tailwindcss";'), 'old unscoped Tailwind import must not remain');
must(css.trimStart().startsWith('@import "tailwindcss" source("./");'), 'Tailwind import must stay first to preserve import-order contract');
must(packageJson.scripts && packageJson.scripts.build === 'vite build', 'package.json build script must remain normal vite build');
must(!JSON.stringify(packageJson.scripts || {}).toLowerCase().includes('timeout'), 'package scripts must not add timeout build wrappers');
must(viteConfig.includes("import tailwindcss from '@tailwindcss/vite';"), 'vite.config.ts must still use @tailwindcss/vite');
must(viteConfig.includes('tailwindcss()'), 'vite.config.ts must still register Tailwind plugin');
must(!fs.existsSync(path.join(root, 'scripts', 'check-stage232i4-r16a-repair-markers-and-build-scope.cjs')), 'failed R16A guard artifact must be removed');
must(!fs.existsSync(path.join(root, 'tests', 'stage232i4-r16a-repair-markers-and-build-scope.test.cjs')), 'failed R16A test artifact must be removed');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16B_BUILD_NORMALIZATION_FIRST',
  contract: 'normal npm run build, Tailwind v4 scan scope limited to src, failed R16/R16A artifacts removed, no timeout wrapper'
}, null, 2));
