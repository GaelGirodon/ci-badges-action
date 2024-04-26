import * as core from '@actions/core';
import { promises as fs } from 'fs';
import { join } from 'path';
import { globNearest } from '../util/index.js';

/**
 * Load tests reports using JUnit format.
 * @param {string} root Root search directory
 * @returns {Promise<import('./index.js').Report[]>} JUnit tests report
 */
export async function getReports(root) {
  core.info('Load JUnit tests report');
  const patterns = [
    join(root, '**/report.xml'),
    join(root, '**/*TEST*.xml'),
    join(root, '**/*test*.xml'),
    join(root, '**/*junit*.xml')
  ];
  const reports = await globNearest(patterns);
  const badges = [];
  for (const r of reports) {
    core.info(`Load JUnit report '${r}'`);
    const report = await fs.readFile(r, { encoding: 'utf8' });
    const testSuites = report.match(/<testsuite[^s]([^>]+)>/g);
    if (!testSuites) {
      core.info('Report is not a valid JUnit report');
      continue; // Invalid report file, trying the next one
    }
    const data = { passed: 0, failed: 0, tests: 0 };
    for (const ts of testSuites) {
      data.failed += parseInt(ts.match(/failures="([0-9]+)"/)?.[1] ?? "0");
      data.failed += parseInt(ts.match(/errors="([0-9]+)"/)?.[1] ?? "0");
      data.tests += parseInt(ts.match(/tests="([0-9]+)"/)?.[1] ?? "0");
    }
    data.passed = data.tests - data.failed;
    badges.push({ type: 'tests', data })
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${badges.length} JUnit report(s)`);
  return badges;
}
