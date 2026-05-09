#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const apiDir = path.join(repo, 'api');
const limit = 12;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const functions = walk(apiDir)
  .filter((file) => /\.(ts|tsx|js|mjs|cjs)$/.test(file))
  .filter((file) => !file.endsWith('.d.ts'))
  .map((file) => path.relative(repo, file).replace(/\\/g, '/'))
  .sort();

if (functions.length > limit) {
  console.error('CLOSEFLOW_VERCEL_HOBBY_FUNCTION_LIMIT_FAIL');
  console.error('functionCount=' + functions.length + ' limit=' + limit);
  for (const item of functions) console.error('- ' + item);
  process.exit(1);
}

console.log('CLOSEFLOW_VERCEL_HOBBY_FUNCTION_LIMIT_OK');
console.log('functionCount=' + functions.length + ' limit=' + limit);
for (const item of functions) console.log('- ' + item);
