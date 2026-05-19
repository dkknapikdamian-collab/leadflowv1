const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage124D restores lightweight task/event API routes', () => {
  const files = ['api/tasks.ts', 'api/events.ts'];
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

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(
    packageJson.scripts['check:stage124d-task-event-routes'],
    'node scripts/check-stage124d-task-event-routes.cjs',
    'package.json should expose the Stage124D guard',
  );
});
