import { describe, expect, it } from 'vitest';
import { SIMPLE_DECISION } from './test-fixtures.js';
import { detectDmnVersion, parseXml } from './xml.js';

describe('parseXml', () => {
  it('parses valid XML into an object with definitions', () => {
    const result = parseXml(SIMPLE_DECISION);
    expect(result).toHaveProperty('definitions');
  });

  it('coerces single decision into array', () => {
    const raw = parseXml(SIMPLE_DECISION);
    const defs = raw.definitions as Record<string, unknown>;
    expect(Array.isArray(defs.decision)).toBe(true);
  });

  it('coerces single rule into array', () => {
    const raw = parseXml(SIMPLE_DECISION);
    const defs = raw.definitions as Record<string, unknown>;
    const dt = (defs.decision as Array<Record<string, unknown>>)[0]!;
    const table = dt.decisionTable as Record<string, unknown>;
    expect(Array.isArray(table.rule)).toBe(true);
  });
});

describe('detectDmnVersion', () => {
  it('detects DMN 1.5', () => {
    expect(detectDmnVersion(SIMPLE_DECISION)).toBe('1.5');
  });

  it('detects DMN 1.1', () => {
    const xml = `<definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd" id="x" name="x" namespace="x"/>`;
    expect(detectDmnVersion(xml)).toBe('1.1');
  });

  it('returns unknown for unrecognized namespace', () => {
    const xml = `<definitions xmlns="http://example.com/unknown" id="x" name="x" namespace="x"/>`;
    expect(detectDmnVersion(xml)).toBe('unknown');
  });
});
