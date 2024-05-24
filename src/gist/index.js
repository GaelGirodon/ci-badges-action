import * as core from '@actions/core';
import * as github from '@actions/github';

/**
 * Update the Gist.
 * @param {NamedBadge[]} badges Badges to add to the Gist
 */
export async function update(badges) {
  core.info(`Update Gist with ${badges.length} file(s)`);
  const octokit = github.getOctokit(core.getInput('token'));
  const files = Object.fromEntries(
    badges.map((b) => [b.name, { content: JSON.stringify(b.badge) }])
  );
  await octokit.rest.gists.update({
    gist_id: core.getInput('gist-id'),
    files
  });
}
