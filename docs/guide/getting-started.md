# Getting started

## Installation

```bash
npm install @veridtools/dmn-parser
# or
pnpm add @veridtools/dmn-parser
```

For global CLI use:

```bash
npm install -g @veridtools/dmn-parser
```

## CLI quickstart

```bash
dmn-parser my-model.dmn
```

Prints a human-readable summary of the model structure and version.

```bash
# Full model as JSON
dmn-parser my-model.dmn --json

# List all indexed element IDs
dmn-parser my-model.dmn --elements
```

## Programmatic API

```typescript
import { parse } from '@veridtools/dmn-parser'
import { readFileSync } from 'fs'

const xml = readFileSync('my-model.dmn', 'utf-8')
const model = parse(xml)

console.log(model.dmnVersion)     // '1.5'
console.log(model.decisions[0])   // Decision { id, name, expression, ... }
```

## Safe parse (never throws)

```typescript
import { safeParse } from '@veridtools/dmn-parser'

const result = safeParse(xml)
if (result.success) {
  const { model } = result
  console.log(model.decisions.length)
} else {
  console.error(result.errors[0]?.message)
}
```

## Detect version only

```typescript
import { detectVersion } from '@veridtools/dmn-parser'

const version = detectVersion(xml)  // '1.1' | '1.2' | ... | '1.5'
```

## Working with the index

Every element with an `@id` is registered in `model.index` for O(1) lookup:

```typescript
const model = parse(xml)

const decision = model.index.get('myDecisionId')
const rule     = model.index.get('rule_1')

// Resolve an href reference
const ref = decision.informationRequirements[0]?.requiredInput
if (ref) {
  const id = ref.href.replace('#', '')
  const input = model.index.get(id)
}
```

## Inspecting expressions

```typescript
import type { DecisionTable, LiteralExpression } from '@veridtools/dmn-parser'

const expr = model.decisions[0]?.expression
if (!expr) return

switch (expr.type) {
  case 'decisionTable':
    for (const rule of expr.rules) {
      console.log(rule.inputEntries[0]?.text)  // FEEL unary test
    }
    break
  case 'literalExpression':
    console.log(expr.text)  // FEEL expression string
    break
}
```
