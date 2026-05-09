const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(cond,msg){ if(!cond){ console.error('CLOSEFLOW_TYPESCRIPT_STABILIZATION_V7_FAIL: '+msg); process.exit(1); } }
const entityActions = read('src/components/entity-actions.tsx');
assert(entityActions.includes("Omit<ButtonProps, 'tone'>"), 'EntityActionButtonProps must omit ButtonProps tone');
const stat = read('src/components/StatShortcutCard.tsx');
assert(stat.includes('dataTab?: string'), 'StatShortcutCard must accept dataTab');
assert(stat.includes('tone?: MetricTone | string'), 'StatShortcutCard must accept dynamic tone strings');
assert(stat.includes('Object.prototype.hasOwnProperty.call(METRIC_TONE_ALIAS, explicitTone)'), 'StatShortcutCard must guard dynamic tone alias lookup');
const semantic = read('src/ui-system/icons/SemanticIcon.tsx');
assert(semantic.includes('className?: string;'), 'SemanticIconProps must expose className');
const fallback = read('src/lib/supabase-fallback.ts');
assert(fallback.includes('export async function updateActivityInSupabase'), 'supabase fallback missing updateActivityInSupabase export');
assert(fallback.includes('export async function deleteActivityFromSupabase'), 'supabase fallback missing deleteActivityFromSupabase export');
const client = read('src/pages/ClientDetail.tsx');
assert(client.includes('updateActivityInSupabase,'), 'ClientDetail missing updateActivityInSupabase import');
assert(client.includes('deleteActivityFromSupabase,'), 'ClientDetail missing deleteActivityFromSupabase import');
console.log('CLOSEFLOW_TYPESCRIPT_STABILIZATION_V7_CHECK_OK');
