import { describe, expect, it } from 'vitest';
import { parse } from '../parse.js';
import {
  BKM_DEFINITION,
  CONTEXT_EXPRESSION,
  EDGE_CDATA,
  LITERAL_EXPRESSION,
} from '../test-fixtures.js';
import type { Context, FunctionDefinition, LiteralExpression } from '../types.js';

describe('mapLiteralExpression', () => {
  it('maps text content', () => {
    const model = parse(LITERAL_EXPRESSION);
    const expr = model.decisions[0]!.expression as LiteralExpression;
    expect(expr.type).toBe('literalExpression');
    expect(expr.text).toBe('age * 10');
    expect(expr.typeRef).toBe('number');
  });

  it('CDATA and entities produce same text', () => {
    const model = parse(EDGE_CDATA);
    const expr = model.decisions[0]!.expression as LiteralExpression;
    expect(expr.text).toBe('score > 700');
  });
});

describe('mapContext', () => {
  it('maps context entries with variables', () => {
    const model = parse(CONTEXT_EXPRESSION);
    const ctx = model.decisions[0]!.expression as Context;
    expect(ctx.type).toBe('context');
    expect(ctx.contextEntries).toHaveLength(1);
    expect(ctx.contextEntries[0]!.variable?.name).toBe('score');
  });

  it('maps nested literal expression in context entry', () => {
    const model = parse(CONTEXT_EXPRESSION);
    const ctx = model.decisions[0]!.expression as Context;
    const expr = ctx.contextEntries[0]!.expression as LiteralExpression;
    expect(expr.type).toBe('literalExpression');
    expect(expr.text).toBe('age * 2');
  });
});

describe('mapFunctionDefinition (BKM)', () => {
  it('maps encapsulatedLogic as functionDefinition', () => {
    const model = parse(BKM_DEFINITION);
    const bkm = model.businessKnowledgeModels[0]!;
    expect(bkm.encapsulatedLogic?.type).toBe('functionDefinition');
    expect(bkm.encapsulatedLogic?.kind).toBe('FEEL');
  });

  it('maps formalParameters', () => {
    const model = parse(BKM_DEFINITION);
    const fn = model.businessKnowledgeModels[0]!.encapsulatedLogic as FunctionDefinition;
    expect(fn.formalParameters).toHaveLength(1);
    expect(fn.formalParameters[0]!.name).toBe('age');
  });
});
