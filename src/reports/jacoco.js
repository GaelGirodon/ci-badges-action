import * as core from '@actions/core';
import { promises as fs } from 'fs';
import { join } from 'path';
import { globNearest } from '../util/index.js';

/**
 * Load coverage reports using JaCoCo format.
 * @param {string} root Root search directory
 * @returns {Promise<import('./index.js').Report[]>} JaCoCo coverage report
 */
export async function getReports(root) {
  core.info('Load JaCoCo coverage report');
  const patterns = [
    join(root, '**/*jacoco*.xml'),
    join(root, '**/*coverage*.xml')
  ];
  const reports = await globNearest(patterns);
  const badges = [];
  for (const r of reports) {
    core.info(`Load JaCoCo report '${r}'`);
    const report = await fs.readFile(r, { encoding: 'utf8' });
    const missedMatches = report
      .match(/(?<=<counter[^>]+type="LINE"[^>]+missed=")[0-9.]+(?=")/);
    const coveredMatches = report
      .match(/(?<=<counter[^>]+type="LINE"[^>]+covered=")[0-9.]+(?=")/);
    if (!missedMatches?.length || !coveredMatches?.length) {
      core.info('Report is not a valid JaCoCo report');
      continue; // Invalid report file, trying the next one
    }
    const missed = parseInt(missedMatches.slice(-1)[0]);
    const covered = parseInt(coveredMatches.slice(-1)[0]);
    const coverage = covered * 100 / (covered + missed);
    badges.push({ type: 'coverage', data: { coverage } });
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${badges.length} JaCoCo report(s)`);
  return badges;
}
