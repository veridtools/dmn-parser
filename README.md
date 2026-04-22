# @veridtools/dmn-parser

DMN XML parser — typed, normalized, DMN 1.1 to 1.5.

Converts any DMN file into a typed TypeScript model with a single function call.
Used by `@verid/dmn-diff`, `@verid/dmn-runner`, `@verid/dmn-lint`, and `@verid/dmn-fmt`.

## Install

```bash
npm install @veridtools/dmn-parser
```

## Usage

```typescript
import { parse } from '@veridtools/dmn-parser'
import { readFileSync } from 'fs'

const model = parse(readFileSync('my-model.dmn', 'utf-8'))

console.log(model.dmnVersion)              // '1.5'
console.log(model.decisions[0].name)       // 'Loan Approval'
console.log(model.decisions[0].expression) // DecisionTable | LiteralExpression | ...
```

## Safe parse

```typescript
import { safeParse } from '@veridtools/dmn-parser'

const result = safeParse(xml)
if (result.success) {
  const { model } = result
} else {
  console.error(result.errors[0]?.message)
}
```

## CLI

```bash
# Global install
npm install -g @veridtools/dmn-parser

# Parse and show summary
dmn-parser my-model.dmn

# Full JSON output
dmn-parser my-model.dmn --json

# List indexed element IDs
dmn-parser my-model.dmn --elements
```

### Try it locally

Clone the repo and run against the bundled examples:

```bash
git clone https://github.com/veridtools/dmn-parser
cd dmn-parser
pnpm install
npx tsx bin/dmn-parser.ts src/examples/a.dmn
npx tsx bin/dmn-parser.ts src/examples/b.dmn --json
npx tsx bin/dmn-parser.ts src/examples/c.xml --elements
npx tsx bin/dmn-parser.ts src/examples/d.xml
npx tsx bin/dmn-parser.ts src/examples/e.xml
```

| File | What it shows |
|------|--------------|
| `a.dmn` | DMN 1.5 — decision table, 2 rules |
| `b.dmn` | DMN 1.4 — conditional expression (nested if/then/else) |
| `c.xml` | DMN 1.3 — BKM with invocation |
| `d.xml` | DMN 1.1 — literal expression, itemDefinition |
| `e.xml` | DMN 1.2 — context expression with multiple entries |

## Features

- **Typed**: Every element is a TypeScript interface with full autocomplete
- **Normalized**: hitPolicy → UNIQUE, isCollection → false, CDATA = entities, empty inputEntry → `-`
- **DMN 1.1 → 1.5**: All namespace variants, Conditional/Filter/Iterator (1.4+), typeConstraint (1.5)
- **O(1) index**: `model.index.get(id)` resolves any element instantly
- **safeParse**: Discriminated union — no try/catch needed
- **Single runtime dep**: Only `fast-xml-parser`

## License

MIT
