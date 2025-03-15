import * as core from '@actions/core';
import * as go from './go.js';
import * as junit from './junit.js';
import * as cobertura from './cobertura.js';
import * as jacoco from './jacoco.js';
import * as lcov from './lcov.js';
import * as mutation from './mutation.js';

/**
 * Available report loaders
 * @type {{ [key: string]: { getReports: ReportsLoader } }}
 */
const loaders = { go, junit, cobertura, jacoco, lcov, mutation };

/**
 * Load all available reports in the current workspace.
 * @returns {Promise<Report[]>} Loaded reports
 */
export async function getReports() {
  core.info('Load reports');
  const all = [];
  for (const id of Object.keys(loaders)) {
    try {
      const reports = await loaders[id].getReports(process.cwd());
      all.push(...reports.map(r => ({ ...r, format: id })));
    } catch (error) {
      core.warning(`Skipping ${id} report format: ${error}`);
    }
  }
  core.info(`Loaded ${all.length} report(s)`);
  return all;
}
