import { describe, expect, it } from 'vitest';
import { normalizeNode } from './defaults.js';

describe('normalizeNode — decisionTable defaults', () => {
  it('sets hitPolicy to UNIQUE when absent', () => {
    const node: Record<string, unknown> = {};
    normalizeNode(node, 'decisionTable');
    expect(node['@hitPolicy']).toBe('UNIQUE');
  });

  it('preserves explicit hitPolicy', () => {
    const node: Record<string, unknown> = { '@hitPolicy': 'FIRST' };
    normalizeNode(node, 'decisionTable');
    expect(node['@hitPolicy']).toBe('FIRST');
  });

  it('uppercases hitPolicy', () => {
    const node: Record<string, unknown> = { '@hitPolicy': 'collect' };
    normalizeNode(node, 'decisionTable');
    expect(node['@hitPolicy']).toBe('COLLECT');
  });

  it('sets preferredOrientation when absent', () => {
    const node: Record<string, unknown> = {};
    normalizeNode(node, 'decisionTable');
    expect(node['@preferredOrientation']).toBe('Rule-as-Row');
  });
});

describe('normalizeNode — isCollection', () => {
  it('sets isCollection=false when absent', () => {
    const node: Record<string, unknown> = { '@name': 'T' };
    normalizeNode(node, 'itemDefinition');
    expect(node['@isCollection']).toBe(false);
  });

  it('sets isCollection=true for string "true"', () => {
    const node: Record<string, unknown> = { '@isCollection': 'true' };
    normalizeNode(node, 'itemDefinition');
    expect(node['@isCollection']).toBe(true);
  });
});

describe('normalizeNode — inputEntry wildcard', () => {
  it('normalizes empty text to "-"', () => {
    const node: Record<string, unknown> = { text: '' };
    normalizeNode(node, 'inputEntry');
    expect(node.text).toBe('-');
  });

  it('normalizes absent text to "-"', () => {
    const node: Record<string, unknown> = {};
    normalizeNode(node, 'inputEntry');
    expect(node.text).toBe('-');
  });

  it('keeps valid unary test text', () => {
    const node: Record<string, unknown> = { text: '>= 700' };
    normalizeNode(node, 'inputEntry');
    expect(node.text).toBe('>= 700');
  });
});

describe('normalizeNode — field promotion', () => {
  it('lifts typeRef child element to @typeRef attribute', () => {
    const node: Record<string, unknown> = { typeRef: 'string' };
    normalizeNode(node, 'variable');
    expect(node['@typeRef']).toBe('string');
    expect(node.typeRef).toBeUndefined();
  });

  it('does not override existing @typeRef', () => {
    const node: Record<string, unknown> = { typeRef: 'string', '@typeRef': 'number' };
    normalizeNode(node, 'variable');
    expect(node['@typeRef']).toBe('number');
  });
});

describe('normalizeNode — textAnnotation default', () => {
  it('sets textFormat to text/plain when absent', () => {
    const node: Record<string, unknown> = {};
    normalizeNode(node, 'textAnnotation');
    expect(node['@textFormat']).toBe('text/plain');
  });
});
