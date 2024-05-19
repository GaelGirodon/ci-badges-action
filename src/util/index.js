import * as glob from '@actions/glob';

/**
 * Returns files matching the glob patterns, sorted by ascending depth
 * and name, excluding some common unwanted directories from the search.
 * @param {string[]} patterns Glob patterns
 * @return {Promise<string[]>} Files sorted by the nearest
 */
export async function globNearest(patterns) {
  const safePatterns = [
    ...patterns,
    '!**/.git/**',
    '!**/.idea/**',
    '!**/.vscode/**',
    '!**/node_modules/**',
    '!**/vendor/**'
  ];
  const globber = await glob.create(safePatterns.join('\n'), {
    followSymbolicLinks: false,
    implicitDescendants: false,
    matchDirectories: false
  });
  const files = await globber.glob();
  return files.sort((a, b) => {
    const depthDiff = (a.match(/[\\/]/g)?.length ?? 0)
      - (b.match(/[\\/]/g)?.length ?? 0);
    return depthDiff !== 0 ? depthDiff : a.localeCompare(b);
  });
}
