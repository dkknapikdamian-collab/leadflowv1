const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    console.error(`A26 guard failed: missing ${rel}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function requireIncludes(content, marker, file) {
  if (!content.includes(marker)) {
    console.error(`A26 guard failed: ${file} missing marker: ${marker}`);
    process.exit(1);
  }
}

const activities = read('api/activities.ts');
for (const marker of [
  "const A26_ACTIVITY_DELETE_NOTE_LOCK = 'activities endpoint supports PATCH and DELETE for voice note cleanup';",
  "if (req.method === 'PATCH')",
  "if (req.method === 'DELETE')",
  "await requireScopedRow('activities', id, workspaceId, 'ACTIVITY_NOT_FOUND');",
  "await deleteById('activities', id);",
  "if (leadId) filters.push(`lead_id=eq.${encodeURIComponent(leadId)}`);",
]) {
  requireIncludes(activities, marker, 'api/activities.ts');
}

const aiDrafts = read('src/server/ai-drafts.ts');
for (const marker of [
  "const A26_AI_DRAFTS_SUPABASE_CONTRACT_LOCK = 'ai_drafts stores temporary raw_text and clears it after confirmed cancelled expired';",
  "'confirmed'",
  "'cancelled'",
  "'expired'",
  'linked_record_id',
  'linked_record_type',
  'payload.raw_text = null;',
  "payload.status = finalStatus;",
  "action === 'confirm' || action === 'convert'",
]) {
  requireIncludes(aiDrafts, marker, 'src/server/ai-drafts.ts');
}

const migration = read('supabase/migrations/20260501_a26_ai_drafts_supabase.sql');
for (const marker of [
  'create table if not exists public.ai_drafts',
  'raw_text text null',
  'linked_record_id uuid null',
  'linked_record_type text null',
  "where status in ('confirmed', 'cancelled', 'expired', 'archived')",
  'create or replace function public.expire_ai_drafts()',
]) {
  requireIncludes(migration, marker, 'supabase/migrations/20260501_a26_ai_drafts_supabase.sql');
}

console.log('OK: A26 activity delete and AI drafts Supabase guard passed.');
