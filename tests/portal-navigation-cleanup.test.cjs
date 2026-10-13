const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('Backstage Overview renders its integration flows as a diagram', () => {
  const page = read('docs/ske/05-portal-integrations/01-backstage/00-overview.mdx');
  assert.match(page, /```mermaid\nflowchart/);
  assert.match(page, /Publishing/);
  assert.match(page, /Requesting/);
  assert.doesNotMatch(page, /```text/);
});

test('Backstage migration covers the controller before optional customisation', () => {
  const page = read('docs/ske/05-portal-integrations/01-backstage/07-migrating-from-backstage.mdx');
  assert.ok(page.indexOf('## Migration checklist') < page.indexOf('## Customisation changes'));
  assert.match(page, /If you use `BackstageEntityCustomization`/);
});

test('Backstage customisation links to namespace policy instead of partial recipes', () => {
  const page = read('docs/ske/05-portal-integrations/01-backstage/04-customising-the-request-template.mdx');
  assert.doesNotMatch(page, /^## Delivery mode and namespace recipes/m);
  assert.match(page, /id="delivery-mode-and-namespace-recipes"/);
  assert.match(page, /\]\(\/ske\/integrations\/portal-controller\/backstage\/request-namespace\)/);
  assert.doesNotMatch(page, /op: hideNamespaceManifest/);
});

const cases = [
  ['docs/ske/05-portal-integrations/01-backstage/02-configure-backstage.mdx',
    ['configuring-the-backend-plugin', 'configure-backend-access', 'using-oidc-authentication', 'connect-the-platform-to-the-git-repository']],
  ['docs/ske/05-portal-integrations/01-backstage/00-overview.mdx',
    ['configuration', 'owning-a-destination', 'referencing-an-existing-state-store', 'adopting-an-existing-destination', 'configuration-errors', 'what-gets-written-where']],
  ['docs/ske/05-portal-integrations/04-portal-controller/01-installation.mdx',
    ['portal-configuration-reference', 'connect-a-portal', 'credential-secret-handling', 'bind-a-promise-to-a-portal', 'opting-a-single-resource-out', 'binding-status', 'adapter-image-resolution', 'other-adapterconfig-fields', 'portal-wide-generate-flags', 'making-the-controllers-jobs-follow-your-clusters-rules']],
  ['docs/ske-supporting/10-integrations/09-portal-controller/02-backstage/12-entity-yaml-format.mdx',
    ['promise-template', 'the-kratix-catalog-entities', 'kratix-promise-entity', 'kratix-resource-entity']],
  ['docs/ske-supporting/10-integrations/09-portal-controller/04-customization/01-portal-patch.mdx',
    ['how-it-runs', 'recipes-are-container-arguments', 'the-image-tag-is-the-grammar-version', 'failure-behaviour', 'choosing-between-a-recipe-and-your-own-container']],
];

for (const [file, anchors] of cases) {
  test(`${path.basename(file)} preserves old anchors without placeholder headings`, () => {
    const page = read(file);
    assert.doesNotMatch(page, /<summary>(?:Request|Storage) configuration links<\/summary>/);
    const slug = page.match(/^slug: "([^"]+)"/m)[1];
    const rendered = read(`build${slug}.html`);
    for (const anchor of anchors) {
      assert.ok(page.includes(`<span id="${anchor}" />`), anchor);
      assert.ok(rendered.includes(`id="${anchor}"`), `Rendered anchor: ${anchor}`);
    }
    if (file.includes('ske-supporting')) assert.doesNotMatch(page, /^#{2,4} /m);
    if (file.endsWith('01-installation.mdx')) {
      assert.doesNotMatch(page, /^#{2,4} (Portal configuration reference|Portal fields and credentials|Binding labels and status|Adapter generation settings)/m);
    }
  });
}
