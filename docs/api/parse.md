# parse() — API reference

## parse

```typescript
function parse(xml: string, options?: ParseOptions): DMNModel
```

Parses a DMN XML string. Throws `Error` on malformed XML or missing `<definitions>`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `xml` | `string` | DMN XML content |
| `options` | `ParseOptions` | Optional configuration |

**Returns** `DMNModel`

---

## safeParse

```typescript
function safeParse(xml: string, options?: ParseOptions): ParseResult
```

Never throws. Returns a discriminated union result.

---

## detectVersion

```typescript
function detectVersion(xml: string): DMNVersion
```

Lightweight version detection — does not build a full model.

---

## serialize

```typescript
function serialize(model: DMNModel): string
```

Produces minimal valid XML from a `DMNModel`. Useful for `dmn-fmt`.

---

## ParseOptions

```typescript
interface ParseOptions {
  includeDMNDI?: boolean
  strict?: boolean
  version?: DMNVersion
}
```

---

## ParseResult

```typescript
type ParseResult =
  | { success: true;  model: DMNModel; warnings: ParseWarning[] }
  | { success: false; errors: ParseError[];  warnings: ParseWarning[] }
```

---

## ParseError / ParseWarning

```typescript
interface ParseError   { code: string; message: string; path?: string }
interface ParseWarning { code: string; message: string; path?: string }
```
