const test = require('node:test');
const assert = require('node:assert/strict');

(async () => {
  const plans = await import('../src/lib/plans.ts');

  test('trial is 21 days and free limits are aligned with policy', () => {
    assert.equal(plans.TRIAL_DAYS, 21);
    const free = plans.getPlanDefinition('free');
    assert.equal(free.limits.activeLeads, 5);
    assert.equal(free.limits.activeTasksAndEvents, 5);
    assert.equal(free.limits.activeDrafts, 3);
    assert.equal(free.features.fullAi, false);
    assert.equal(free.features.googleCalendar, false);
    assert.equal(free.features.digest, false);
  });

  test('ai plan contains explicit ai limits', () => {
    const ai = plans.getPlanDefinition('ai');
    assert.equal(ai.limits.aiDaily, 30);
    assert.equal(ai.limits.aiMonthly, 300);
    assert.equal(ai.features.fullAi, true);
  });
})();
