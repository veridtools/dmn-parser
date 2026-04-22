# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Commands

```bash
pnpm build          # tsup → dist/ (library ESM+CJS + CLI ESM with shebang)
pnpm dev            # tsup --watch
pnpm test           # vitest run
pnpm test:watch     # vitest
pnpm typecheck      # tsc --noEmit
pnpm docs:dev       # vitepress dev docs
pnpm docs:build     # vitepress build
```

## Architecture

This is a **DMN XML parser library**, published as both a library (`@veridtools/dmn-parser`) and a CLI (`dmn-parser`).

### Pipeline: `parse(xml, options?)`

```
preprocessXml()       → remove BOM, convert CDATA to XML entities
parseXml()            → fast-xml-parser (removeNSPrefix, attributeNamePrefix: '@', isArray for repeated tags)
detectVersionFromRaw()→ regex scan of raw XML string for xmlns namespace URIs
normalizeNode()       → hitPolicy default UNIQUE, preferredOrientation, isCollection boolean, DMNDI removal
mapDefinitions()      → builds typed DMNModel, populates index Map<id, element>
```

### Key files

| File | Responsibility |
|------|---------------|
| `src/types.ts` | All public types — `DMNModel`, `Expression` union, etc. |
| `src/xml.ts` | `XMLParser` config + `ARRAY_TAGS` set + `DMN_NAMESPACES` |
| `src/normalize/cdata.ts` | `preprocessXml` — BOM removal, CDATA → entities |
| `src/normalize/defaults.ts` | `normalizeNode` — defaults, promotions, boolean coercion |
| `src/normalize/namespace.ts` | `detectVersionFromRaw` — regex-based xmlns version detection |
| `src/context.ts` | `MapContext` — carries index, version, options through mappers |
| `src/mappers/definitions.ts` | Orchestrates all mappers, builds `DMNModel` |
| `src/mappers/expressions.ts` | `mapExpression` union mapper + all expression sub-mappers |
| `src/mappers/decisionTable.ts` | Decision table, input/output clauses, rules |
| `src/mappers/drgElements.ts` | Decision, InputData, BKM, KnowledgeSource, DecisionService |
| `src/mappers/itemDefinitions.ts` | ItemDefinition (recursive for itemComponents) |
| `src/mappers/artifacts.ts` | TextAnnotation, Association, Group |
| `src/parse.ts` | `parse`, `safeParse`, `detectVersion` public API |
| `src/index.ts` | Barrel exports |
| `bin/dmn-parser.ts` | CLI entry — reads files, prints summary/json/elements |

### Test structure

Unit tests live **next to their source files**:
- `src/xml.test.ts`
- `src/normalize/cdata.test.ts`
- `src/normalize/namespace.test.ts`
- `src/normalize/defaults.test.ts`
- `src/mappers/decisionTable.test.ts`
- `src/mappers/expressions.test.ts`
- `src/mappers/drgElements.test.ts`
- `src/mappers/itemDefinitions.test.ts`
- `src/parse.test.ts`
- `bin/dmn-parser.test.ts`

OMG compliance tests live in `src/fixtures/` and use `@veridtools/dmn-fixtures` as the fixture corpus:
- `src/fixtures/parse-all.test.ts` — every fixture in the corpus must parse without error, grouped by category
- `src/fixtures/structure.test.ts` — field-by-field validation of all 40 base fixtures; exact inputEntry/outputEntry text values for known fixtures; cross-version structural equivalence for base-dmn11 through base-dmn15
- `src/fixtures/version.test.ts` — `model.dmnVersion` matches the declared DMN version across all versioned fixtures; `detectVersion()` standalone checks
- `src/fixtures/normalization.test.ts` — all edge-case fixtures: CDATA/entities equivalence, BOM, hitPolicy defaults, wildcard inputEntry, namespace prefixes, encoding, attribute order, DMNDI exclusion, extensionElements absence
- `src/fixtures/index.test.ts` — index map completeness: every element with an `@id` is present in `model.index` and returns the same object reference
- `src/fixtures/expressions.test.ts` — expression type correctness and clean text (no XML artifacts) across execution, s-feel, feel-types, and feel-functions fixture groups
- `src/fixtures/model.test.ts` — deep field-level validation of the complete `loan-approval-v1` fixture, including specific element IDs, relationship hrefs, and expression shapes
- `src/fixtures/snapshots.test.ts` — golden output snapshots for all 40 base fixtures; any unexpected parser regression breaks a snapshot
- `src/fixtures/variants.test.ts` — group-specific structural assertions for all 283 variant fixtures; noDiff cross-version equivalence for pure namespace-change variants
- `src/fixtures/testcases.test.ts` — for every fixture with a companion test-cases JSON, verifies that context variable names match the parsed model's inputData/decision names
- `src/fixtures/graph.test.ts` — requirements graph integrity: every internal href (`#id`) must resolve to an element in `model.index`
- `src/fixtures/error-paths.test.ts` — safeParse never throws; returns `success:false` for invalid XML, non-DMN XML, and malformed input; minimal valid model has correct empty collections

**Why `@veridtools/dmn-fixtures`?** The corpus is purpose-built to exercise every DMN construct from the OMG spec across all supported versions (1.1–1.5), covering structural variations, semantic edge cases, normalization inputs, and FEEL expression patterns. Using it as the test corpus gives confidence that parse output is correct and complete against the standard, not just against hand-written examples.

### Build output

```
dist/index.js          ESM library
dist/index.cjs         CJS library
dist/index.d.ts        TypeScript declarations
dist/bin/dmn-parser.js  Standalone CLI (ESM, bundled, shebang)
```

The CLI bundles `fast-xml-parser` (`noExternal: ['fast-xml-parser']` in tsup config). The library keeps it external.

### Critical design decisions

**`removeNSPrefix: true` strips xmlns attributes** — fast-xml-parser removes XML namespace declarations from the parsed object, so `detectVersionFromRaw` uses regex on the raw XML string instead of inspecting parsed attributes.

**`exactOptionalPropertyTypes: true`** — all mappers use the assign-after-construction pattern for optional fields: `const el: T = { required }; if (opt !== undefined) el.field = opt;`. Never use spread with optional types.

**biome `noThenProperty: off`** — DMN's `Conditional` interface has a `then` field; biome's suspicious/noThenProperty rule is disabled since this is a legitimate DMN field, not a thenable.

**`EMPTY_LITERAL` sentinel** — `Conditional.if/then/else`, `Filter.in/match`, and `Iterator.in` are required `Expression` fields. When a child element is missing, they fall back to `{ type: 'literalExpression' }`.

**O(1) index** — every element with an `@id` calls `ctx.index.set(id, el)` during mapping. The resulting `model.index` is a `Map<string, unknown>` for fast lookups.

**`ARRAY_TAGS` set** — fast-xml-parser's `isArray` callback uses this set so repeated elements are always arrays, even when only one appears. Mappers always call `asRecordArray()` and never need to check for single-object vs array.

### Normalizations

| Input | Normalized to |
|-------|--------------|
| `hitPolicy` absent | `"UNIQUE"` |
| `hitPolicy="unique"` | `"UNIQUE"` (uppercase) |
| `preferredOrientation` absent | `"Rule-as-Row"` |
| `isCollection="false"` | `false` (boolean) — `itemDefinition`, `itemComponent`, `inputData` |
| `isCollection="true"` | `true` (boolean) — `itemDefinition`, `itemComponent`, `inputData` |
| Empty `<inputEntry>` text | `"-"` (wildcard) |
| CDATA `<![CDATA[> 5]]>` | `&gt; 5` (via preprocessXml) |
| BOM `﻿` | removed |
| DMNDI section | removed entirely |
| `extensionElements` | removed entirely |
| `kind` absent on functionDefinition | `"FEEL"` |
| `textFormat` absent | `"text/plain"` |
| `associationDirection` absent | `"None"` |
| `KnowledgeSource` `<type>` child element | promoted to `type` field (also reads `@type` attribute) |

### Changeset and commit conventions

Conventional Commits enforced. Every PR with source changes needs `pnpm changeset`. Use `[skip changeset]` for docs/chore-only PRs.
