export type DMNVersion = '1.1' | '1.2' | '1.3' | '1.4' | '1.5';

export const HIT_POLICIES = [
  'UNIQUE',
  'FIRST',
  'PRIORITY',
  'ANY',
  'COLLECT',
  'RULE ORDER',
  'OUTPUT ORDER',
] as const;
export type HitPolicy = (typeof HIT_POLICIES)[number];

export const AGGREGATIONS = ['SUM', 'MIN', 'MAX', 'COUNT'] as const;
export type Aggregation = (typeof AGGREGATIONS)[number];

export const ORIENTATIONS = ['Rule-as-Row', 'Rule-as-Column', 'CrossTable'] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

export const FUNCTION_KINDS = ['FEEL', 'Java', 'PMML'] as const;
export type FunctionKind = (typeof FUNCTION_KINDS)[number];

export const ITERATOR_TYPES = ['for', 'some', 'every'] as const;
export type IteratorType = (typeof ITERATOR_TYPES)[number];

export const ASSOCIATION_DIRECTIONS = ['None', 'One', 'Both'] as const;
export type AssociationDirection = (typeof ASSOCIATION_DIRECTIONS)[number];

export interface ParseOptions {
  includeDMNDI?: boolean;
  strict?: boolean;
  version?: DMNVersion;
}

export type ParseResult =
  | { success: true; model: DMNModel; warnings: ParseWarning[] }
  | { success: false; errors: ParseError[]; warnings: ParseWarning[] };

export interface ParseWarning {
  code: string;
  message: string;
  path?: string;
}
export interface ParseError {
  code: string;
  message: string;
  path?: string;
}

// Base for DRG-level elements that always have an id
export interface DMNElement {
  id: string;
  label?: string;
  extensionElements?: unknown;
}
export interface DMNElementRef {
  href: string;
}
export interface InformationItem {
  id?: string;
  name: string;
  typeRef?: string;
  label?: string;
}

export interface DMNModel {
  id: string;
  name: string;
  namespace: string;
  dmnVersion: DMNVersion;
  expressionLanguage?: string;
  typeLanguage?: string;
  description?: string;
  exporter?: string;
  exporterVersion?: string;
  decisions: Decision[];
  inputData: InputData[];
  businessKnowledgeModels: BusinessKnowledgeModel[];
  knowledgeSources: KnowledgeSource[];
  decisionServices: DecisionService[];
  itemDefinitions: ItemDefinition[];
  elementCollections: ElementCollection[];
  performanceIndicators: PerformanceIndicator[];
  organizationUnits: OrganizationUnit[];
  textAnnotations: TextAnnotation[];
  associations: Association[];
  groups: Group[];
  imports: Import[];
  dmndi?: DMNDI;
  index: Map<string, unknown>;
}

export interface Decision extends DMNElement {
  name: string;
  description?: string;
  question?: string;
  allowedAnswers?: string;
  variable?: InformationItem;
  expression?: Expression;
  informationRequirements: InformationRequirement[];
  knowledgeRequirements: KnowledgeRequirement[];
  authorityRequirements: AuthorityRequirement[];
  supportedObjectives: DMNElementRef[];
  impactedPerformanceIndicators: DMNElementRef[];
  decisionMakers: DMNElementRef[];
  decisionOwners: DMNElementRef[];
  usingProcesses: DMNElementRef[];
  usingTasks: DMNElementRef[];
}

export interface InputData extends DMNElement {
  name: string;
  description?: string;
  variable?: InformationItem;
}

export interface BusinessKnowledgeModel extends DMNElement {
  name: string;
  description?: string;
  variable?: InformationItem;
  encapsulatedLogic?: FunctionDefinition;
  knowledgeRequirements: KnowledgeRequirement[];
  authorityRequirements: AuthorityRequirement[];
}

export interface KnowledgeSource extends DMNElement {
  name: string;
  description?: string;
  type?: string;
  locationURI?: string;
  owner?: DMNElementRef;
  authorityRequirements: AuthorityRequirement[];
}

export interface DecisionService extends DMNElement {
  name: string;
  description?: string;
  variable?: InformationItem;
  outputDecisions: DMNElementRef[];
  encapsulatedDecisions: DMNElementRef[];
  inputDecisions: DMNElementRef[];
  inputData: DMNElementRef[];
}

export type Expression =
  | LiteralExpression
  | DecisionTable
  | Context
  | Invocation
  | List
  | Relation
  | FunctionDefinition
  | Conditional
  | Filter
  | Iterator;

export interface LiteralExpression {
  type: 'literalExpression';
  id?: string;
  typeRef?: string;
  expressionLanguage?: string;
  text?: string;
}

export interface DecisionTable {
  type: 'decisionTable';
  id?: string;
  hitPolicy: HitPolicy;
  aggregation?: Aggregation;
  preferredOrientation: Orientation;
  outputLabel?: string;
  inputs: InputClause[];
  outputs: OutputClause[];
  rules: Rule[];
  annotations: AnnotationClause[];
}

export interface InputClause {
  id?: string;
  label?: string;
  inputExpression: LiteralExpression;
  inputValues?: UnaryTests;
}

export interface OutputClause {
  id?: string;
  name?: string;
  label?: string;
  typeRef?: string;
  outputValues?: UnaryTests;
  defaultOutputEntry?: LiteralExpression;
}

export interface Rule {
  id?: string;
  label?: string;
  description?: string;
  inputEntries: UnaryTests[];
  outputEntries: LiteralExpression[];
  annotationEntries: AnnotationEntry[];
}

export interface UnaryTests {
  id?: string;
  text: string;
  expressionLanguage?: string;
}
export interface AnnotationClause {
  id?: string;
  name?: string;
}
export interface AnnotationEntry {
  text: string;
}

export interface Context {
  type: 'context';
  id?: string;
  typeRef?: string;
  contextEntries: ContextEntry[];
}

export interface ContextEntry {
  id?: string;
  variable?: InformationItem;
  expression?: Expression;
}

export interface Invocation {
  type: 'invocation';
  id?: string;
  typeRef?: string;
  callee?: LiteralExpression;
  bindings: Binding[];
}

export interface Binding {
  id?: string;
  parameter: InformationItem;
  expression?: Expression;
}

export interface List {
  type: 'list';
  id?: string;
  typeRef?: string;
  elements: Expression[];
}

export interface Relation {
  type: 'relation';
  id?: string;
  typeRef?: string;
  columns: InformationItem[];
  rows: RelationRow[];
}

export interface RelationRow {
  id?: string;
  elements: LiteralExpression[];
}

export interface FunctionDefinition {
  type: 'functionDefinition';
  id?: string;
  typeRef?: string;
  kind: FunctionKind;
  formalParameters: InformationItem[];
  expression?: Expression;
}

export interface Conditional {
  type: 'conditional';
  id?: string;
  typeRef?: string;
  if: Expression;
  then: Expression;
  else: Expression;
}

export interface Filter {
  type: 'filter';
  id?: string;
  typeRef?: string;
  in: Expression;
  match: Expression;
}

export interface Iterator {
  type: 'iterator';
  id?: string;
  typeRef?: string;
  iteratorVariable: string;
  iteratorType: IteratorType;
  in: Expression;
  return?: Expression;
  satisfies?: Expression;
}

export interface ItemDefinition extends DMNElement {
  name: string;
  typeRef?: string;
  isCollection: boolean;
  typeLanguage?: string;
  allowedValues?: UnaryTests;
  typeConstraint?: UnaryTests;
  itemComponents: ItemDefinition[];
  functionItem?: FunctionItem;
}

export interface FunctionItem {
  id?: string;
  outputTypeRef?: string;
  parameters: InformationItem[];
}

export interface InformationRequirement {
  id?: string;
  requiredDecision?: DMNElementRef;
  requiredInput?: DMNElementRef;
}
export interface KnowledgeRequirement {
  id?: string;
  requiredKnowledge: DMNElementRef;
}
export interface AuthorityRequirement {
  id?: string;
  requiredDecision?: DMNElementRef;
  requiredInput?: DMNElementRef;
  requiredAuthority?: DMNElementRef;
}

export interface TextAnnotation extends DMNElement {
  text: string;
  textFormat: string;
}
export interface Association extends DMNElement {
  associationDirection: AssociationDirection;
  sourceRef: DMNElementRef;
  targetRef: DMNElementRef;
}
export interface Group extends DMNElement {
  name?: string;
}

export interface ElementCollection extends DMNElement {
  name?: string;
  drgElements: DMNElementRef[];
}
export interface PerformanceIndicator extends DMNElement {
  name: string;
  description?: string;
  uri?: string;
  impactingDecisions: DMNElementRef[];
}
export interface OrganizationUnit extends DMNElement {
  name: string;
  description?: string;
  decisionMade: DMNElementRef[];
  decisionOwned: DMNElementRef[];
}

export interface Import {
  id?: string;
  name: string;
  namespace?: string;
  locationURI?: string;
  importType: string;
}

export interface DMNDI {
  diagrams: unknown[];
}
