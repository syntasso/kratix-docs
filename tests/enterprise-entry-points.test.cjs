const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('Enterprise entry pages link to pricing and requesting access', () => {
  for (const file of ['docs/ske/overview.mdx', 'docs/ske/01-install-ske/overview.mdx']) {
    assert.match(read(file), /https:\/\/www\.syntasso\.io\/pricing/, file);
  }
});

test('Prerequisites explain the two token uses and link to certificate installation', () => {
  const page = read('docs/ske/01-install-ske/overview.mdx');
  assert.match(page, /`skeLicense`/);
  assert.match(page, /`GH_TOKEN`/);
  assert.match(page, /https:\/\/cert-manager\.io\/docs\/installation\//);
});
