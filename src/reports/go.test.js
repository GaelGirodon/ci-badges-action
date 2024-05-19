import assert from 'assert/strict';
import { join } from 'path';
import { getReports } from './go.js';

describe('reports/go', () => {
  describe('#getReports()', () => {
    it('should return tests and coverage reports', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/go'));
      assert.equal(reports.length, 2);
      assert.deepEqual(reports, [
        { type: 'tests', data: { passed: 3, failed: 0, tests: 3 } },
        { type: 'coverage', data: { coverage: 96.5 } }
      ]);
    });
  });
});
