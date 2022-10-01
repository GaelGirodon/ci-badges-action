import assert from 'assert';
import { join } from 'path';
import { getReports } from './jacoco.js';

describe('reports/jacoco', function () {
  describe('#getReports()', function () {
    it(`should return coverage report`, async function () {
      const reports = await getReports(join(process.cwd(), 'test/data/jacoco'));
      assert.equal(reports.length, 1)
      assert.deepStrictEqual(reports, [
        { type: 'coverage', data: { coverage: 65.61056105610561 } }
      ]);
    });
  });
});
