const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const handler = read('src/server/activities-handler.ts');

test('FRT-015 operator activity reads use verified Supabase request context', () => {
  assert.match(handler, /RequestAuthError[\s\S]*requireSupabaseRequestContext[\s\S]*writeAuthErrorResponse/);
  assert.match(handler, /async function requireOperatorActorId\(req: any\)[\s\S]*requireSupabaseRequestContext\(req\)/);
  assert.match(handler, /const operatorActorId = await requireOperatorActorId\(req\);[\s\S]*filterOperatorActivityRows\(rows, operatorActorId\)/);
});

test('FRT-015 operator inserts ignore client actorId and preserve the portal actor path', () => {
  const postStart = handler.indexOf("if (req.method === 'POST')");
  const patchStart = handler.indexOf("if (req.method === 'PATCH')");
  assert.ok(postStart >= 0 && patchStart > postStart, 'POST branch must remain bounded before PATCH');
  const postBranch = handler.slice(postStart, patchStart);

  assert.match(postBranch, /operatorActorId = await requireOperatorActorId\(req\)/);
  assert.match(postBranch, /actor_id:\s*portalMode\s*\?\s*\(asText\(body\.actorId\)\s*\|\|\s*null\)\s*:\s*operatorActorId/);
  assert.doesNotMatch(postBranch, /actor_id:\s*asText\(body\.actorId\)/);
});

test('FRT-015 private activity rows are fail-closed without a matching verified actor', () => {
  const filterStart = handler.indexOf('function filterOperatorActivityRows');
  const authStart = handler.indexOf('async function requireOperatorActorId');
  assert.ok(filterStart >= 0 && authStart > filterStart, 'private-row filter helper must remain bounded');
  const filter = handler.slice(filterStart, authStart);

  assert.match(filter, /if \(!isPrivateActivity\(row\)\) return true;/);
  assert.match(filter, /const rowActorId = asText\(row\?\.actor_id\)\.toLowerCase\(\);/);
  assert.match(filter, /Boolean\(normalizedActorId && rowActorId && rowActorId === normalizedActorId\)/);
  assert.match(handler, /function isPrivateActivity\(row: any\)[\s\S]*getActivityPayload\(row\)\.visibility/);
});

test('FRT-015 actor storage remains compatible with the canonical activities schema', () => {
  const schema = read('supabase/migrations/20260501194000_p0_supabase_rls_schema_confirmation.sql');
  assert.match(schema, /actor_id uuid/);
  assert.match(handler, /if \(!isUuid\(actorId\)\) throw new RequestAuthError\(500, 'AUTH_ACTOR_ID_INCOMPATIBLE'\)/);
});
