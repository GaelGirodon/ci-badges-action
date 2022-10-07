import assert from 'assert';
import { join } from 'path';
import { getReports } from './cobertura.js';

describe('reports/cobertura', function () {
  describe('#getReports()', function () {
    it(`should return coverage report`, async function () {
      const reports = await getReports(join(process.cwd(), 'test/data/cobertura'));
      assert.equal(reports.length, 1)
      assert.deepStrictEqual(reports, [
        { type: 'coverage', data: { coverage: 92.09999999999999 } }
      ]);
    });
  });
});
