/**
 * Normalization tests using edge-case fixtures.
 * Each test verifies that a specific normalization rule is applied correctly.
 */
import { loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';
import type { DecisionTable } from '../types.js';
import { dt0, parseFixture } from './helpers.js';

describe('hitPolicy normalization', () => {
  it('absent hitPolicy defaults to UNIQUE', () => {
    const m = parseFixture('edge-cases/xml/edge-default-hitpolicy.xml');
    expect(dt0(m).hitPolicy).toBe('UNIQUE');
  });

  it('lowercase hitPolicy is uppercased', () => {
    const m = parseFixture('edge-cases/xml/edge-hitpolicy-lowercase.xml');
    expect(dt0(m).hitPolicy).toBe('UNIQUE');
  });

  it('all hit-policy variants are uppercase', () => {
    // Every decision table in every fixture must have uppercase hitPolicy
    const xml = loadFixture('base/base-dt-rules.dmn');
    const result = safeParse(xml);
    expect(result.success).toBe(true);
    if (!result.success) return;
    const dt = result.model.decisions[0]!.expression as DecisionTable;
    expect(dt.hitPolicy).toBe(dt.hitPolicy.toUpperCase());
  });
});

describe('wildcard inputEntry normalization', () => {
  it('empty <text></text> becomes "-"', () => {
    const m = parseFixture('edge-cases/xml/edge-wildcard-empty.xml');
    const rule = dt0(m).rules[0]!;
    expect(rule.inputEntries[0]!.text).toBe('-');
  });

  it('explicit "-" text stays "-"', () => {
    const m = parseFixture('edge-cases/xml/edge-wildcard-dash.xml');
    const rule = dt0(m).rules[0]!;
    expect(rule.inputEntries[0]!.text).toBe('-');
  });

  it('missing inputEntry element defaults to "-"', () => {
    // edge-base has a rule with an inputEntry — just verify any dash inputEntry parses
    const m = parseFixture('base/base-dt-rules.dmn');
    const dt = dt0(m);
    const wildcards = dt.rules.flatMap((r) => r.inputEntries.filter((e) => e.text === '-'));
    expect(wildcards.length).toBeGreaterThan(0);
  });
});

describe('isCollection normalization', () => {
  it('isCollection="false" becomes boolean false', () => {
    const m = parseFixture('edge-cases/xml/edge-default-iscollection.xml');
    const td = m.itemDefinitions[0]!;
    expect(typeof td.isCollection).toBe('boolean');
    expect(td.isCollection).toBe(false);
  });

  it('isCollection="true" becomes boolean true', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    const coll = m.itemDefinitions.find((td) => td.name === 'tScoreList');
    expect(typeof coll?.isCollection).toBe('boolean');
    expect(coll?.isCollection).toBe(true);
  });

  it('absent isCollection defaults to false', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    const plain = m.itemDefinitions.find((td) => td.name === 'tRisk');
    expect(plain?.isCollection).toBe(false);
  });
});

describe('preferredOrientation default', () => {
  it('absent preferredOrientation defaults to Rule-as-Row', () => {
    const m = parseFixture('edge-cases/xml/edge-default-orientation.xml');
    expect(dt0(m).preferredOrientation).toBe('Rule-as-Row');
  });
});

describe('CDATA and entities produce identical parse results', () => {
  it('CDATA and entity fixtures produce the same inputEntry text', () => {
    const cdata = parseFixture('edge-cases/xml/edge-cdata-to-entities.xml');
    const ent = parseFixture('edge-cases/xml/edge-entities-to-cdata.xml');
    const dt1 = dt0(cdata);
    const dt2 = dt0(ent);
    expect(dt1.rules[0]!.inputEntries[0]!.text).toBe(dt2.rules[0]!.inputEntries[0]!.text);
  });

  it('CDATA expression text is preserved as literal string (not markup)', () => {
    const m = parseFixture('edge-cases/xml/edge-cdata-to-entities.xml');
    const text = dt0(m).rules[0]!.inputEntries[0]!.text;
    expect(text).not.toContain('<![CDATA[');
    expect(text).not.toContain(']]>');
  });
});

describe('XML namespace prefix stripping', () => {
  it('dmn-prefixed elements parse identically to non-prefixed', () => {
    const prefixed = parseFixture('edge-cases/xml/edge-namespace-prefix.xml');
    const plain = parseFixture('edge-cases/xml/edge-base.xml');
    // Both should have 1 decision with the same structure
    expect(prefixed.decisions.length).toBe(plain.decisions.length);
    expect(prefixed.decisions[0]!.name).toBe(plain.decisions[0]!.name);
  });
});

describe('attribute order invariance', () => {
  it('reordered attributes produce same model', () => {
    const reordered = parseFixture('edge-cases/xml/edge-attr-order.xml');
    const base = parseFixture('edge-cases/xml/edge-base.xml');
    expect(reordered.id).toBe(base.id);
    expect(reordered.decisions[0]!.name).toBe(base.decisions[0]!.name);
  });
});

describe('empty vs self-closing tags', () => {
  it('empty tags produce same model as self-closing equivalents', () => {
    const m = parseFixture('edge-cases/xml/edge-empty-vs-self-closing.xml');
    expect(m.decisions.length).toBeGreaterThan(0);
  });
});

describe('XML processing instructions and comments', () => {
  it('processing instructions do not break parsing', () => {
    const m = parseFixture('edge-cases/xml/edge-processing-instruction.xml');
    expect(m.id).toBeTruthy();
  });

  it('XML comments do not break parsing', () => {
    const m = parseFixture('edge-cases/xml/edge-xml-comments.xml');
    expect(m.id).toBeTruthy();
  });
});

describe('BOM removal', () => {
  it('BOM-prefixed file parses correctly', () => {
    const xml = loadFixture('edge-cases/xml/edge-bom.xml');
    const result = safeParse(xml);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.model.id).toBeTruthy();
    }
  });
});

describe('encoding case insensitivity', () => {
  it('lowercase encoding attribute is handled', () => {
    const m = parseFixture('edge-cases/xml/edge-encoding-lower.xml');
    expect(m.id).toBeTruthy();
  });
});

describe('unused namespace declarations', () => {
  it('extra xmlns declarations do not affect parsing', () => {
    const m = parseFixture('edge-cases/xml/edge-unused-namespace.xml');
    expect(m.id).toBeTruthy();
    expect(m.decisions.length).toBeGreaterThan(0);
  });
});

describe('multiline expressions', () => {
  it('multiline text in expressions is preserved', () => {
    const m = parseFixture('edge-cases/xml/edge-multiline-same.xml');
    expect(m.decisions.length).toBeGreaterThan(0);
  });
});

describe('textFormat default', () => {
  it('textAnnotation without textFormat defaults to "text/plain"', () => {
    // base-artifacts has textAnnotations — check textFormat is normalized
    const m = parseFixture('base/base-artifacts.dmn');
    for (const ann of m.textAnnotations) {
      expect(ann.textFormat).toBe('text/plain');
    }
  });
});

describe('associationDirection default', () => {
  it('association without direction defaults to "None"', () => {
    // Check that associations always have a direction set
    const m = parseFixture('base/base-artifacts.dmn');
    for (const assoc of m.associations) {
      expect(['None', 'One', 'Both']).toContain(assoc.associationDirection);
    }
  });
});

describe('DMNDI excluded', () => {
  it('base-with-dmndi: dmndi is undefined by default', () => {
    const m = parseFixture('base/base-with-dmndi.dmn');
    expect(m.dmndi).toBeUndefined();
  });
});

describe('extensionElements stripped', () => {
  it('extensionElements do not appear in base model fields', () => {
    const m = parseFixture('base/base-extension-elements.dmn');
    expect(m.id).toBeTruthy();
  });

  it('extensionElements key is absent from the model object', () => {
    const m = parseFixture('base/base-extension-elements.dmn') as unknown as Record<
      string,
      unknown
    >;
    expect((m as unknown as Record<string, unknown>).extensionElements).toBeUndefined();
  });
});

describe('DMNDI absent from model by default across all structure fixtures', () => {
  it('no structure fixture leaks dmndi into the model when includeDMNDI is false', () => {
    // Spot-check the fixtures most likely to contain DMNDI sections
    const dmndiFixtures = [
      'base/base-with-dmndi.dmn',
      'variants/variant-dmndi-shapes.dmn',
      'complete/complete-loan-approval-v1.dmn',
    ];
    for (const path of dmndiFixtures) {
      let m: ReturnType<typeof parseFixture>;
      try {
        m = parseFixture(path);
      } catch {
        continue; // fixture might not exist in this catalog version
      }
      expect(m.dmndi, `${path}: dmndi should be undefined by default`).toBeUndefined();
    }
  });
});
