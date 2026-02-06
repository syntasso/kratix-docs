# AGENTS.md (kratix-docs)

This repository is a Docusaurus site written in Markdown and MDX. Use this file
as the default operating manual when making documentation changes.

## Non-negotiables

- Write in **British English** (spelling, punctuation, and terms). For example:
“customised”, not “customized”.
- Prefer correctness and clarity over marketing tone.
- Keep pages scannable: short paragraphs, informative headings, purposeful
lists.
- `yarn build` must pass before changes are considered done.

## Quick start

1. Install dependencies:
   - `yarn install`
2. Validate the site (required):
   - `yarn build`

If `yarn build` fails, fix errors before making further edits. Typical failures
include broken links, invalid front matter, MDX syntax issues, and missing
imports.

## Repo conventions (follow existing patterns)

### Front matter

Most pages use Docusaurus front matter with fields like `title`,
`sidebar_label`, and `description`.

Keep titles specific and information-scented (they should help the reader
predict the content).

### Admonitions

Use admonitions to reduce risk and call out important context. This repo already
uses `:::info` and `:::warning` for guidance and hazards.

Use them sparingly and only when they change behaviour.

### Code blocks

- Always specify the language (for example `bash`, `yaml`).
- Prefer copy-pasteable commands and complete examples.
- Use placeholders for secrets and variable values:
  - `<YOUR_TOKEN>`, `<NAMESPACE>`, `<CLUSTER_NAME>`
- If an example is deliberately partial, say so and explain what is omitted.

### Links

- Prefer internal links where possible.
- When linking externally, ensure it is necessary and likely to remain stable.

## Writing principles (bias toward “Docs for Developers”)

Write for engineers and solution architects. Assume they are capable and busy.

### Make the page type explicit

A lot of this repo is **informative, reference documentation** (not task-based
guides). For example, reference pages define concepts and APIs, then enumerate
fields, types, and behaviours.

Before writing, decide which page type you are editing or creating:

- **Reference**: authoritative definitions, API shapes, behaviours, and edge
cases.
- **Concept**: explain mental models and “why”.
- **Guide**: a procedure to reach an outcome.
- **Troubleshooting**: symptoms, causes, and fixes.

Do not force a procedure into a reference page. Do not turn a guide into a spec.

### Reference doc structure (default)

Use this structure unless a better existing structure exists for that section:

1. **Summary (1 to 3 sentences)**
   - What this is, why it matters, scope boundaries.
2. **When to use it**
   - Situations and decision points.
3. **Definition**
   - Precise meaning and constraints.
4. **API / Schema**
   - Minimal YAML/JSON shape and a field-by-field description.
   - Prefer listing supported values explicitly (for example supported
   `sourceRef.type` values).
5. **Behaviour**
   - Reconciliation rules, ordering, idempotency, versioning rules, defaults.
6. **Examples**
   - Minimal working example, then one or two variants.
7. **Edge cases**
   - Mismatched versions, missing fields, unsupported values, deletion
   semantics.
8. **Related docs**
   - Cross-links to adjacent reference/guide pages.

### Guide structure (when it really is a procedure)

1. Overview (goal and end state)
2. Prerequisites (concrete and testable)
3. Steps (numbered, one action per step)
4. Verify (how to confirm success)
5. Troubleshooting (symptom-based)
6. Next steps

### Optimise for scanning

- Headings should carry meaning (avoid “Overview” everywhere).
- One idea per paragraph.
- Prefer lists for multiple items.
- Put warnings before risky actions, not after.

### Be precise with words

- Use consistent product and API terminology across pages.
- Avoid filler: “just”, “simply”, “obviously”.
- Prefer active voice and direct statements.
- Use “you” for procedures, and neutral phrasing for reference (“Kratix will…”)
where appropriate.

### Show, then explain

For schemas and examples, present the minimal example first, then explain only
what the reader needs to edit or understand. This mirrors how existing reference
pages introduce an API shape and then explain key fields and constraints.

## Content change workflow (agent checklist)

Before editing:
- Identify the page type (reference, concept, guide, troubleshooting).
- Find 1 to 2 similar pages and follow their conventions for front matter,
headings, and tone.
- Confirm British English spelling for new content.

While editing:
- Keep diffs focused. Avoid refactors unrelated to the change.
- Prefer additions that clarify constraints, defaults, and behaviours.
- If you introduce a new term, define it once at first use.

After editing:
- Run `yarn build` and fix all failures.
- Spot check:
  - internal links
  - MDX syntax and code fences
  - headings match content
  - examples are complete and consistent with the described behaviour

## Rules for safety and placeholders

- Never commit real tokens, internal-only URLs, or customer identifiers.
- Use consistent placeholders in angle brackets.
- If a command or configuration can be destructive, add a warning before it and
say what it changes.

