import * as core from '@actions/core';
import * as tests from './tests.js';
import * as coverage from './coverage.js';
import * as mutation from './mutation.js';

/**
 * Available badge generators
 * @type {{ [key: string]: { buildBadge: BadgeGenerator } }}
 */
const generators = { tests, coverage, mutation };

/**
 * Build a badge file from a report.
 * @param {Report} report Input report
 * @returns {NamedBadge} Badge name and content
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
  const badge = {
    schemaVersion: 1,
    label: report.type,
    ...generators[report.type].buildBadge(report.data)
  };
  return { name, badge };
}
