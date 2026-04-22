import { describe, expect, it } from 'vitest';
import { parse } from '../parse.js';
import { EDGE_DEFAULT_HITPOLICY, EDGE_WILDCARD_EMPTY, SIMPLE_DECISION } from '../test-fixtures.js';
import type { DecisionTable } from '../types.js';

describe('mapDecisionTable', () => {
  it('maps hitPolicy, inputs, outputs, rules', () => {
    const model = parse(SIMPLE_DECISION);
    const expr = model.decisions[0]!.expression as DecisionTable;
    expect(expr.type).toBe('decisionTable');
    expect(expr.hitPolicy).toBe('UNIQUE');
    expect(expr.inputs).toHaveLength(1);
    expect(expr.outputs).toHaveLength(1);
    expect(expr.rules).toHaveLength(2);
  });

  it('defaults hitPolicy to UNIQUE when absent', () => {
    const model = parse(EDGE_DEFAULT_HITPOLICY);
    const expr = model.decisions[0]!.expression as DecisionTable;
    expect(expr.hitPolicy).toBe('UNIQUE');
  });

  it('defaults preferredOrientation to Rule-as-Row', () => {
    const model = parse(SIMPLE_DECISION);
    const expr = model.decisions[0]!.expression as DecisionTable;
    expect(expr.preferredOrientation).toBe('Rule-as-Row');
  });

  it('maps inputExpression text', () => {
    const model = parse(SIMPLE_DECISION);
    const expr = model.decisions[0]!.expression as DecisionTable;
    expect(expr.inputs[0]!.inputExpression.text).toBe('score');
  });

  it('normalizes empty inputEntry to "-"', () => {
    const model = parse(EDGE_WILDCARD_EMPTY);
    const expr = model.decisions[0]!.expression as DecisionTable;
    expect(expr.rules[0]!.inputEntries[0]!.text).toBe('-');
  });

  it('registers rules in the index', () => {
    const model = parse(SIMPLE_DECISION);
    expect(model.index.has('r1')).toBe(true);
    expect(model.index.has('r2')).toBe(true);
  });
});
