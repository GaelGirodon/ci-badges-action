import assert from 'node:assert/strict';
import { join } from 'node:path';
import { getReports } from './junit.js';

describe('reports/junit', () => {
  describe('#getReports()', () => {
    const tests = [
      { name: "java", data: { tests: 6 + 3, passed: 3 + 1, failed: 2 + 1, skipped: 1 + 1 } },
      { name: "mocha", data: { tests: 15, passed: 7, failed: 5, skipped: 3 } },
      { name: "node", data: { tests: 15, passed: 7, failed: 5, skipped: 3 } },
    ];
    for (let test of tests) {
      it(`should return a test report (${test.name})`, async () => {
        const reports = await getReports(join(process.cwd(), `test/data/junit/${test.name}`));
        assert.equal(reports.length, 1);
        assert.deepEqual(reports, [{ type: 'tests', data: test.data }]);
      });
    }

    it('should skip matching but invalid files', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/junit/invalid'));
      assert.equal(reports.length, 0);
      assert.deepEqual(reports, []);
    });

    it('should not return a test report when no file matches', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/jacoco'));
      assert.equal(reports.length, 0);
      assert.deepEqual(reports, []);
    });
  });
});
