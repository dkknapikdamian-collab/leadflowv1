const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full.replace(/\\/g, '/'));
  }
  return out;
}
test('Stage124F consolidates task/event API functions behind api/system', () => {
  const apiFiles = walk('api').filter((file) => /\\.(ts|js|mjs|cjs)$/.test(file)).filter((file) => !file.endsWith('.d.ts'));
  assert.ok(apiFiles.length <= 12, 'api function file count should stay within Hobby limit');
  assert.ok(!apiFiles.includes('api/tasks.ts'), 'tasks should not be a standalone function');
  assert.ok(!apiFiles.includes('api/events.ts'), 'events should not be a standalone function');
  const system = fs.readFileSync('api/system.ts', 'utf8');
  assert.match(system, /STAGE124F_VERCEL_HOBBY_TASK_EVENT_CONSOLIDATION/);
  assert.match(system, /apiRoute === 'tasks'/);
  assert.match(system, /apiRoute === 'events'/);
  const fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');
  assert.match(fallback, /\/api\/system\?apiRoute=tasks/);
  assert.match(fallback, /\/api\/system\?apiRoute=events/);
});
