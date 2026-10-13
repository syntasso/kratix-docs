const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('Enterprise entry pages link to pricing and requesting access', () => {
  for (const file of ['docs/ske/00-overview.mdx', 'docs/ske/02-install-ske/00-overview.mdx']) {
    assert.match(read(file), /https:\/\/www\.syntasso\.io\/pricing/, file);
  }
});

test('Prerequisites explain the two token uses and link to certificate installation', () => {
  const page = read('docs/ske/02-install-ske/00-overview.mdx');
  assert.match(page, /`skeLicense`/);
  assert.match(page, /`GH_TOKEN`/);
  assert.match(page, /https:\/\/cert-manager\.io\/docs\/installation\//);
});

test('Prerequisites links to upgrades without a standalone upgrade section', () => {
  const page = read('docs/ske/02-install-ske/00-overview.mdx');
  assert.doesNotMatch(page, /^## Upgrading and removing SKE/m);
  assert.match(page, /\]\(\/ske\/installing-ske\/upgrades\)/);
  assert.match(page, /id="upgrading-and-removing-ske"/);
});

test('Prerequisites presents workload storage as planning, not a configuration step', () => {
  const page = read('docs/ske/02-install-ske/00-overview.mdx');
  assert.doesNotMatch(page, /^## Configure workload delivery/m);
  assert.match(page, /:::note Workload storage/);
  assert.match(page, /Git repository or S3-compatible bucket/);
  assert.match(page, /after installing SKE/);
});
