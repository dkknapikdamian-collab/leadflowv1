#!/usr/bin/env node
const fs = require('fs');

function assert(condition, message) {
  if (!condition) {
    console.error('CLOSEFLOW_ENTITY_CONFLICTS_SYSTEM_ROUTE_V1_FAIL: ' + message);
    process.exit(1);
  }
}

const system = fs.readFileSync('api/system.ts', 'utf8');
const supabase = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');

assert(!fs.existsSync('api/entity-conflicts.ts'), 'api/entity-conflicts.ts still exists and would create an extra Vercel function');
assert(fs.existsSync('src/server/entity-conflicts-handler.ts'), 'missing src/server/entity-conflicts-handler.ts');
assert(system.includes('entity-conflicts-handler'), 'api/system.ts does not import entity conflicts handler');
assert(system.includes('CLOSEFLOW_ENTITY_CONFLICTS_SYSTEM_KIND_ROUTE_V1'), 'api/system.ts missing system kind route marker');
assert(supabase.includes('/api/system?kind=entity-conflicts'), 'client still does not call /api/system?kind=entity-conflicts');
assert(!supabase.includes('/api/entity-conflicts'), 'client still references standalone /api/entity-conflicts');

console.log('CLOSEFLOW_ENTITY_CONFLICTS_SYSTEM_ROUTE_V1_CHECK_OK');
