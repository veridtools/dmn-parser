import type { MapContext } from '../context.js';
import type {
  AnnotationClause,
  AnnotationEntry,
  DecisionTable,
  InputClause,
  LiteralExpression,
  OutputClause,
  Rule,
  UnaryTests,
} from '../types.js';
import { AGGREGATIONS, HIT_POLICIES, ORIENTATIONS } from '../types.js';
import { asEnum, asRecord, asRecordArray, asStr } from '../utils.js';

function mapUnaryTests(raw: unknown): UnaryTests {
  const r = asRecord(raw);
  const el: UnaryTests = { text: r ? (asStr(r.text) ?? '-') : '-' };
  if (r) {
    const id = asStr(r['@id']);
    if (id !== undefined) el.id = id;
    const lang = asStr(r['@expressionLanguage']);
    if (lang !== undefined) el.expressionLanguage = lang;
  }
  return el;
}

function mapLiteralExpression(raw: unknown): LiteralExpression {
  const r = asRecord(raw);
  const el: LiteralExpression = { type: 'literalExpression' };
  if (!r) return el;
  const id = asStr(r['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(r['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const lang = asStr(r['@expressionLanguage']);
  if (lang !== undefined) el.expressionLanguage = lang;
  const text = asStr(r.text);
  if (text !== undefined) el.text = text;
  return el;
}

function mapInputClause(r: Record<string, unknown>, ctx: MapContext): InputClause {
  const el: InputClause = { inputExpression: mapLiteralExpression(r.inputExpression) };
  const id = asStr(r['@id']);
  if (id !== undefined) el.id = id;
  const label = asStr(r['@label']);
  if (label !== undefined) el.label = label;
  if (r.inputValues) el.inputValues = mapUnaryTests(r.inputValues);
  if (id) ctx.index.set(id, el);
  return el;
}

function mapOutputClause(r: Record<string, unknown>, ctx: MapContext): OutputClause {
  const el: OutputClause = {};
  const id = asStr(r['@id']);
  if (id !== undefined) el.id = id;
  const name = asStr(r['@name']);
  if (name !== undefined) el.name = name;
  const label = asStr(r['@label']);
  if (label !== undefined) el.label = label;
  const outputLabel = asStr(r['@outputLabel']);
  if (outputLabel !== undefined) el.outputLabel = outputLabel;
  const typeRef = asStr(r['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  if (r.outputValues) el.outputValues = mapUnaryTests(r.outputValues);
  if (r.defaultOutputEntry) el.defaultOutputEntry = mapLiteralExpression(r.defaultOutputEntry);
  if (id) ctx.index.set(id, el);
  return el;
}

function mapRule(r: Record<string, unknown>, ctx: MapContext): Rule {
  const el: Rule = {
    inputEntries: asRecordArray(r.inputEntry).map(mapUnaryTests),
    outputEntries: asRecordArray(r.outputEntry).map(mapLiteralExpression),
    annotationEntries: asRecordArray(r.annotationEntry).map(
      (a) => ({ text: asStr(a.text) ?? '' }) satisfies AnnotationEntry,
    ),
  };
  const id = asStr(r['@id']);
  if (id !== undefined) el.id = id;
  const label = asStr(r['@label']);
  if (label !== undefined) el.label = label;
  const desc = asStr(r['@description']);
  if (desc !== undefined) el.description = desc;
  if (id) ctx.index.set(id, el);
  return el;
}

export function mapDecisionTable(raw: Record<string, unknown>, ctx: MapContext): DecisionTable {
  const el: DecisionTable = {
    type: 'decisionTable',
    hitPolicy: asEnum(HIT_POLICIES, asStr(raw['@hitPolicy']), 'UNIQUE'),
    preferredOrientation: asEnum(ORIENTATIONS, asStr(raw['@preferredOrientation']), 'Rule-as-Row'),
    inputs: asRecordArray(raw.input).map((r) => mapInputClause(r, ctx)),
    outputs: asRecordArray(raw.output).map((r) => mapOutputClause(r, ctx)),
    rules: asRecordArray(raw.rule).map((r) => mapRule(r, ctx)),
    annotations: asRecordArray(raw.annotation).map((r) => {
      const a: AnnotationClause = {};
      const id = asStr(r['@id']);
      if (id !== undefined) a.id = id;
      const name = asStr(r['@name']);
      if (name !== undefined) a.name = name;
      return a;
    }),
  };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const agg = asStr(raw['@aggregation']);
  if (agg !== undefined) el.aggregation = asEnum(AGGREGATIONS, agg, 'SUM');
  const outputLabel = asStr(raw['@outputLabel']);
  if (outputLabel !== undefined) el.outputLabel = outputLabel;
  if (id) ctx.index.set(id, el);
  return el;
}
