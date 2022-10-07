import assert from 'assert';
import { buildBadge } from './index.js';

describe('badges/index', function () {
  describe('#buildBadge()', function () {
    const env = {
      GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
      GITHUB_REF_NAME: process.env.GITHUB_REF_NAME,
      INPUT_PREFIX: process.env.INPUT_PREFIX,
      INPUT_REF: process.env.INPUT_REF
    };
    const prefix = '$GITHUB_REPOSITORY_NAME'; // Default prefix value
    const tests = [
      // Default settings
      { env: { repository: 'user/repo', ref_name: 'main', prefix, ref: 'false' }, expected: { name: 'repo-go-coverage.json' } },
      // Custom filenames prefix
      { env: { repository: 'user/repo', ref_name: 'main', prefix: 'prefix', ref: 'false' }, expected: { name: 'prefix-go-coverage.json' } },
      // Empty custom filenames prefix
      { env: { repository: 'user/repo', ref_name: 'main', prefix: '', ref: 'false' }, expected: { name: 'go-coverage.json' } },
      // Include ref in filenames
      { env: { repository: 'user/repo', ref_name: 'main', prefix, ref: 'true' }, expected: { name: 'repo-main-go-coverage.json' } },
      // Custom filenames prefix and include ref in filenames
      { env: { repository: 'user/repo', ref_name: 'main', prefix: 'prefix', ref: 'true' }, expected: { name: 'prefix-main-go-coverage.json' } },
      // Empty custom filenames prefix and include ref in filenames
      { env: { repository: 'user/repo', ref_name: 'main', prefix: '', ref: 'true' }, expected: { name: 'main-go-coverage.json' } },
      // Ref with special characters
      { env: { repository: 'user/repo', ref_name: 'feature/task', prefix, ref: 'true' }, expected: { name: 'repo-feature-task-go-coverage.json' } },
      // Include ref in filenames but empty
      { env: { repository: 'user/repo', ref_name: '', prefix, ref: 'true' }, expected: { name: 'repo-go-coverage.json' } },
      // Empty repository variable
      { env: { repository: '', ref_name: 'main', prefix, ref: 'true' }, expected: { name: 'main-go-coverage.json' } },
      // Empty repository variable but custom filenames prefix
      { env: { repository: '', ref_name: 'main', prefix: 'prefix', ref: 'true' }, expected: { name: 'prefix-main-go-coverage.json' } },
      // Empty repository variable and ref
      { env: { repository: '', ref_name: '', prefix, ref: 'true' }, expected: { name: 'go-coverage.json' } }
    ];
    for (const { env, expected } of tests) {
      it(`should return a badge with name "${expected.name}" for ${JSON.stringify(env)}`, function () {
        process.env.GITHUB_REPOSITORY = env.repository;
        process.env.GITHUB_REF_NAME = env.ref_name;
        process.env.INPUT_PREFIX = env.prefix;
        process.env.INPUT_REF = env.ref;
        const actual = buildBadge({ type: 'coverage', format: 'go', data: { coverage: 0 } });
        assert.deepStrictEqual(actual, {
          name: expected.name,
          content: { schemaVersion: 1, label: 'coverage', message: '0%', color: 'red' }
        });
      });
    }
    after(function () {
      process.env.GITHUB_REPOSITORY = env.GITHUB_REPOSITORY;
      process.env.GITHUB_REF_NAME = env.GITHUB_REF_NAME;
      process.env.INPUT_PREFIX = env.INPUT_PREFIX;
      process.env.INPUT_REF = env.INPUT_REF;
    });
  });
});
