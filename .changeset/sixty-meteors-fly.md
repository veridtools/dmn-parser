---
"@veridtools/dmn-parser": major
---

Initial public release of `@veridtools/dmn-parser`.

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
