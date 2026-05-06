#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const rel = 'src/server/_request-scope.ts';
const file = path.join(root, rel);
if (!fs.existsSync(file)) {
  console.error(rel + ' missing');
  process.exit(1);
}

function read() { return fs.readFileSync(file, 'utf8'); }
function write(text) { fs.writeFileSync(file, text, 'utf8'); }

function replaceBetween(text, startNeedle, endNeedle, replacement) {
  const start = text.indexOf(startNeedle);
  if (start < 0) throw new Error('START_NOT_FOUND: ' + startNeedle);
  const end = text.indexOf(endNeedle, start);
  if (end < 0) throw new Error('END_NOT_FOUND: ' + endNeedle);
  return text.slice(0, start) + replacement + '\n' + text.slice(end);
}

function removeBroadOwnerFallback(text) {
  let next = text;
  next = next.replace(/\n\s*\/\/ Runtime compatibility guard:[\s\S]*?if \(identity\.userId \|\| identity\.email\) return true;\s*/m, '\n  // STAGE15_NO_AUTH_ONLY_WORKSPACE_FALLBACK: authenticated identity alone is not workspace authorization.\n');
  next = next.replace(/\n\s*if \(identity\.userId \|\| identity\.email\) return true;\s*/m, '\n  // STAGE15_NO_AUTH_ONLY_WORKSPACE_FALLBACK: authenticated identity alone is not workspace authorization.\n');
  return next;
}

const resolveFn = [
  'export async function resolveRequestWorkspaceId(req: any, bodyInput?: any) {',
  '  void bodyInput;',
  '  // STAGE15_NO_BODY_WORKSPACE_TRUST',
  '  // Request body/query workspace values are ignored. Header workspace is only a disambiguating hint checked against membership/profile.',
  '  const hintedWorkspaceId = asText(',
  "    requestHeader(req, 'x-workspace-id')",
  "    || requestHeader(req, 'x-closeflow-workspace-id'),",
  '  );',
  '',
  '  const context = await requireSupabaseRequestContext(req);',
  '  const contextWorkspaceId = asText(context.workspaceId);',
  '  if (contextWorkspaceId) return contextWorkspaceId;',
  '',
  '  const contextUserId = asText(context.userId);',
  '  const contextEmail = asText(context.email).toLowerCase();',
  '  if (!contextUserId && !contextEmail) {',
  "    throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');",
  '  }',
  '',
  '  if (hintedWorkspaceId) {',
  '    if (contextUserId) {',
  '      const membershipRows = await selectRows(',
  "        'workspace_members?user_id=eq.' + encodeURIComponent(contextUserId)",
  "          + '&workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)",
  "          + '&select=workspace_id&limit=1',",
  '      );',
  '      if (membershipRows[0]) return hintedWorkspaceId;',
  '    }',
  '',
  '    const profileQueries = [',
  '      contextEmail',
  "        ? 'profiles?workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)",
  "          + '&email=eq.' + encodeURIComponent(contextEmail)",
  "          + '&select=workspace_id&limit=1'",
  "        : '',",
  '      contextUserId',
  "        ? 'profiles?workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)",
  "          + '&auth_uid=eq.' + encodeURIComponent(contextUserId)",
  "          + '&select=workspace_id&limit=1'",
  "        : '',",
  '      contextUserId',
  "        ? 'profiles?workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)",
  "          + '&firebase_uid=eq.' + encodeURIComponent(contextUserId)",
  "          + '&select=workspace_id&limit=1'",
  "        : '',",
  '      isLikelyUuid(contextUserId)',
  "        ? 'profiles?workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)",
  "          + '&id=eq.' + encodeURIComponent(contextUserId)",
  "          + '&select=workspace_id&limit=1'",
  "        : '',",
  '    ].filter(Boolean);',
  '',
  '    for (const profileQuery of profileQueries) {',
  '      const profileRows = await selectRows(profileQuery);',
  '      if (profileRows[0]) return hintedWorkspaceId;',
  '    }',
  '',
  "    throw new RequestAuthError(403, 'WORKSPACE_MEMBERSHIP_REQUIRED');",
  '  }',
  '',
  '  if (contextUserId) {',
  '    const membershipRows = await selectRows(',
  "      'workspace_members?user_id=eq.' + encodeURIComponent(contextUserId)",
  "        + '&select=workspace_id&limit=1',",
  '    );',
  '    const membershipWorkspaceId = asText(membershipRows[0]?.workspace_id);',
  '    if (membershipWorkspaceId) return membershipWorkspaceId;',
  '  }',
  '',
  '  const profileQueries = [',
  "    contextEmail ? 'profiles?email=eq.' + encodeURIComponent(contextEmail) + '&select=workspace_id&limit=1' : '',",
  "    contextUserId ? 'profiles?auth_uid=eq.' + encodeURIComponent(contextUserId) + '&select=workspace_id&limit=1' : '',",
  "    contextUserId ? 'profiles?firebase_uid=eq.' + encodeURIComponent(contextUserId) + '&select=workspace_id&limit=1' : '',",
  "    isLikelyUuid(contextUserId) ? 'profiles?id=eq.' + encodeURIComponent(contextUserId) + '&select=workspace_id&limit=1' : '',",
  '  ].filter(Boolean);',
  '',
  '  for (const profileQuery of profileQueries) {',
  '    const profileRows = await selectRows(profileQuery);',
  '    const profileWorkspaceId = asText(profileRows[0]?.workspace_id);',
  '    if (profileWorkspaceId) return profileWorkspaceId;',
  '  }',
  '',
  "  throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');",
  '}',
].join('\n');

let before = read();
let after = removeBroadOwnerFallback(before);
after = replaceBetween(after, 'export async function resolveRequestWorkspaceId', 'export function withWorkspaceFilter', resolveFn);

// Last-resort cleanup: remove stale references that only existed in the old resolver body.
after = after.replace(/const query = req\?\.query \|\| \{\};\s*/g, '');
after = after.replace(/const body = bodyInput && typeof bodyInput === 'object' \? bodyInput : parseBody\(req\);\s*/g, '');

write(after);

const text = read();
const failures = [];
for (const forbidden of ['body.workspaceId', 'body.workspace_id', 'query.workspaceId', 'query.workspace_id', 'firstQueryValue(query.workspaceId)', 'firstQueryValue(query.workspace_id)', 'if (identity.userId || identity.email) return true']) {
  if (text.includes(forbidden)) failures.push(forbidden);
}
for (const required of ['STAGE15_NO_BODY_WORKSPACE_TRUST', 'WORKSPACE_MEMBERSHIP_REQUIRED', 'workspace_members?user_id=eq.', 'profiles?workspace_id=eq.']) {
  if (!text.includes(required)) failures.push('missing ' + required);
}
if (failures.length) {
  console.error('Stage15C request scope repair failed:');
  failures.forEach((item) => console.error('- ' + item));
  process.exit(1);
}

console.log('OK: Stage15C request scope hard lock applied.');
