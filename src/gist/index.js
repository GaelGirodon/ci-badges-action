import * as core from '@actions/core';
import * as github from '@actions/github';

/**
 * Update the Gist.
 * @param {{name: string, content: import('../badges/index.js').Badge}[]} badges Badges to add to the Gist
 */
export async function update(badges) {
  core.info(`Update Gist with ${badges.length} file(s)`);
  const octokit = github.getOctokit(core.getInput('token'));
  const files = badges
    .reduce((result, b) => {
      result[b.name] = { content: JSON.stringify(b.content) };
      return result;
    }, {});
  await octokit.rest.gists.update({
    gist_id: core.getInput('gist-id'),
    files
  });
}
