import assert from 'assert/strict';
import { buildBadge } from './mutation.js';

describe('badges/mutation', () => {
  describe('#buildBadge()', () => {
    const tests = [
      { data: { mutation: 0 }, expected: { message: '0%', color: 'red' } },
      { data: { mutation: 45.2 }, expected: { message: '45%', color: 'orange' } },
      { data: { mutation: 75.8 }, expected: { message: '75%', color: 'yellow' } },
      { data: { mutation: 85.0 }, expected: { message: '85%', color: 'yellowgreen' } },
      { data: { mutation: 93.6 }, expected: { message: '93%', color: 'green' } },
      { data: { mutation: 98.7 }, expected: { message: '98%', color: 'brightgreen' } },
      { data: { mutation: 100 }, expected: { message: '100%', color: 'brightgreen' } }
    ];
    for (const { data, expected } of tests) {
      it(`should return a ${expected.color} "${expected.message}" badge for ${data.mutation}% mutation`, () => {
        const actual = buildBadge(data);
        assert.deepEqual(actual, expected);
      });
    }
  });
});
