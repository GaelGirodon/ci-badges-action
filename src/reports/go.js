import * as core from '@actions/core';
import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { globNearest } from '../util/index.js';

/**
 * Load reports using Go test and coverage formats.
 * @param {string} root Root search directory
 * @returns Go test and coverage reports
 */
export async function getReports(root) {
  core.info('Load Go test and coverage report');
  const goMods = await globNearest([join(root, '**/go.mod')]);
  if (goMods.length === 0) {
    core.info('go.mod file not found, skipping');
    return [];
  }
  const dir = dirname(goMods[0]);
  core.info(`Search Go reports in '${dir}'`);
  /** @type {Omit<TestReport | CoverageReport, 'format'>[]} */
  const reports = [];
  const patterns = ['test*.out', 'test*.txt'].map(t => join(dir, t));
  const files = await globNearest(patterns);
  for (const f of files) {
    core.info(`Load Go report file '${f}'`);
    const contents = await fs.readFile(f, { encoding: 'utf8' });
    const tests = (contents.match(/=== RUN/g) || []).length;
    if (tests === 0) {
      core.info('File is not a valid Go report');
      continue; // Invalid report file, trying the next one
    }
    const passed = (contents.match(/--- PASS/g) || []).length;
    const failed = (contents.match(/--- FAIL/g) || []).length;
    const skipped = (contents.match(/--- SKIP/g) || []).length;
    reports.push({ type: 'tests', data: { tests, passed, failed, skipped } });
    const percentages = contents.match(/(?<=\s)[0-9.]+(?=%)/g);
    if (percentages && percentages.length >= 1) {
      const coverage = parseFloat(percentages.slice(-1)[0]);
      reports.push({ type: 'coverage', data: { coverage } });
    }
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${reports.length} Go report(s): ${JSON.stringify(reports)}`);
  return reports;
}
