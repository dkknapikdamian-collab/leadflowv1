const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Tailwind v4 detection is scoped to src without build timeout wrapper', () => {
  const css = read('src/index.css');
  assert.ok(css.includes('@import "tailwindcss" source("./");'));
  assert.equal(css.includes('@import "tailwindcss";'), false);
  assert.ok(css.trimStart().startsWith('@import "tailwindcss" source("./");'));
});

test('normal build command stays unchanged', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.scripts.build, 'vite build');
  assert.equal(JSON.stringify(packageJson.scripts).toLowerCase().includes('timeout'), false);
});

test('Tailwind Vite plugin remains active', () => {
  const viteConfig = read('vite.config.ts');
  assert.ok(viteConfig.includes("import tailwindcss from '@tailwindcss/vite';"));
  assert.ok(viteConfig.includes('tailwindcss()'));
});

test('failed R16A build-timeout artifacts are not repo source of truth', () => {
  assert.equal(fs.existsSync(path.join(root, 'scripts', 'check-stage232i4-r16a-repair-markers-and-build-scope.cjs')), false);
  assert.equal(fs.existsSync(path.join(root, 'tests', 'stage232i4-r16a-repair-markers-and-build-scope.test.cjs')), false);
});
