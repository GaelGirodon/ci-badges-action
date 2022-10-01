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
    const testsMatches = report
      .match(/(?<=<testsuites[^>]+tests=")[0-9]+(?=")/);
    const failedMatches = report
      .match(/(?<=<testsuites[^>]+failures=")[0-9]+(?=")/);
    if (testsMatches?.length != 1 || failedMatches?.length != 1) {
      core.info('Report is not a valid JUnit report');
      continue; // Invalid report file, trying the next one
    }
    const tests = parseInt(testsMatches[0]);
    const failed = parseInt(failedMatches[0]);
    const passed = tests - failed;
    badges.push({ type: 'tests', data: { passed, failed, tests } })
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${badges.length} JUnit report(s)`);
  return badges;
}
