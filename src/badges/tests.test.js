import assert from 'node:assert/strict';
import { buildBadge } from './tests.js';

describe('badges/tests', () => {
  describe('#buildBadge()', () => {
    const tests = [
      { data: { passed: 0, failed: 0, skipped: 0 }, expected: { message: '0 passed', color: 'lightgrey' } },
      { data: { passed: 0, failed: 0, skipped: 1 }, expected: { message: '0 passed, 1 skipped', color: 'lightgrey' } },
      { data: { passed: 5, failed: 0, skipped: 0 }, expected: { message: '5 passed', color: 'brightgreen' } },
      { data: { passed: 4, failed: 0, skipped: 1 }, expected: { message: '4 passed, 1 skipped', color: 'brightgreen' } },
      { data: { passed: 4, failed: 1, skipped: 0 }, expected: { message: '4 passed, 1 failed', color: 'red' } },
      { data: { passed: 3, failed: 1, skipped: 1 }, expected: { message: '3 passed, 1 failed, 1 skipped', color: 'red' } }
    ];
    for (const { data, expected } of tests) {
      it(`should return a ${expected.color} "${expected.message}" badge for ${data.passed}/${data.failed}/${data.skipped} tests`, () => {
        const actual = buildBadge(data);
        assert.deepEqual(actual, expected);
      });
    }
  });
});
