import * as core from '@actions/core';
import fs from 'node:fs/promises';
import { join } from 'node:path';
import { globNearest } from '../util/index.js';

/**
 * Load coverage reports using LCOV format.
 * @param {string} root Root search directory
 * @returns LCOV coverage report
 */
export async function getReports(root) {
  core.info('Load LCOV coverage report');
  const patterns = [
    join(root, '**/lcov.*'),
    join(root, '**/*.lcov')
  ];
  const files = await globNearest(patterns);
  /** @type {Omit<CoverageReport, 'format'>[]} */
  const reports = [];
  for (const f of files) {
    core.info(`Load LCOV report '${f}'`);
    const coverage = await getCoverage(f);
    if (coverage < 0) {
      core.info('Report is not a valid LCOV report');
      continue; // Invalid report file, trying the next one
    }
    reports.push({ type: 'coverage', data: { coverage } });
    break; // Successfully loaded a report file, can return now
  }
  core.info(`Loaded ${reports.length} LCOV report(s)`);
  return reports;
}

/**
 * Compute the total line coverage rate from the given LCOV report file,
 * i.e., the ratio of all hit (LH) to found (LF) lines, deduplicated by source
 * file (SF) (only the best coverage for each source file is considered).
 * @param {string} path Path to the LCOV coverage report file
 * @returns {Promise<number>} The total line coverage rate (%),
 * or -1 if no coverage data can be read from this file
 */
async function getCoverage(path) {
  const contents = await fs.readFile(path, { encoding: 'utf8' });
  /** @type {{ [sf: string]: { lh: number, lf: number } }} */
  const sourceFiles = {};
  let from = 0, to = 0;
  while ((to = contents.indexOf('end_of_record', from)) > 0) {
    const record = contents.slice(from, to);
    const sf = record.match(/^SF:(.+)$/m)?.[1] ?? '';
    const lh = parseInt(record.match(/^LH:([0-9]+)$/m)?.[1] ?? '0');
    const lf = parseInt(record.match(/^LF:([0-9]+)$/m)?.[1] ?? '0');
    const value = sourceFiles[sf];
    if (sf && (!value || (lf >= value.lf && lh / lf > value.lh / value.lf))) {
      sourceFiles[sf] = { lh, lf };
    }
    from = to + 13;
  }
  let lh = 0, lf = 0;
  for (let value of Object.values(sourceFiles)) {
    lh += value.lh;
    lf += value.lf;
  }
  return lf > 0 ? (lh / lf) * 100 : -1;
}
