import * as core from '@actions/core';
import fs from 'node:fs/promises';
import { join } from 'node:path';
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
  const files = await globNearest(patterns);
  /** @type {Omit<CoverageReport, 'format'>[]} */
  const reports = [];
  for (const f of files) {
    core.info(`Load Cobertura report '${f}'`);
    const contents = await fs.readFile(f, { encoding: 'utf8' });
    const coverageMatches = contents
      .match(/(?<=<coverage[^>]+line-rate=")[0-9.]+(?=")/);
    if (coverageMatches?.length !== 1) {
      core.info('Report is not a valid Cobertura report');
      continue; // Invalid report file, trying the next one
    }
    const coverage = parseFloat(coverageMatches[0]) * 100;
    reports.push({ type: 'coverage', data: { coverage } });
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${reports.length} Cobertura report(s)`);
  return reports;
}
