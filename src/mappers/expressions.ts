import type { MapContext } from '../context.js';
import type {
  Binding,
  Conditional,
  Context,
  ContextEntry,
  Expression,
  Filter,
  FunctionDefinition,
  InformationItem,
  Invocation,
  Iterator,
  List,
  LiteralExpression,
  Relation,
  RelationRow,
} from '../types.js';
import { FUNCTION_KINDS, ITERATOR_TYPES } from '../types.js';
import { asEnum, asRecord, asRecordArray, asStr } from '../utils.js';
import { mapDecisionTable } from './decisionTable.js';

const EMPTY_LITERAL: LiteralExpression = { type: 'literalExpression' };

export function mapLiteralExpression(
  raw: Record<string, unknown>,
  ctx?: MapContext,
): LiteralExpression {
  const el: LiteralExpression = { type: 'literalExpression' };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const lang = asStr(raw['@expressionLanguage']);
  if (lang !== undefined) el.expressionLanguage = lang;
  const text = asStr(raw.text);
  if (text !== undefined) el.text = text;
  if (id && ctx) ctx.index.set(id, el);
  return el;
}

function mapInfoItem(raw: Record<string, unknown>): InformationItem {
  const el: InformationItem = { name: asStr(raw['@name']) ?? '' };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const label = asStr(raw['@label']);
  if (label !== undefined) el.label = label;
  return el;
}

export function mapExpression(
  parent: Record<string, unknown>,
  ctx: MapContext,
): Expression | undefined {
  const dtRaw = asRecord(parent.decisionTable);
  if (dtRaw) return mapDecisionTable(dtRaw, ctx);
  // literalExpression is in ARRAY_TAGS so it's always an array — take first element
  const leRaw = asRecordArray(parent.literalExpression)[0] ?? asRecord(parent.literalExpression);
  if (leRaw) return mapLiteralExpression(leRaw, ctx);
  const ctxRaw = asRecord(parent.context);
  if (ctxRaw) return mapContext(ctxRaw, ctx);
  const invRaw = asRecord(parent.invocation);
  if (invRaw) return mapInvocation(invRaw, ctx);
  const listRaw = asRecord(parent.list);
  if (listRaw) return mapList(listRaw, ctx);
  const relRaw = asRecord(parent.relation);
  if (relRaw) return mapRelation(relRaw, ctx);
  const fnRaw = asRecord(parent.functionDefinition) ?? asRecord(parent.encapsulatedLogic);
  if (fnRaw) return mapFunctionDefinition(fnRaw, ctx);
  const condRaw = asRecord(parent.conditional);
  if (condRaw) return mapConditional(condRaw, ctx);
  const filtRaw = asRecord(parent.filter);
  if (filtRaw) return mapFilter(filtRaw, ctx);
  const iterRaw = asRecord(parent.iterator);
  if (iterRaw) return mapIterator(iterRaw, ctx);
  return undefined;
}

function mapContext(raw: Record<string, unknown>, ctx: MapContext): Context {
  const el: Context = {
    type: 'context',
    contextEntries: asRecordArray(raw.contextEntry).map((e) => mapContextEntry(e, ctx)),
  };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  if (id) ctx.index.set(id, el);
  return el;
}

function mapContextEntry(raw: Record<string, unknown>, ctx: MapContext): ContextEntry {
  const el: ContextEntry = {};
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const varRaw = asRecord(raw.variable);
  if (varRaw) el.variable = mapInfoItem(varRaw);
  const expr = mapExpression(raw, ctx);
  if (expr !== undefined) el.expression = expr;
  if (id) ctx.index.set(id, el);
  return el;
}

function mapInvocation(raw: Record<string, unknown>, ctx: MapContext): Invocation {
  const el: Invocation = {
    type: 'invocation',
    bindings: asRecordArray(raw.binding).map((b) => mapBinding(b, ctx)),
  };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const calleeRaw =
    asRecord(raw.callee) ??
    asRecordArray(raw.literalExpression)[0] ??
    asRecord(raw.literalExpression);
  if (calleeRaw) el.callee = mapLiteralExpression(calleeRaw, ctx);
  if (id) ctx.index.set(id, el);
  return el;
}

function mapBinding(raw: Record<string, unknown>, ctx: MapContext): Binding {
  const paramRaw = asRecord(raw.parameter) ?? {};
  const el: Binding = { parameter: mapInfoItem(paramRaw) };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const expr = mapExpression(raw, ctx);
  if (expr !== undefined) el.expression = expr;
  if (id) ctx.index.set(id, el);
  return el;
}

function mapList(raw: Record<string, unknown>, ctx: MapContext): List {
  const elements: Expression[] = [];
  const EXPR_TAGS = [
    'literalExpression',
    'decisionTable',
    'context',
    'invocation',
    'list',
    'relation',
    'functionDefinition',
    'conditional',
    'filter',
    'iterator',
  ];
  for (const tag of EXPR_TAGS) {
    for (const child of asRecordArray(raw[tag])) {
      const mapped = mapExpression({ [tag]: child }, ctx);
      if (mapped) elements.push(mapped);
    }
  }
  for (const child of asRecordArray(raw.expression)) {
    const mapped = mapExpression(child, ctx);
    if (mapped) elements.push(mapped);
  }
  const el: List = { type: 'list', elements };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  if (id) ctx.index.set(id, el);
  return el;
}

function mapRelation(raw: Record<string, unknown>, ctx: MapContext): Relation {
  const el: Relation = {
    type: 'relation',
    columns: asRecordArray(raw.column).map(mapInfoItem),
    rows: asRecordArray(raw.row).map((r) => mapRelationRow(r, ctx)),
  };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  if (id) ctx.index.set(id, el);
  return el;
}

function mapRelationRow(raw: Record<string, unknown>, ctx: MapContext): RelationRow {
  // DMN 1.1-1.2 wrap cells in <expression><literalExpression>; DMN 1.3+ use direct <literalExpression>
  const fromWrapped = asRecordArray(raw.expression).map((e) => {
    const leRaw = asRecordArray(e.literalExpression)[0] ?? asRecord(e.literalExpression);
    return leRaw ? mapLiteralExpression(leRaw, ctx) : EMPTY_LITERAL;
  });
  const fromDirect = asRecordArray(raw.literalExpression).map((leRaw) =>
    mapLiteralExpression(leRaw, ctx),
  );
  const el: RelationRow = { elements: fromWrapped.length > 0 ? fromWrapped : fromDirect };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  if (id) ctx.index.set(id, el);
  return el;
}

export function mapFunctionDefinition(
  raw: Record<string, unknown>,
  ctx: MapContext,
): FunctionDefinition {
  const el: FunctionDefinition = {
    type: 'functionDefinition',
    kind: asEnum(FUNCTION_KINDS, asStr(raw['@kind']), 'FEEL'),
    formalParameters: asRecordArray(raw.formalParameter).map(mapInfoItem),
  };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const expr = mapExpression(raw, ctx);
  if (expr !== undefined) el.expression = expr;
  if (id) ctx.index.set(id, el);
  return el;
}

function mapConditional(raw: Record<string, unknown>, ctx: MapContext): Conditional {
  const ifRaw = asRecord(raw.if);
  const thenRaw = asRecord(raw.then);
  const elseRaw = asRecord(raw.else);
  const el: Conditional = {
    type: 'conditional',
    if: (ifRaw ? mapExpression(ifRaw, ctx) : undefined) ?? EMPTY_LITERAL,
    then: (thenRaw ? mapExpression(thenRaw, ctx) : undefined) ?? EMPTY_LITERAL,
    else: (elseRaw ? mapExpression(elseRaw, ctx) : undefined) ?? EMPTY_LITERAL,
  };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  if (id) ctx.index.set(id, el);
  return el;
}

function mapFilter(raw: Record<string, unknown>, ctx: MapContext): Filter {
  const inRaw = asRecord(raw.in);
  const matchRaw = asRecord(raw.match);
  const el: Filter = {
    type: 'filter',
    in: (inRaw ? mapExpression(inRaw, ctx) : undefined) ?? EMPTY_LITERAL,
    match: (matchRaw ? mapExpression(matchRaw, ctx) : undefined) ?? EMPTY_LITERAL,
  };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  if (id) ctx.index.set(id, el);
  return el;
}

function mapIterator(raw: Record<string, unknown>, ctx: MapContext): Iterator {
  const inRaw = asRecord(raw.in);
  // iteratorType can be an attribute (@iteratorType) or a child element (<iteratorType>)
  const iteratorType = asEnum(
    ITERATOR_TYPES,
    asStr(raw['@iteratorType']) ?? asStr(raw.iteratorType),
    'for',
  );
  const el: Iterator = {
    type: 'iterator',
    iteratorVariable: asStr(raw['@iteratorVariable']) ?? '',
    iteratorType,
    in: (inRaw ? mapExpression(inRaw, ctx) : undefined) ?? EMPTY_LITERAL,
  };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const returnRaw = asRecord(raw.return);
  if (returnRaw && iteratorType === 'for')
    el.return = mapExpression(returnRaw, ctx) ?? EMPTY_LITERAL;
  const satisfiesRaw = asRecord(raw.satisfies);
  if (satisfiesRaw && iteratorType !== 'for')
    el.satisfies = mapExpression(satisfiesRaw, ctx) ?? EMPTY_LITERAL;
  if (id) ctx.index.set(id, el);
  return el;
}
