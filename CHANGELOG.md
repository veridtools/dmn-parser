# @veridtools/dmn-parser

## 0.2.0

### Minor Changes

- 0f37529: Add `outputLabel` to `OutputClause`, `isCollection` to `InputData`, `ImportedValues` interface with `LiteralExpression.importedValues`, fix `PerformanceIndicator.URI` casing, and expand `KnowledgeSource.type` to read child element form. Update `@veridtools/dmn-fixtures` to 0.3.0.

## 0.1.1

### Patch Changes

- 1af0190: chore: update @veridtools/dmn-fixtures to version 0.2.1

## 0.1.0

### Minor Changes

- 317b624: Initial public release of `@veridtools/dmn-parser`.

  Typed, normalized DMN XML parser supporting DMN 1.1 through 1.5. Converts any DMN file into a fully typed TypeScript model with a single function call.

  **Features**

  - `parse(xml)` — returns a typed `DMNModel` or throws on invalid input
  - `safeParse(xml)` — discriminated union result, never throws
  - `detectVersion(xml)` — extracts DMN version from namespace URI
  - O(1) element index via `model.index.get(id)`
  - Full normalization: hit policy defaults, boolean coercion, CDATA handling, BOM removal, DMNDI exclusion
  - Covers all expression types: DecisionTable, LiteralExpression, Context, Invocation, List, Relation, Conditional, Filter, Iterator, FunctionDefinition
  - CLI: `dmn-parser <file> [--json | --elements | --summary | --no-color]`
  - Single runtime dependency: `fast-xml-parser`
