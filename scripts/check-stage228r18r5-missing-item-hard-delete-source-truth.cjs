const fs = require("fs");

const STAGE = "STAGE228R18R5_MISSING_ITEM_HARD_DELETE_MASS_PREFLIGHT_COMPAT_R34";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function assert(ok, message) {
  if (!ok) {
    console.error(`${STAGE}_FAIL: ${message}`);
    process.exit(1);
  }
}

const supabase = read("src/lib/supabase-fallback.ts");
const taskRoute = read("src/server/task-route-stage124f.ts");

assert(supabase.includes("export async function hardDeleteTaskFromSupabase"), "hardDeleteTaskFromSupabase export must exist");
assert(supabase.includes("apiRoute=tasks&id="), "hard delete helper must target apiRoute tasks id route");
assert(supabase.includes("method: 'DELETE'") || supabase.includes('method: "DELETE"'), "hard delete helper must pass RequestInit method DELETE");
assert(!supabase.includes("callApi('/api/system?apiRoute=tasks&id=' + encodeURIComponent(taskId), 'DELETE')"), "raw string DELETE callApi regression must not exist");
assert(taskRoute.includes("status: 'deleted'") || taskRoute.includes('status: "deleted"'), "task route must soft-delete to deleted status");
assert(taskRoute.includes("show_in_tasks: false"), "task route must hide deleted tasks from tasks");
assert(taskRoute.includes("show_in_calendar: false"), "task route must hide deleted tasks from calendar");
assert(taskRoute.includes("verified") || taskRoute.includes("hidden"), "task route must keep verified/hidden delete response contract");

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  repair: "R34 compatible R18 guard: hard-delete helper API shape plus stable soft-delete/hide route contract"
}, null, 2));