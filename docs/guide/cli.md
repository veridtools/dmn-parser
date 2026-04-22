# CLI reference

## Installation

```bash
npm install -g @veridtools/dmn-parser
```

## Usage

```
dmn-parser <file.dmn> [options]
```

## Options

| Flag | Description |
|---|---|
| `-j, --json` | Output the full DMNModel as formatted JSON |
| `-s, --summary` | Output human-readable summary (default) |
| `-e, --elements` | List all indexed element IDs, one per line |
| `-n, --no-color` | Disable ANSI colors |
| `-h, --help` | Show help |

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Parsed successfully |
| `1` | Parse error or file not found |

## Examples

```bash
# Default summary
dmn-parser loan.dmn

# JSON output (redirect to file)
dmn-parser loan.dmn --json > model.json

# List all element IDs (useful for inspecting large models)
dmn-parser loan.dmn --elements

# No color (for CI logs)
dmn-parser loan.dmn --no-color
```

## Try it locally

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

## Example output

```
loan.dmn
  DMN version:    1.5
  id:             _loan_001
  name:           Loan Approval
  namespace:      https://example.com/loan

  DRG elements
  decisions:               2
  inputData:               1
  businessKnowledgeModels: 1
  knowledgeSources:        0
  decisionServices:        0

  Expressions
  decisionTable: 1
  literalExpression: 1

  itemDefinitions:  3
  imports:          0
  indexed elements: 24
```
