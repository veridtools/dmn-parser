# Types — API reference

All types are exported from `@veridtools/dmn-parser`.

## DMNModel

The root object returned by `parse()`.

```typescript
interface DMNModel {
  id: string
  name: string
  namespace: string
  dmnVersion: DMNVersion
  expressionLanguage?: string
  typeLanguage?: string
  description?: string
  decisions: Decision[]
  inputData: InputData[]
  businessKnowledgeModels: BusinessKnowledgeModel[]
  knowledgeSources: KnowledgeSource[]
  decisionServices: DecisionService[]
  itemDefinitions: ItemDefinition[]
  elementCollections: ElementCollection[]
  performanceIndicators: PerformanceIndicator[]
  organizationUnits: OrganizationUnit[]
  textAnnotations: TextAnnotation[]
  associations: Association[]
  groups: Group[]
  imports: Import[]
  dmndi?: DMNDI
  index: Map<string, unknown>
}
```

## Expression (union)

```typescript
type Expression =
  | LiteralExpression | DecisionTable | Context | Invocation
  | List | Relation | FunctionDefinition
  | Conditional | Filter | Iterator
```

Each expression has a `type` discriminant for pattern matching:

```typescript
switch (expr.type) {
  case 'decisionTable':     // DecisionTable
  case 'literalExpression': // LiteralExpression
  case 'context':           // Context
  case 'invocation':        // Invocation
  case 'list':              // List
  case 'relation':          // Relation
  case 'functionDefinition':// FunctionDefinition
  case 'conditional':       // Conditional (DMN 1.4+)
  case 'filter':            // Filter (DMN 1.4+)
  case 'iterator':          // Iterator (DMN 1.4+)
}
```

## Enums

```typescript
type DMNVersion  = '1.1' | '1.2' | '1.3' | '1.4' | '1.5'
type HitPolicy   = 'UNIQUE' | 'FIRST' | 'PRIORITY' | 'ANY' | 'COLLECT' | 'RULE ORDER' | 'OUTPUT ORDER'
type Aggregation = 'SUM' | 'MIN' | 'MAX' | 'COUNT'
type Orientation = 'Rule-as-Row' | 'Rule-as-Column' | 'CrossTable'
type FunctionKind = 'FEEL' | 'Java' | 'PMML'
type IteratorType = 'for' | 'some' | 'every'
type AssociationDirection = 'None' | 'One' | 'Both'
```

## LiteralExpression

```typescript
interface LiteralExpression {
  type: 'literalExpression'
  id?: string
  typeRef?: string
  expressionLanguage?: string
  text?: string
  importedValues?: ImportedValues
}

interface ImportedValues {
  id?: string
  importedElement?: string
  expressionLanguage?: string
}
```

## DecisionTable

```typescript
interface DecisionTable {
  type: 'decisionTable'
  id?: string
  hitPolicy: HitPolicy          // default: 'UNIQUE'
  aggregation?: Aggregation
  preferredOrientation: Orientation  // default: 'Rule-as-Row'
  inputs: InputClause[]
  outputs: OutputClause[]
  rules: Rule[]
  annotations: AnnotationClause[]
}
```

## InputClause / OutputClause

```typescript
interface InputClause {
  id?: string
  label?: string
  inputExpression: LiteralExpression
  inputValues?: UnaryTests
}

interface OutputClause {
  id?: string
  name?: string
  label?: string
  outputLabel?: string
  typeRef?: string
  outputValues?: UnaryTests
  defaultOutputEntry?: LiteralExpression
}
```

## InputData

```typescript
interface InputData extends DMNElement {
  name: string
  description?: string
  isCollection?: boolean
  variable?: InformationItem
}
```

## KnowledgeSource

```typescript
interface KnowledgeSource extends DMNElement {
  name: string
  description?: string
  type?: string        // read from <type> child element or @type attribute
  locationURI?: string
  owner?: DMNElementRef
  authorityRequirements: AuthorityRequirement[]
}
```

## PerformanceIndicator

```typescript
interface PerformanceIndicator extends DMNElement {
  name: string
  description?: string
  URI?: string         // maps to XML attribute URI="..."
  impactingDecisions: DMNElementRef[]
}
```

## Rule

```typescript
interface Rule {
  id?: string
  label?: string
  inputEntries: UnaryTests[]     // text '-' = wildcard
  outputEntries: LiteralExpression[]
  annotationEntries: AnnotationEntry[]
}
```

## UnaryTests

```typescript
interface UnaryTests {
  id?: string
  text: string  // FEEL unary test; '-' = wildcard (always normalized)
  expressionLanguage?: string
}
```

## ItemDefinition

```typescript
interface ItemDefinition extends DMNElement {
  name: string
  typeRef?: string
  isCollection: boolean          // default: false
  typeLanguage?: string
  allowedValues?: UnaryTests
  typeConstraint?: UnaryTests    // DMN 1.5
  itemComponents: ItemDefinition[]
  functionItem?: FunctionItem
}
```
