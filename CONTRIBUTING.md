# Contributing to @veridtools/dmn-parser

## Setup

```bash
git clone https://github.com/veridtools/dmn-parser.git
cd dmn-parser
pnpm install
```

## Dev commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Compile TypeScript → `dist/` (library + CLI) |
| `pnpm dev` | Watch mode build |
| `pnpm test` | Run all tests with Vitest |
| `pnpm test:watch` | Tests in watch mode |
| `pnpm typecheck` | Type-check without emitting |
| `pnpm docs:dev` | Start Vitepress dev server |
| `pnpm docs:build` | Build docs site |

## Making changes

1. Branch from `main`: `git checkout -b feat/my-change`
2. Make changes — test files live next to source (e.g. `src/mappers/expressions.test.ts`)
3. Run `pnpm test` and `pnpm typecheck` to verify
4. Create a changeset: `pnpm changeset`
5. Open a PR against `main`

> For docs-only or chore PRs, add `[skip changeset]` to the PR title.

## Architecture

```
src/
  types.ts                      → all public TypeScript types
  utils.ts                      → isRecord, asStr, asRecord, asRecordArray, asHref
  context.ts                    → MapContext (index, version, options)
  xml.ts                        → XMLParser config, ARRAY_TAGS, DMN_NAMESPACES
  test-fixtures.ts              → inline DMN XML for unit tests
  index.ts                      → public API barrel export
  parse.ts                      → parse(), safeParse(), detectVersion()
  normalize/
    cdata.ts                    → preprocessXml: BOM removal, CDATA → entities
    cdata.test.ts
    defaults.ts                 → normalizeNode: defaults, promotions, booleans
    defaults.test.ts
    namespace.ts                → detectVersionFromRaw: regex xmlns detection
    namespace.test.ts
  mappers/
    definitions.ts              → mapDefinitions: orchestrates all mappers
    drgElements.ts              → Decision, InputData, BKM, KnowledgeSource, DecisionService
    drgElements.test.ts
    decisionTable.ts            → DecisionTable, InputClause, OutputClause, Rule
    decisionTable.test.ts
    expressions.ts              → mapExpression union + all expression sub-mappers
    expressions.test.ts
    itemDefinitions.ts          → ItemDefinition (recursive)
    itemDefinitions.test.ts
    artifacts.ts                → TextAnnotation, Association, Group
    businessContext.ts          → PerformanceIndicator, OrganizationUnit, ElementCollection
    imports.ts                  → Import
    requirements.ts             → InformationRequirement, KnowledgeRequirement, AuthorityRequirement
    dmndi.ts                    → DMNDI (optional, behind includeDMNDI flag)
  xml.test.ts
  parse.test.ts
  fixtures/                     → OMG compliance tests (see below)
    helpers.ts
    parse-all.test.ts
    structure.test.ts
    version.test.ts
    normalization.test.ts
    index.test.ts
    expressions.test.ts
    model.test.ts
bin/
  dmn-parser.ts                  → CLI entry point
  dmn-parser.test.ts
docs/                           → Vitepress documentation
```

## OMG compliance tests (`src/fixtures/`)

Tests in `src/fixtures/` use [`@veridtools/dmn-fixtures`](https://www.npmjs.com/package/@veridtools/dmn-fixtures) as the fixture corpus. This package provides a comprehensive set of DMN files covering every construct from the OMG DMN specification (versions 1.1–1.5), including structural variations, semantic edge cases, S-FEEL and FEEL expression patterns, and execution scenarios.

Using this corpus as the primary test signal means our parse output is validated against the standard rather than against hand-written examples alone.

| File | What it validates |
|------|------------------|
| `parse-all.test.ts` | Every fixture in the corpus parses without error |
| `structure.test.ts` | Field-by-field model shape of all 40 base fixtures; exact entry text values; cross-version equivalence for DMN 1.1–1.5 |
| `version.test.ts` | `model.dmnVersion` correctness across all versioned fixtures |
| `normalization.test.ts` | All edge-case fixtures: CDATA, BOM, hitPolicy, wildcards, encoding, namespace prefixes, DMNDI/extensionElements absence |
| `index.test.ts` | `model.index` completeness — every `@id` maps to its element with reference equality |
| `expressions.test.ts` | Expression type correctness and clean text (no XML artifacts) across execution, s-feel, and feel fixture groups |
| `model.test.ts` | Deep field validation of the complete loan-approval model |
| `snapshots.test.ts` | Golden output snapshots for all 40 base fixtures — catches any unintended regression in parse output |
| `variants.test.ts` | Group-specific structural assertions for all 283 variant fixtures; noDiff cross-version equivalence |
| `testcases.test.ts` | Context variable names in companion test-case JSONs match parsed inputData/decision names |
| `graph.test.ts` | Every internal href (`#id`) in requirements, associations, and services resolves to `model.index` |
| `error-paths.test.ts` | `safeParse` never throws; returns `success:false` for invalid/non-DMN input |

When adding support for a new DMN element or field, add fixture-level assertions to the relevant file in `src/fixtures/` in addition to the colocated unit test.

When a snapshot changes unexpectedly after editing parser code, run `pnpm test --update-snapshots` only after verifying the new output is correct.

## Adding support for a new DMN element

1. Add the interface to `src/types.ts`
2. Add the tag name to `ARRAY_TAGS` in `src/xml.ts` if it can appear multiple times
3. Add normalizations to `normalizeNode` in `src/normalize/defaults.ts`
4. Create or extend a mapper in `src/mappers/`
5. Wire it up in `src/mappers/definitions.ts`
6. Add tests next to the mapper file

## Adding a new field to an existing element

1. Add the field to the interface in `src/types.ts`
2. Map it in the relevant mapper (assign-after-construction pattern)
3. Add/update tests

## `exactOptionalPropertyTypes` pattern

This project uses `exactOptionalPropertyTypes: true`. Always use assign-after-construction for optional fields:

```typescript
// ✓ correct
const el: MyType = { required: 'value' };
const opt = asStr(raw['@field']);
if (opt !== undefined) el.optionalField = opt;

// ✗ wrong — TypeScript rejects this
const el: MyType = { required: 'value', ...({ optionalField: value }) };
```

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for DMN 1.5 typeConstraint in itemDefinition
fix: normalize empty inputEntry to wildcard before mapping
docs: add normalization reference page
chore: bump fast-xml-parser
```

## Release flow

Releases are automated via [Changesets](https://github.com/changesets/changesets):

1. Each PR that changes source or behavior must include a changeset (`pnpm changeset`)
2. When PRs merge to `main`, a **Version Packages** PR is opened automatically
3. Merging that PR triggers an npm publish via GitHub Actions
