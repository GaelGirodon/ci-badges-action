import assert from 'assert/strict';
import { buildBadge } from './coverage.js';

describe('badges/coverage', () => {
  describe('#buildBadge()', () => {
    const tests = [
      { data: { coverage: 0 }, expected: { message: '0%', color: 'red' } },
      { data: { coverage: 45.2 }, expected: { message: '45%', color: 'orange' } },
      { data: { coverage: 75.8 }, expected: { message: '75%', color: 'yellow' } },
      { data: { coverage: 85.0 }, expected: { message: '85%', color: 'yellowgreen' } },
      { data: { coverage: 93.6 }, expected: { message: '93%', color: 'green' } },
      { data: { coverage: 98.7 }, expected: { message: '98%', color: 'brightgreen' } },
      { data: { coverage: 100 }, expected: { message: '100%', color: 'brightgreen' } }
    ];
    for (const { data, expected } of tests) {
      it(`should return a ${expected.color} "${expected.message}" badge for ${data.coverage}% coverage`, () => {
        const actual = buildBadge(data);
        assert.deepEqual(actual, expected);
      });
    }
  });
});
