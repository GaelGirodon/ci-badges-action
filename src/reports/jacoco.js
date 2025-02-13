import * as core from '@actions/core';
import fs from 'node:fs/promises';
import { join } from 'node:path';
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
    const counter = contents.slice(-400)
      .match(/<counter[^>]+type="LINE"[^>]+>/g)?.at(-1);
    const missed = parseInt(counter?.match(/missed="([0-9.]+)"/)?.[1]);
    const covered = parseInt(counter?.match(/covered="([0-9.]+)"/)?.[1]);
    if (isNaN(missed) || isNaN(covered)) {
      core.info('Report is not a valid JaCoCo report');
      continue; // Invalid report file, trying the next one
    }
    const coverage = covered * 100 / (covered + missed);
    reports.push({ type: 'coverage', data: { coverage } });
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${reports.length} JaCoCo report(s)`);
  return reports;
}
