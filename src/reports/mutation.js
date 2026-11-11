import * as core from '@actions/core';
import { promises as fs } from 'fs';
import { join } from 'path';
import { globNearest } from '../util/index.js';

/**
 * Load mutation reports using Mutation format.
 * @param {string} root Root search directory
 * @returns Mutation mutation report
 */
export async function getReports(root) {
  core.info('Load Mutation mutation report');
  const patterns = [
    join(root, '**/mutations.xml'),
    join(root, '**/mutation.json'),
  ];
  const files = await globNearest(patterns);
  /** @type {Omit<MutationReport, 'format'>[]} */
  const reports = [];
  for (const f of files) {
    core.info(`Load Mutation report '${f}'`);
    const contents = await fs.readFile(f, { encoding: 'utf8' });
    
    const mutationMatches = contents.match(/(?<=<mutation[ ]+detected=['"].*['"][ ]+status=')/);
    const mutationJsonMatches = contents.match(/(Stryker)/i);
    
    if (mutationMatches?.length === 0 && mutationJsonMatches?.length === 0) {
      core.info('Report is not a valid Mutation report');
      continue;
    }

    let killedMatches;
    let survivedMatches;
    let noCoverageMatches;

    if (mutationMatches?.length === 1) {
      killedMatches = contents.match(/(mutation.*status=['"]KILLED['"])/ig);
      survivedMatches = contents.match(/(mutation.*status=['"]SURVIVED['"])/ig);
      noCoverageMatches = contents.match(/(mutation.*status=['"]NO_COVERAGE['"])/ig);
    }
    else if (mutationJsonMatches?.length >= 1) {
      killedMatches = contents.match(/(['"]status['"]\:['"]Killed['"])/ig);
      survivedMatches = contents.match(/(['"]status['"]\:['"]Survived['"])/ig);
      noCoverageMatches = contents.match(/(['"]status['"]\:['"]NoCoverage['"])/ig);
    }

    const killed = parseInt((killedMatches)?.length ?? '0');
    const survived = parseInt((survivedMatches)?.length ?? '0');
    const noCoverage = parseInt((noCoverageMatches)?.length ?? '0');

    const total = (killed + survived + noCoverage) === 0 ? 1 : (killed + survived + noCoverage)
    const mutation = parseFloat(parseFloat(killed * 100 / total).toFixed(2));
    reports.push({ type: 'mutation', data: { mutation } });
    break;
  }

  core.info(`Loaded ${reports.length} Mutation report(s)`);

  return reports;
}
