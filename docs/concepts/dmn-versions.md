# DMN versions

`@veridtools/dmn-parser` supports DMN 1.1 through 1.5. The version is detected automatically from the XML namespace declared in `<definitions>`.

## Namespace map

| Version | Namespace |
|---|---|
| 1.1 | `http://www.omg.org/spec/DMN/20151101/dmn.xsd` |
| 1.1 | `http://www.omg.org/spec/DMN/20151101/MODEL/` |
| 1.2 | `http://www.omg.org/spec/DMN/20180521/MODEL/` |
| 1.3 | `https://www.omg.org/spec/DMN/20191111/MODEL/` |
| 1.4 | `https://www.omg.org/spec/DMN/20211108/MODEL/` |
| 1.5 | `https://www.omg.org/spec/DMN/20230324/MODEL/` |

## Version-specific features

### DMN 1.4
- `Conditional` expression (`if/then/else`)
- `Filter` expression (`list[condition]`)
- `Iterator` expression (`for/some/every`)

### DMN 1.5
- `typeConstraint` on `ItemDefinition`
- BKM `variable.typeRef` is optional (DMN15-74)
- Alternative `InputData` representation (DMN15-117)

## Force a version

If the file uses an unrecognized namespace, you can override detection:

```typescript
import { parse } from '@veridtools/dmn-parser'

const model = parse(xml, { version: '1.3' })
```
