const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

test('Generated Enterprise CLI pages retain published URLs and sidebar labels', () => {
  const output = execFileSync('ruby', ['-e', `
    load ARGV[0]
    puts header({name: 'kratix-test pipeline', short: 'Test a pipeline'},
      stable_url: '/ske/promise-testing-framework/reference/kratix-test-pipeline', position: 2)
  `, path.join(__dirname, '../scripts/generate-cli-docs')], { encoding: 'utf8' });
  assert.match(output, /^---\nslug: "\/ske\/promise-testing-framework\/reference\/kratix-test-pipeline"\n/);
  assert.match(output, /sidebar_label: "kratix test pipeline"/);
  assert.match(output, /sidebar_position: 2\n---/);
});
