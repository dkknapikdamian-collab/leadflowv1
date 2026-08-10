const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pwa/chunk-asset-reload-guard.ts';
const baseSha = '54bdfd7d';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

function readFromGit(spec) {
  return execFileSync('git', ['show', spec], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
}

const current = read(sourcePath);
const base = readFromGit(`${baseSha}:${sourcePath}`);
assert(base.includes('(event as CustomEvent).payload'), 'fail-first base must show the invalid CustomEvent cast');
assert(base.includes('(target as HTMLScriptElement | HTMLLinkElement).src'), 'fail-first base must show the invalid union src access');
assert(current.includes('event.payload || event'), 'PWA guard must use VitePreloadErrorEvent.payload directly');
assert(!current.includes('CustomEvent'), 'PWA chunk event path must not cast Vite event to CustomEvent');
assert(current.includes('target instanceof HTMLScriptElement'), 'asset target must narrow HTMLScriptElement explicitly');
assert(current.includes('target instanceof HTMLLinkElement'), 'asset target must narrow HTMLLinkElement explicitly');
assert(current.includes('window.sessionStorage'), 'one-shot reload session guard must remain');
assert(current.includes('shouldDeferReloadForOpenCloseFlowModal'), 'tab/dialog state protection must remain');

const diff = execFileSync('git', ['diff', '--unified=0', baseSha, '--', sourcePath], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
assert(!diff.split('\n').some((line) => line.startsWith('+') && /\bany\b|@ts-ignore|@ts-expect-error/.test(line)), 'A2-21 must not add any or TypeScript bypasses');

console.log('PASS: A2-21 uses Vite payload typing and explicit script/link narrowing in the PWA chunk guard.');
