import * as core from '@actions/core';
import * as tests from './tests.js';
import * as coverage from './coverage.js';

/**
 * @typedef {{schemaVersion?: number, label?: string, message?: string, color?: string}} Badge A generated badge
 * @typedef {(data: any) => Badge} BadgeGenerator A badge generator
 */

/**
 * Available badge generators
 * @type {{[key: string]: {buildBadge: BadgeGenerator}}}
 */
const generators = { tests, coverage };

/**
 * Build a badge file from a report.
 * @param {import('../reports/index.js').Report} report Input report
 * @returns {{name: string, content: Badge}} Badge file name and content
 */
export function buildBadge(report) {
  let name = `${report.format}-${report.type}.json`;
  const ref = process.env.GITHUB_REF_NAME?.replace(/[^\w.-]/g, '-');
  if (core.getBooleanInput('ref') && ref) {
    name = `${ref}-${name}`;
  }
  let prefix = core.getInput('prefix');
  if (prefix === '$GITHUB_REPOSITORY_NAME') {
    prefix = (process.env.GITHUB_REPOSITORY || '/').split('/')[1];
  }
  if (prefix) {
    name = `${prefix}-${name}`;
  }
  core.info(`Build badge ${name}`);
  const content = {
    schemaVersion: 1,
    label: report.type,
    ...generators[report.type].buildBadge(report.data)
  };
  return { name, content };
}
