import assert from 'node:assert/strict';
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getReports } from './go.js';

describe('reports/go', () => {
  describe('#getReports()', () => {
    before(async () => {
      await mkdir('test/data/go/project');
      await writeFile('test/data/go/project/go.mod', '');
    });
    const coverage = { type: 'coverage', data: { coverage: 96.5 } };
    const tests = [
      { file: 'test.out', expected: [{ type: 'tests', data: { tests: 3, passed: 3, failed: 0, skipped: 0 } }, coverage] },
      { file: 'only-test.out', expected: [{ type: 'tests', data: { tests: 2, passed: 2, failed: 0, skipped: 0 } }] },
      { file: 'failed-test.out', expected: [{ type: 'tests', data: { tests: 6, passed: 3, failed: 2, skipped: 1 } }, coverage] },
      { file: 'go.mod', expected: [] }
    ];
    for (const { file, expected } of tests) {
      it(`should return expected report(s) for file ${file}`, async () => {
        await copyFile(join('test/data/go', file), 'test/data/go/project/test.out');
        const reports = await getReports(join(process.cwd(), 'test/data/go/project'));
        assert.equal(reports.length, expected.length);
        assert.deepEqual(reports, expected);
      });
    }
    after(async () => {
      await rm('test/data/go/project', { recursive: true });
    });

    it('should not return any report when the go.mod file is missing', async () => {
      const reports = await getReports(join(process.cwd(), 'test/data/junit'));
      assert.equal(reports.length, 0);
      assert.deepEqual(reports, []);
    });
  });
});
