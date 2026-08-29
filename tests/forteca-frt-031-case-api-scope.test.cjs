'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const repositoryRoot = path.resolve(__dirname, '..');
const readSource = (relativePath) => fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');
const casesSource = readSource('api/cases.ts');
const caseItemsSource = readSource('api/case-items.ts');

function sourceSlice(source, start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `expected source marker: ${start}`);
  const endIndex = end ? source.indexOf(end, startIndex + start.length) : -1;
  return source.slice(startIndex, endIndex === -1 ? undefined : endIndex);
}

test('FRT-031 cases API validates and persists a workspace-scoped owner', () => {
  const ownerScope = sourceSlice(casesSource, 'function parseCaseOwnerInput', 'function normalizeCase');
  assert.match(ownerScope, /\bownerId\b/, 'owner input must accept ownerId');
  assert.match(ownerScope, /\bowner_id\b/, 'owner input must accept owner_id');
  assert.match(ownerScope, /\bisUuid\s*\(/, 'owner input must be validated as a UUID');

  assert.match(ownerScope, /workspace_members/, 'owner lookup must use workspace membership');
  assert.match(ownerScope, /workspace_id/, 'owner lookup must constrain the workspace');
  assert.match(ownerScope, /withWorkspaceFilter|workspaceId/, 'owner lookup must carry the resolved workspace scope');
  assert.match(ownerScope, /CASE_OWNER_SCOPE_UNAVAILABLE/, 'unavailable owner scope must fail closed');
  assert.match(ownerScope, /\b503\b/, 'unavailable owner scope must produce an unavailable-service outcome');

  const handlerBody = sourceSlice(casesSource, "const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};", 'res.status(405)');
  const postHandler = sourceSlice(handlerBody, "if (req.method === 'POST')", "if (req.method === 'PATCH')");
  const patchHandler = sourceSlice(handlerBody, "if (req.method === 'PATCH')", "if (req.method === 'DELETE')");
  assert.match(postHandler, /owner_id\s*[:=]/, 'POST must write owner_id');
  assert.match(patchHandler, /owner_id\s*[:=]/, 'PATCH must write owner_id when supplied');
});

test('FRT-031 case-items API stores and normalizes only safe object payloads', () => {
  const normalizer = sourceSlice(caseItemsSource, 'function normalizeCaseItem', 'export default async function handler');
  assert.match(normalizer, /payload\s*:/, 'normalized case items must expose payload');
  assert.match(normalizer, /typeof\s+[^\n;]*payload[^\n;]*===\s*['"]object['"]/, 'normalized payload must be object-only');
  assert.match(normalizer, /Array\.isArray\s*\(/, 'normalized payload must reject arrays');
  assert.match(normalizer, /\{\}/, 'normalized payload must fall back to an empty object');

  const postHandler = sourceSlice(caseItemsSource, "if (req.method === 'POST')", 'res.status(405)');
  const basePayload = sourceSlice(postHandler, 'const basePayload = {', 'const payloadWithItemOrder');
  assert.match(basePayload, /payload\s*:/, 'case-item POST must include payload in the stored row');
  assert.match(basePayload, /typeof\s+[^\n;]*payload[^\n;]*===\s*['"]object['"]/, 'stored payload must be object-only');
  assert.match(basePayload, /Array\.isArray\s*\(/, 'stored payload must reject arrays');
  assert.match(basePayload, /\{\}/, 'stored payload must fall back to an empty object');
});
