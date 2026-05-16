const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function findModule(importPath) {
  const baseRelative = path.join('src', importPath.replace(/^\.\//, ''));
  const candidates = [
    baseRelative,
    baseRelative + '.tsx',
    baseRelative + '.ts',
    baseRelative + '.jsx',
    baseRelative + '.js',
    path.join(baseRelative, 'index.tsx'),
    path.join(baseRelative, 'index.ts'),
    path.join(baseRelative, 'index.jsx'),
    path.join(baseRelative, 'index.js'),
  ];

  for (const relativePath of candidates) {
    if (exists(relativePath)) {
      return { relativePath, source: read(relativePath) };
    }
  }

  throw new Error('Missing lazy page module: ' + importPath);
}

function moduleHasRequestedExport(source, exportName) {
  if (/\bexport\s+default\b/.test(source)) return true;

  assert.match(exportName, /^[A-Za-z_$][A-Za-z0-9_$]*$/);

  const namedDeclaration = new RegExp(
    '\\bexport\\s+(?:async\\s+)?(?:function|class|const|let|var)\\s+' + exportName + '\\b',
  );
  if (namedDeclaration.test(source)) return true;

  const exportBlock = new RegExp(
    '\\bexport\\s*\\{[\\s\\S]*\\b' + exportName + '\\b[\\s\\S]*\\}',
  );
  return exportBlock.test(source);
}

function parseLazyPages(appSource) {
  const calls = [];
  const callPattern = /const\s+([A-Za-z0-9_$]+)\s*=\s*lazyPage\(\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)\s*,\s*['"]([^'"]+)['"]\s*\)/g;
  let match;

  while ((match = callPattern.exec(appSource)) !== null) {
    calls.push({
      constName: match[1],
      importPath: match[2],
      exportName: match[3],
    });
  }

  return calls;
}

test('lazyPage route modules expose default or requested named export', () => {
  const app = read('src/App.tsx');
  const calls = parseLazyPages(app);

  assert.ok(calls.length >= 10, 'Expected lazyPage routes in App.tsx.');

  const missing = [];

  for (const call of calls) {
    const mod = findModule(call.importPath);
    if (!moduleHasRequestedExport(mod.source, call.exportName)) {
      missing.push(call.importPath + ' -> ' + call.exportName + ' (' + mod.relativePath + ')');
    }
  }

  assert.deepStrictEqual(missing, []);
});

test('TodayStable lazy route has a concrete export contract', () => {
  const app = read('src/App.tsx');
  assert.match(app, /lazyPage\(\s*\(\)\s*=>\s*import\(\s*['"]\.\/pages\/TodayStable['"]\s*\)\s*,\s*['"]TodayStable['"]\s*\)/);

  const todayStable = read('src/pages/TodayStable.tsx');
  assert.ok(moduleHasRequestedExport(todayStable, 'TodayStable'));
});

test('missing lazy page export is treated as stale deployment recovery', () => {
  const boundary = read('src/components/AppChunkErrorBoundary.tsx');
  assert.ok(boundary.includes('Missing lazy page export'));
  assert.ok(boundary.includes('APP_CHUNK_LOAD_STALE_DEPLOY_RELOAD'));
});
