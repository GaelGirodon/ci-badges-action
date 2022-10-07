import * as core from '@actions/core';
import * as go from './go.js';
import * as junit from './junit.js';
import * as cobertura from './cobertura.js';
import * as jacoco from './jacoco.js';

/**
 * @typedef {{ type: string, format?: string, data: any }} Report A loaded report
 * @typedef {(root: string) => Promise<Report[]>} ReportsLoader A reports loader
 */

/**
 * Available report loaders
 * @type {{[key: string]: {getReports: ReportsLoader}}}
 */
const loaders = { go, junit, cobertura, jacoco };

/**
 * Load all available reports in the current workspace.
 * @returns Loaded reports
 */
export async function getReports() {
  core.info('Load reports');
  const all = [];
  for (const id of Object.keys(loaders)) {
    try {
      const reports = await loaders[id].getReports(process.cwd());
      all.push(...reports.map(r => ({ format: id, ...r })));
    } catch (error) {
      core.warning(`Skipping ${id} report format: ${error}`);
    }
  }
  core.info(`Loaded ${all.length} reports`);
  return all;
}
