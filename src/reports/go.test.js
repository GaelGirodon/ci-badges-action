import assert from 'assert';
import { join } from 'path';
import { getReports } from './go.js';

describe('reports/go', function () {
  describe('#getReports()', function () {
    it(`should return tests and coverage reports`, async function () {
      const reports = await getReports(join(process.cwd(), 'test/data/go'));
      assert.equal(reports.length, 2)
      assert.deepStrictEqual(reports, [
        { type: 'tests', data: { passed: 3, failed: 0, tests: 3 } },
        { type: 'coverage', data: { coverage: 96.5 } }
      ]);
    });
  });
});
