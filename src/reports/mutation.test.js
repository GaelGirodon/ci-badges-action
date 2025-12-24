import assert from 'assert/strict';
import { join } from 'path';
import { getReports } from './mutation.js';

describe('reports/mutation', () => {
  describe('#getReports()', () => {
    it('should return a mutation report from pitest', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/mutation/pitest'));
      assert.equal(reports.length, 1);
      assert.deepEqual(reports, [
        { type: 'mutation', data: { mutation: 9.58 } }
      ]);
    });
    it('should return a mutation report from stryker', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/mutation/stryker'));
      assert.equal(reports.length, 1);
      assert.deepEqual(reports, [
        { type: 'mutation', data: { mutation: 13.79 } }
      ]);
    });
  });
});
