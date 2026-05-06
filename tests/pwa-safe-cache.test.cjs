const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePwaSafeCache } = require('../scripts/check-pwa-safe-cache.cjs');

test('PWA safe cache contract blocks business data and keeps install/mobile markers', () => {
  const failures = validatePwaSafeCache(process.cwd());
  assert.deepEqual(failures, []);
});
