import assert from 'node:assert/strict';
import { join } from 'node:path';
import { getReports } from './junit.js';

describe('reports/junit', () => {
  describe('#getReports()', () => {
    it('should return a test report', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/junit'));
      assert.equal(reports.length, 1);
      assert.deepEqual(reports, [
        { type: 'tests', data: { tests: 12, passed: 7, failed: 4, skipped: 1 } }
      ]);
    });

    it('should not return a test report when no file matches', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/jacoco'));
      assert.equal(reports.length, 0);
      assert.deepEqual(reports, []);
    });
  });
});
