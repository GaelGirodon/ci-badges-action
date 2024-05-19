import assert from 'assert/strict';
import { buildBadge } from './tests.js';

describe('badges/tests', () => {
  describe('#buildBadge()', () => {
    const tests = [
      { data: { passed: 5, failed: 0 }, expected: { message: '5 passed', color: 'brightgreen' } },
      { data: { passed: 4, failed: 1 }, expected: { message: '4 passed, 1 failed', color: 'red' } }
    ];
    for (const { data, expected } of tests) {
      it(`should return a ${expected.color} "${expected.message}" badge for ${data.passed}/${data.failed} tests`, () => {
        const actual = buildBadge(data);
        assert.deepEqual(actual, expected);
      });
    }
  });
});
