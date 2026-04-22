/**
 * safeParse error-path coverage.
 * Verifies that safeParse never throws and returns success:false for invalid input.
 * Any parse attempt — regardless of input quality — must return a result, never crash.
 */
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';

describe('safeParse — invalid inputs return success:false', () => {
  it('empty string', () => {
    const r = safeParse('');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.errors.length).toBeGreaterThan(0);
  });

  it('plain text (not XML)', () => {
    const r = safeParse('not xml at all');
    expect(r.success).toBe(false);
  });

  it('valid XML but not DMN (no DMN namespace)', () => {
    const r = safeParse('<root><child/></root>');
    expect(r.success).toBe(false);
  });

  it('malformed XML (unclosed tag)', () => {
    const r = safeParse(
      '<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"><decision',
    );
    expect(r.success).toBe(false);
  });

  it('XML with DMN namespace but no definitions element', () => {
    const r = safeParse(
      '<?xml version="1.0"?><notDefinitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"/>',
    );
    expect(r.success).toBe(false);
  });
});

describe('safeParse — valid minimal inputs succeed', () => {
  it('minimal empty definitions element parses without error', () => {
    const r = safeParse(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"' +
        ' id="m" name="Empty" namespace="https://example.com"/>\n',
    );
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.model.id).toBe('m');
    expect(r.model.dmnVersion).toBe('1.5');
    expect(r.model.decisions).toHaveLength(0);
  });

  it('all collections are empty arrays (not undefined) on minimal model', () => {
    const r = safeParse(
      '<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/" id="x" name="X" namespace="ns"/>',
    );
    expect(r.success).toBe(true);
    if (!r.success) return;
    const m = r.model;
    expect(Array.isArray(m.decisions)).toBe(true);
    expect(Array.isArray(m.inputData)).toBe(true);
    expect(Array.isArray(m.businessKnowledgeModels)).toBe(true);
    expect(Array.isArray(m.knowledgeSources)).toBe(true);
    expect(Array.isArray(m.decisionServices)).toBe(true);
    expect(Array.isArray(m.itemDefinitions)).toBe(true);
    expect(Array.isArray(m.textAnnotations)).toBe(true);
    expect(Array.isArray(m.associations)).toBe(true);
    expect(Array.isArray(m.groups)).toBe(true);
    expect(Array.isArray(m.imports)).toBe(true);
  });
});

describe('safeParse — never throws on unexpected input types', () => {
  const badInputs: unknown[] = [null, undefined, 42, {}, []];

  for (const input of badInputs) {
    it(`does not throw for ${JSON.stringify(input)}`, () => {
      expect(() => safeParse(input as string)).not.toThrow();
    });
  }
});
