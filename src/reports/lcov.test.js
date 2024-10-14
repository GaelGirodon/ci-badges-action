import assert from 'assert/strict';
import { join } from 'path';
import { getReports } from './lcov.js';

describe('reports/lcov', () => {
  describe('#getReports()', () => {
    it('should return a coverage report', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/lcov'));
      assert.equal(reports.length, 1);
      assert.deepEqual(reports, [
        { type: 'coverage', data: { coverage: 47 } }
      ]);
    });
  });
});
