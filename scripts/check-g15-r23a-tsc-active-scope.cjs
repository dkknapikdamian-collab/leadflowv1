#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = process.cwd();
const configPath = path.join(root, 'tsconfig.json');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(configPath)) fail('tsconfig.json not found');

const readResult = ts.readConfigFile(configPath, ts.sys.readFile);
if (readResult.error) {
  fail(ts.flattenDiagnosticMessageText(readResult.error.messageText, '\n'));
}

const raw = readResult.config;
const includes = Array.isArray(raw.include) ? raw.include : [];
const excludes = Array.isArray(raw.exclude) ? raw.exclude : [];

const requiredIncludes = ['src/**/*', 'api/**/*', 'vite.config.ts'];
const requiredExcludes = ['node_modules', 'dist', '_project', '_local_backups', 'backups', 'bisect', 'scripts', 'tools'];

if (JSON.stringify(includes) !== JSON.stringify(requiredIncludes)) {
  fail(`unexpected include contract: ${JSON.stringify(includes)}`);
}

for (const required of requiredExcludes) {
  if (!excludes.includes(required)) fail(`missing non-product exclude: ${required}`);
}

for (const forbiddenBroadInclude of ['**/*', './**/*', '*']) {
  if (includes.includes(forbiddenBroadInclude)) fail(`broad repository include is forbidden: ${forbiddenBroadInclude}`);
}

if (raw.compilerOptions?.allowJs !== true) fail('allowJs must remain enabled for active imported JavaScript');
if (raw.compilerOptions?.noEmit !== true) fail('main typecheck must remain noEmit');

const parsed = ts.parseJsonConfigFileContent(raw, ts.sys, root, undefined, configPath);
if (parsed.errors.length) {
  fail(parsed.errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, '\n')).join('\n'));
}

const files = parsed.fileNames.map((file) => path.relative(root, file).replaceAll('\\', '/'));
for (const requiredFile of ['src/App.tsx', 'api/me.ts', 'vite.config.ts']) {
  if (!files.includes(requiredFile)) fail(`active source missing from TypeScript program: ${requiredFile}`);
}

for (const file of files) {
  if (/^(scripts|tools|_project|_local_backups|backups|bisect)\//.test(file)) {
    fail(`non-product file leaked into TypeScript program: ${file}`);
  }
}

const activeSourceCount = files.filter((file) => /^(src|api)\//.test(file)).length;
if (activeSourceCount < 10) fail(`unexpectedly small active TypeScript program: ${activeSourceCount}`);

console.log(`PASS: active TypeScript scope contains ${files.length} files and excludes historical patcher roots.`);
