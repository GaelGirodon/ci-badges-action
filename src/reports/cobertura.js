import * as core from '@actions/core';
import { promises as fs } from 'fs';
import { join } from 'path';
import { globNearest } from '../util/index.js';

/**
 * Load coverage reports using Cobertura format.
 * @param {string} root Root search directory
 * @returns Cobertura coverage report
 */
export async function getReports(root) {
  core.info('Load Cobertura coverage report');
  const patterns = [
    join(root, '**/*cobertura*.xml'),
    join(root, '**/*coverage*.xml')
  ];
  const reports = await globNearest(patterns);
  const badges = [];
  for (const r of reports) {
    core.info(`Load Cobertura report '${r}'`);
    const report = await fs.readFile(r, { encoding: 'utf8' });
    const coverageMatches = report
      .match(/(?<=<coverage[^>]+line-rate=")[0-9.]+(?=")/);
    if (coverageMatches?.length !== 1) {
      core.info('Report is not a valid Cobertura report');
      continue; // Invalid report file, trying the next one
    }
    const coverage = parseFloat(coverageMatches[0]) * 100;
    badges.push({ type: 'coverage', data: { coverage } });
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${badges.length} Cobertura report(s)`);
  return badges;
}
