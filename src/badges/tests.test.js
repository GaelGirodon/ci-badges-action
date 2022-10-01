import assert from 'assert';
import { buildBadge } from './tests.js';

describe('badges/tests', function () {
  describe('#buildBadge()', function () {
    const tests = [
      { data: { passed: 5, failed: 0 }, expected: { message: '5 passed', color: 'brightgreen' } },
      { data: { passed: 4, failed: 1 }, expected: { message: '4 passed, 1 failed', color: 'red' } }
    ];
    for (const { data, expected } of tests) {
      it(`should return a ${expected.color} "${expected.message}" badge for ${data.passed}/${data.failed} tests`, function () {
        const actual = buildBadge(data);
        assert.deepStrictEqual(actual, expected);
      });
    }
  });
});
