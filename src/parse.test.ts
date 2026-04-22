import { describe, expect, it } from 'vitest';
import { detectVersion, parse, safeParse } from './parse.js';
import {
  DMN11_NAMESPACE,
  ITEM_DEFINITION,
  LITERAL_EXPRESSION,
  SIMPLE_DECISION,
} from './test-fixtures.js';

describe('parse', () => {
  it('returns a DMNModel with decisions', () => {
    const model = parse(SIMPLE_DECISION);
    expect(model.decisions).toHaveLength(1);
    expect(model.id).toBe('_def');
    expect(model.name).toBe('Loan');
    expect(model.dmnVersion).toBe('1.5');
  });

  it('populates model.index with all element ids', () => {
    const model = parse(SIMPLE_DECISION);
    expect(model.index.has('d1')).toBe(true);
    expect(model.index.has('dt1')).toBe(true);
    expect(model.index.has('ic1')).toBe(true);
    expect(model.index.has('oc1')).toBe(true);
    expect(model.index.has('r1')).toBe(true);
  });

  it('model.index get returns the same object', () => {
    const model = parse(SIMPLE_DECISION);
    expect(model.index.get('d1')).toBe(model.decisions[0]);
  });

  it('detects DMN 1.1 namespace', () => {
    const model = parse(DMN11_NAMESPACE);
    expect(model.dmnVersion).toBe('1.1');
  });

  it('throws on invalid XML', () => {
    expect(() => parse('not xml')).toThrow();
  });

  it('throws when no definitions element', () => {
    expect(() => parse('<?xml version="1.0"?><root/>')).toThrow(/definitions/i);
  });

  it('returns empty arrays when no DRG elements', () => {
    const model = parse(ITEM_DEFINITION);
    expect(model.decisions).toHaveLength(0);
    expect(model.inputData).toHaveLength(0);
  });
});

describe('safeParse', () => {
  it('returns success:true on valid XML', () => {
    const result = safeParse(SIMPLE_DECISION);
    expect(result.success).toBe(true);
    if (result.success) expect(result.model.decisions).toHaveLength(1);
  });

  it('returns success:false on invalid XML', () => {
    const result = safeParse('not xml at all <unclosed');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('detectVersion', () => {
  it('detects version from XML string', () => {
    expect(detectVersion(SIMPLE_DECISION)).toBe('1.5');
    expect(detectVersion(DMN11_NAMESPACE)).toBe('1.1');
  });

  it('returns 1.5 on error', () => {
    expect(detectVersion('bad xml')).toBe('1.5');
  });
});

describe('parse — namespace field', () => {
  it('maps namespace from @namespace attribute', () => {
    const model = parse(SIMPLE_DECISION);
    expect(model.namespace).toBe('https://test.com');
  });
});

describe('parse — literalExpression shortcut', () => {
  it('maps literal expression at decision level', () => {
    const model = parse(LITERAL_EXPRESSION);
    expect(model.decisions[0]!.expression?.type).toBe('literalExpression');
  });
});
