const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Enterprise section headings do not have step-number prefixes', () => {
  function check(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) check(file);
      else if (/\.mdx?$/.test(entry.name)) {
        const page = fs.readFileSync(file, 'utf8').replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
        assert.doesNotMatch(page, /^#{1,6}\s+(?:Step\s+\d+:\s*|\d+[.)]\s+)/m, file);
      }
    }
  }
  check(path.join(__dirname, '../docs/ske'));
  check(path.join(__dirname, '../docs/ske-supporting'));
});
