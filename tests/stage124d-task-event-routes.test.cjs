const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage124D lightweight task/event API routes are preserved under Stage124F consolidation', () => {
  assert.ok(!fs.existsSync('api/tasks.ts'), 'api/tasks.ts should not exist as a standalone Vercel function');
  assert.ok(!fs.existsSync('api/events.ts'), 'api/events.ts should not exist as a standalone Vercel function');

  const files = ['src/server/task-route-stage124f.ts', 'src/server/event-route-stage124f.ts'];
  for (const file of files) {
    assert.ok(fs.existsSync(file), file + ' should exist');
    const text = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /select\\s*=\\s*\\*/i, file + ' should not use select=*');
    assert.doesNotMatch(text, /work_items\\?select=\\*/i, file + ' should not query work_items with select=*');
    assert.match(text, /LIST_SELECT_STAGE124D/, file + ' should define explicit ListDTO select columns');
    assert.match(text, /resolveRequestWorkspaceId\(req/, file + ' should resolve workspace from request context');
    assert.match(text, /withWorkspaceFilter\(/, file + ' should apply workspace filter');
    assert.match(text, /updateByIdScoped\(/, file + ' should scope updates');
    assert.match(text, /deleteByIdScoped\(/, file + ' should scope deletes');
    assert.match(text, /capLimit\(/, file + ' should cap response size');
    assert.match(text, /addDateRange\(/, file + ' should support range reads for calendar/tasks');
  }
});
