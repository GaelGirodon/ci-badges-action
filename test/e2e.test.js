import * as core from '@actions/core';
import * as github from '@actions/github';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';

describe('CI Badges action', function () {
  this.timeout(10000);
  describe('#main()', () => {
    it('should work end-to-end', async () => {
      // Set inputs
      process.env['INPUT_GIST-ID'] = process.env.GIST_ID;
      process.env['INPUT_TOKEN'] = process.env.GIST_TOKEN;
      process.env['INPUT_PREFIX'] = 'repo';
      process.env['INPUT_REF'] = 'false';
      // Generate and upload badges
      await main();
      // Wait 1s and get the Gist
      await new Promise(r => setTimeout(r, 1000));
      const octokit = github.getOctokit(core.getInput('token') || process.env.GIST_TOKEN);
      const response = await octokit.rest.gists.get({
        gist_id: core.getInput('gist-id') || process.env.GIST_ID
      });
      assert.equal(response.status, 200);
      // Check update date
      const updatedAt = new Date(response.data.updated_at).getTime();
      const now = new Date().getTime();
      assert.ok((now - updatedAt) / 1000 < 10);
      // Check uploaded files
      const files = Object.keys(response.data.files);
      [
        'repo-cobertura-coverage.json',
        'repo-go-coverage.json',
        'repo-go-tests.json',
        'repo-jacoco-coverage.json',
        'repo-junit-tests.json',
        'repo-lcov-coverage.json'
      ].forEach(f => assert.ok(files.includes(f)));
    });
  });
});
