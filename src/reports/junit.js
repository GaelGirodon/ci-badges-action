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
    join(root, '**/TEST-*.xml'),
    join(root, '**/report.xml'),
    join(root, '**/*test*.xml'),
    join(root, '**/*junit*.xml')
  ];
  const reports = await globNearest(patterns);
  const data = { passed: 0, failed: 0, tests: 0 };
  let count = 0;
  for (const r of reports) {
    core.info(`Load JUnit report '${r}'`);
    const testSuites = await getTestSuiteTags(r);
    if (testSuites.length === 0) {
      core.info('Report is not a valid JUnit report');
      continue; // Invalid report file, trying the next one
    }
    for (const ts of testSuites) {
      data.failed += parseInt(ts.match(/failures="([0-9]+)"/)?.[1] ?? '0');
      data.failed += parseInt(ts.match(/errors="([0-9]+)"/)?.[1] ?? '0');
      data.tests += parseInt(ts.match(/tests="([0-9]+)"/)?.[1] ?? '0');
    }
    count++;
  }
  data.passed = data.tests - data.failed;
  core.info(`Loaded ${count} JUnit report(s)`);
  return [{ type: 'tests', data }];
}

/**
 * Extract top-level `<testsuite>` opening tags from the given JUnit test
 * report file. Some test runners output nested `<testsuite>` tags (e.g.
 * Node.js test runner), these nested tags must be ignored as values are
 * aggregated in top-level ones.
 * @param {string} path Path to the JUnit test report file
 * @returns {Promise<string[]>} Top-level `<testsuite>` opening tags
 */
async function getTestSuiteTags(path) {
  const testSuites = [];
  let depth = 0;
  const report = await fs.readFile(path, { encoding: 'utf8' });
  const tags = report.match(/<\/?testsuite(?:[^s>][^>]+|\s*)>/g) ?? [];
  for (const tag of tags) {
    if (tag.startsWith('</')) {
      depth--;
    } else {
      if (depth === 0) {
        testSuites.push(tag);
      }
      depth++;
    }
  }
  return testSuites;
}
