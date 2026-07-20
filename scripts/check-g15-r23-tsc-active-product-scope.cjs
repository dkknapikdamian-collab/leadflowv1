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

for (const required of ['src/**/*', 'api/**/*', 'vite.config.ts']) {
  if (!includes.includes(required)) fail(`missing active include: ${required}`);
}

for (const forbiddenBroadInclude of ['**/*', './**/*', '*']) {
  if (includes.includes(forbiddenBroadInclude)) fail(`broad repository include is forbidden: ${forbiddenBroadInclude}`);
}

for (const required of ['node_modules', 'dist', '_project', '_local_backups', 'backups', 'bisect', 'scripts', 'tools']) {
  if (!excludes.includes(required)) fail(`missing historical/non-product exclude: ${required}`);
}

if (raw.compilerOptions?.allowJs !== true) fail('allowJs must stay enabled for active JS imported by product sources');
if (raw.compilerOptions?.noEmit !== true) fail('main typecheck must remain noEmit');

const parsed = ts.parseJsonConfigFileContent(raw, ts.sys, root, undefined, configPath);
if (parsed.errors.length) {
  fail(parsed.errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, '\n')).join('\n'));
}

const normalizedFiles = parsed.fileNames.map((file) => path.relative(root, file).replaceAll('\\', '/'));

for (const requiredFile of ['src/App.tsx', 'api/me.ts', 'vite.config.ts']) {
  if (!normalizedFiles.includes(requiredFile)) fail(`active source missing from TypeScript program: ${requiredFile}`);
}

for (const file of normalizedFiles) {
  if (/^(scripts|tools|_project|_local_backups|backups|bisect)\//.test(file)) {
    fail(`historical/non-product file leaked into TypeScript program: ${file}`);
  }
}

const activeSourceCount = normalizedFiles.filter((file) => /^(src|api)\//.test(file)).length;
if (activeSourceCount < 10) fail(`unexpectedly small active TypeScript program: ${activeSourceCount} source files`);

console.log(`PASS: main TypeScript program contains ${normalizedFiles.length} files and excludes historical patcher scopes.`);
