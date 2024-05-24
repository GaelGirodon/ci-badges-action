import assert from 'assert/strict';
import { join } from 'path';
import { getReports } from './jacoco.js';

describe('reports/jacoco', () => {
  describe('#getReports()', () => {
    it('should return a coverage report', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/jacoco'));
      assert.equal(reports.length, 1);
      assert.deepEqual(reports, [
        { type: 'coverage', data: { coverage: 65.61056105610561 } }
      ]);
    });
  });
});
