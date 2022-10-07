import * as glob from '@actions/glob';

/**
 * Returns files and directories matching the glob patterns,
 * sorted by the nearest.
 * @param {string[]} patterns Glob patterns
 * @return {Promise<string[]>} Files sorted by the nearest.
 */
export async function globNearest(patterns) {
  const globber = await glob.create(patterns.join('\n'));
  const files = await globber.glob();
  return files.sort((a, b) => {
    return (a.match(/[\\/]/g)?.length ?? 0) - (b.match(/[\\/]/g)?.length ?? 0);
  })
}
