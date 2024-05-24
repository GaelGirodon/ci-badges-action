import * as core from '@actions/core';
import { promises as fs } from 'fs';
import { join } from 'path';
import { globNearest } from '../util/index.js';

/**
 * Load coverage reports using JaCoCo format.
 * @param {string} root Root search directory
 * @returns JaCoCo coverage report
 */
export async function getReports(root) {
  core.info('Load JaCoCo coverage report');
  const patterns = [
    join(root, '**/*jacoco*.xml'),
    join(root, '**/*coverage*.xml')
  ];
  const files = await globNearest(patterns);
  /** @type {Omit<CoverageReport, 'format'>[]} */
  const reports = [];
  for (const f of files) {
    core.info(`Load JaCoCo report '${f}'`);
    const contents = await fs.readFile(f, { encoding: 'utf8' });
    const missedMatches = contents
      .match(/(?<=<counter[^>]+type="LINE"[^>]+missed=")[0-9.]+(?=")/);
    const coveredMatches = contents
      .match(/(?<=<counter[^>]+type="LINE"[^>]+covered=")[0-9.]+(?=")/);
    if (!missedMatches?.length || !coveredMatches?.length) {
      core.info('Report is not a valid JaCoCo report');
      continue; // Invalid report file, trying the next one
    }
    const missed = parseInt(missedMatches.slice(-1)[0]);
    const covered = parseInt(coveredMatches.slice(-1)[0]);
    const coverage = covered * 100 / (covered + missed);
    reports.push({ type: 'coverage', data: { coverage } });
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${reports.length} JaCoCo report(s)`);
  return reports;
}
