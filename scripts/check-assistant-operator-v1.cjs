#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
function read(file) {
  return fs.existsSync(path.join(ROOT, file)) ? fs.readFileSync(path.join(ROOT, file), 'utf8') : '';
}
function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}
const errors = [];
const requiredFiles = [
  'api/system.ts',
  'src/server/ai-assistant.ts',
  'src/server/assistant-context.ts',
  'src/server/assistant-query-handler.ts',
  'src/server/ai-drafts.ts',
  'src/pages/AiDrafts.tsx'
];
for (const file of requiredFiles) {
  if (!exists(file)) errors.push(`missing ${file}`);
}
const system = read('api/system.ts');
for (const marker of ['aiAssistantHandler', 'assistantContextHandler', 'assistantQueryHandler', 'aiDraftsHandler']) {
  if (!system.includes(marker)) errors.push(`api/system.ts missing ${marker}`);
}
const aiDrafts = read('src/server/ai-drafts.ts');
if (aiDrafts && !/resolveRequestWorkspaceId|requireRequestIdentity/.test(aiDrafts)) errors.push('ai-drafts backend must resolve auth/workspace context');
const page = read('src/pages/AiDrafts.tsx');
if (page && !/draft|szkic/i.test(page)) errors.push('AiDrafts page must expose draft workflow copy');
if (page && !/confirm|potwierd/i.test(page)) errors.push('AiDrafts page must expose confirmation workflow copy');
if (errors.length) {
  console.error('Assistant operator V1 guard failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('OK: assistant operator V1 guard passed.');
