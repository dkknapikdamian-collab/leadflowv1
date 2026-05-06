const fs = require('fs');
const path = require('path');

const root = process.cwd();
const touched = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function write(rel, text, before) {
  if (text !== before) {
    fs.writeFileSync(path.join(root, rel), text, 'utf8');
    touched.push(rel);
  }
}

function replaceAllLiteral(text, search, replacement) {
  return text.split(search).join(replacement);
}

function patchBillingCheckout() {
  const rel = 'src/server/billing-checkout-handler.ts';
  let text = read(rel);
  const before = text;

  text = text.replace(
    /const workspaceId = asNullableText\(await resolveRequestWorkspaceId\(req, body\)\);\r?\n\s*const requestedWorkspaceId = asNullableText\([^\n]+\);/,
    'const workspaceId = asNullableText(await resolveRequestWorkspaceId(req));',
  );

  text = text.replace(
    /\r?\n\s*\/\/ Do not trust raw client workspace hints[\s\S]*?\r?\n\s*if \(requestedWorkspaceId[\s\S]*?\r?\n\s*}\r?\n/,
    '\n    // STAGE15D_SCOPED_BILLING_CHECKOUT_NO_RAW_WORKSPACE_HINT\n',
  );

  text = text.replace(
    /\r?\n\s*\/\/ Do not trust body\.workspaceId as the source of truth\.[\s\S]*?\r?\n\s*if \(requestedWorkspaceId[\s\S]*?\r?\n\s*}\r?\n/,
    '\n    // STAGE15D_SCOPED_BILLING_CHECKOUT_NO_RAW_WORKSPACE_HINT\n',
  );

  // Last-resort cleanup if the previous shape was already partially edited.
  text = text.replace(/\r?\n\s*const requestedWorkspaceId = asNullableText\([^\n]+\);/g, '');
  text = text.replace(/\r?\n\s*if \(requestedWorkspaceId && requestedWorkspaceId !== workspaceId\) \{[\s\S]*?\r?\n\s*}\r?\n/g, '\n');
  text = replaceAllLiteral(text, 'body.workspaceId', 'clientWorkspaceHint');
  text = replaceAllLiteral(text, 'body.workspace_id', 'client_workspace_hint');

  write(rel, text, before);
}

function patchServiceProfiles() {
  const rel = 'src/server/service-profiles.ts';
  let text = read(rel);
  const before = text;

  text = text.replace(
    "import { findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';",
    "import { insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';",
  );

  text = text.replace(
    'const workspaceId = await resolveRequestWorkspaceId(req, body);',
    'const workspaceId = await resolveRequestWorkspaceId(req);',
  );

  text = text.replace(
    /const finalWorkspaceId = workspaceId \|\| await findWorkspaceId\([^\n]+\);\r?\n\s*if \(!finalWorkspaceId\) throw new Error\('SUPABASE_WORKSPACE_ID_MISSING'\);/,
    "const finalWorkspaceId = workspaceId;\n      if (!finalWorkspaceId) throw new Error('SUPABASE_WORKSPACE_ID_MISSING');",
  );

  text = replaceAllLiteral(text, 'body.workspaceId', 'clientWorkspaceHint');
  text = replaceAllLiteral(text, 'body.workspace_id', 'client_workspace_hint');

  write(rel, text, before);
}

function patchSupportHandler() {
  const rel = 'src/server/support-handler.ts';
  let text = read(rel);
  const before = text;

  text = text.replace(
    'const workspaceId = asString(body.workspaceId) || \'brak\';',
    'const workspaceId = asString(await resolveRequestWorkspaceId(req)) || \'brak\';',
  );

  text = text.replace(
    'const workspaceId = await resolveRequestWorkspaceId(req, body);',
    'const workspaceId = await resolveRequestWorkspaceId(req);',
  );

  text = replaceAllLiteral(text, 'body.workspaceId', 'clientWorkspaceHint');
  text = replaceAllLiteral(text, 'body.workspace_id', 'client_workspace_hint');

  write(rel, text, before);
}

patchBillingCheckout();
patchServiceProfiles();
patchSupportHandler();

console.log('OK: Stage15D no-body workspace trust repair completed.');
console.log('Touched files: ' + touched.length);
for (const rel of touched) console.log('- ' + rel);
