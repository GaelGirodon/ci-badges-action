import assert from 'assert';
import { join } from 'path';
import { getReports } from './junit.js';

describe('reports/junit', function () {
  describe('#getReports()', function () {
    it(`should return tests report`, async function () {
      const reports = await getReports(join(process.cwd(), 'test/data/junit'));
      assert.equal(reports.length, 1)
      assert.deepStrictEqual(reports, [
        { type: 'tests', data: { passed: 8, failed: 2, tests: 10 } }
      ]);
    });
  });
});
