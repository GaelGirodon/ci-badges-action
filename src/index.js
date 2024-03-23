import * as core from '@actions/core';
import { getReports } from './reports/index.js';
import { buildBadge } from './badges/index.js';
import * as gist from './gist/index.js';

export async function main() {
  try {
    const badges = (await getReports())
      .map(b => buildBadge(b));
    await gist.update(badges);
  } catch (error) {
    core.warning(`An error occurred: ${error.message}`);
  }
}
