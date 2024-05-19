import * as core from '@actions/core';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { globNearest } from '../util/index.js';

/**
 * Load reports using Go tests and coverage formats.
 * @param {string} root Root search directory
 * @returns {Promise<import('./index.js').Report[]>} Go tests and coverage reports
 */
export async function getReports(root) {
  core.info('Load Go tests and coverage report');
  const goMods = await globNearest([join(root, '**/go.mod')]);
  if (goMods.length === 0) {
    core.info('go.mod file not found, skipping');
    return [];
  }
  const dir = dirname(goMods[0]);
  core.info(`Search Go reports in '${dir}'`);
  const badges = [];
  const patterns = ['test*.out', 'test*.txt'].map(t => join(dir, t));
  const reports = await globNearest(patterns);
  for (const r of reports) {
    core.info(`Load Go report '${r}'`);
    const report = await fs.readFile(r, { encoding: 'utf8' });
    const tests = (report.match(/=== RUN/g) || []).length;
    if (tests === 0) {
      continue; // Invalid report file, trying the next one
    }
    const passed = (report.match(/--- PASS/g) || []).length;
    const failed = (report.match(/--- FAIL/g) || []).length;
    badges.push({ type: 'tests', data: { passed, failed, tests } });
    const percentages = report.match(/(?<=\s)[0-9.]+(?=%)/g);
    if (percentages && percentages.length >= 1) {
      const coverage = parseFloat(percentages.slice(-1)[0]);
      badges.push({ type: 'coverage', data: { coverage } });
    }
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${badges.length} Go report(s)`);
  return badges;
}
