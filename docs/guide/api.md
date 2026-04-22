# Programmatic API

## parse()

```typescript
parse(xml: string, options?: ParseOptions): DMNModel
```

Parses a DMN XML string and returns a typed `DMNModel`. Throws on malformed XML or missing `<definitions>` root.

## safeParse()

```typescript
safeParse(xml: string, options?: ParseOptions): ParseResult
```

Never throws. Returns a discriminated union:

```typescript
type ParseResult =
  | { success: true;  model: DMNModel; warnings: ParseWarning[] }
  | { success: false; errors: ParseError[];  warnings: ParseWarning[] }
```

## detectVersion()

```typescript
detectVersion(xml: string): DMNVersion
```

Detects the DMN version from the XML namespace without fully parsing the model. Returns `'1.5'` on error.

## serialize()

```typescript
serialize(model: DMNModel): string
```

Produces a minimal valid XML representation of the model. Intended for round-trip use cases (e.g. `dmn-fmt`). Not a complete serializer — extension elements and DMNDI are not emitted.

## ParseOptions

```typescript
interface ParseOptions {
  includeDMNDI?: boolean  // default: false — DMNDI diagrams stripped by default
  strict?: boolean        // default: false — future: errors vs warnings
  version?: DMNVersion    // force a specific version (overrides namespace detection)
}
```

## Resolving references

```typescript
import { parse } from '@veridtools/dmn-parser'

const model = parse(xml)

// resolve any @id reference in O(1)
const element = model.index.get('myId')

// resolve an href (strips the leading '#')
function resolve(model, href: string) {
  return model.index.get(href.startsWith('#') ? href.slice(1) : href)
}
```
