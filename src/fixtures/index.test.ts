/**
 * Index completeness tests.
 * Every element with an @id must appear in model.index mapped to itself.
 */
import { CATALOG, loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';
import type {
  Context,
  DecisionTable,
  FunctionDefinition,
  Invocation,
  Iterator,
  List,
  Relation,
} from '../types.js';
import { parseFixture } from './helpers.js';

describe('index — basic element types', () => {
  it('decisions are indexed by id', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    for (const d of m.decisions) {
      expect(m.index.has(d.id)).toBe(true);
      expect(m.index.get(d.id)).toBe(d);
    }
  });

  it('inputData elements are indexed', () => {
    const m = parseFixture('base/base-input-data.dmn');
    for (const id of m.inputData) {
      expect(m.index.has(id.id)).toBe(true);
    }
  });

  it('businessKnowledgeModels are indexed', () => {
    const m = parseFixture('base/base-bkm.dmn');
    for (const bkm of m.businessKnowledgeModels) {
      expect(m.index.has(bkm.id)).toBe(true);
    }
  });

  it('knowledgeSources are indexed', () => {
    const m = parseFixture('base/base-knowledge-source.dmn');
    for (const ks of m.knowledgeSources) {
      expect(m.index.has(ks.id)).toBe(true);
    }
  });

  it('decisionServices are indexed', () => {
    const m = parseFixture('base/base-decision-service.dmn');
    for (const ds of m.decisionServices) {
      expect(m.index.has(ds.id)).toBe(true);
    }
  });

  it('itemDefinitions are indexed', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    for (const td of m.itemDefinitions) {
      expect(m.index.has(td.id)).toBe(true);
    }
  });

  it('textAnnotations are indexed', () => {
    const m = parseFixture('base/base-artifacts.dmn');
    for (const ann of m.textAnnotations) {
      expect(m.index.has(ann.id)).toBe(true);
    }
  });

  it('associations are indexed', () => {
    const m = parseFixture('base/base-artifacts.dmn');
    for (const assoc of m.associations) {
      expect(m.index.has(assoc.id)).toBe(true);
    }
  });

  it('performanceIndicators are indexed', () => {
    const m = parseFixture('base/base-business-context.dmn');
    for (const pi of m.performanceIndicators) {
      expect(m.index.has(pi.id)).toBe(true);
    }
  });

  it('organizationUnits are indexed', () => {
    const m = parseFixture('base/base-business-context.dmn');
    for (const ou of m.organizationUnits) {
      expect(m.index.has(ou.id)).toBe(true);
    }
  });
});

describe('index — expression sub-elements', () => {
  it('literalExpression id is indexed', () => {
    const m = parseFixture('base/base-literal-expression.dmn');
    const d = m.decisions[0]!;
    const expr = d.expression!;
    if (expr.type === 'literalExpression' && expr.id) {
      expect(m.index.has(expr.id)).toBe(true);
    }
  });

  it('decisionTable id is indexed', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    const dt = m.decisions[0]!.expression as DecisionTable;
    if (dt.id) expect(m.index.has(dt.id)).toBe(true);
  });

  it('inputClause ids are indexed', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    const dt = m.decisions[0]!.expression as DecisionTable;
    for (const inp of dt.inputs) {
      if (inp.id) expect(m.index.has(inp.id)).toBe(true);
    }
  });

  it('outputClause ids are indexed', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    const dt = m.decisions[0]!.expression as DecisionTable;
    for (const out of dt.outputs) {
      if (out.id) expect(m.index.has(out.id)).toBe(true);
    }
  });

  it('rule ids are indexed', () => {
    const m = parseFixture('base/base-dt-rules.dmn');
    const dt = m.decisions[0]!.expression as DecisionTable;
    for (const rule of dt.rules) {
      if (rule.id) expect(m.index.has(rule.id)).toBe(true);
    }
  });

  it('context id is indexed', () => {
    const m = parseFixture('base/base-context.dmn');
    const ctx = m.decisions[0]!.expression as Context;
    if (ctx.id) expect(m.index.has(ctx.id)).toBe(true);
  });

  it('contextEntry ids are indexed', () => {
    const m = parseFixture('base/base-context.dmn');
    const ctx = m.decisions[0]!.expression as Context;
    for (const ce of ctx.contextEntries) {
      if (ce.id) expect(m.index.has(ce.id)).toBe(true);
    }
  });

  it('relation id is indexed', () => {
    const m = parseFixture('base/base-relation.dmn');
    const rel = m.decisions[0]!.expression as Relation;
    if (rel.id) expect(m.index.has(rel.id)).toBe(true);
  });

  it('relation row ids are indexed', () => {
    const m = parseFixture('base/base-relation.dmn');
    const rel = m.decisions[0]!.expression as Relation;
    for (const row of rel.rows) {
      if (row.id) expect(m.index.has(row.id)).toBe(true);
    }
  });

  it('invocation id is indexed', () => {
    const m = parseFixture('base/base-invocation.dmn');
    const d = m.decisions.find((d) => d.expression?.type === 'invocation')!;
    const inv = d.expression as Invocation;
    if (inv.id) expect(m.index.has(inv.id)).toBe(true);
  });

  it('list id is indexed', () => {
    const m = parseFixture('base/base-list.dmn');
    const list = m.decisions[0]!.expression as List;
    if (list.id) expect(m.index.has(list.id)).toBe(true);
  });

  it('iterator id is indexed', () => {
    const m = parseFixture('base/base-iterator-for.dmn');
    const iter = m.decisions[0]!.expression as Iterator;
    if (iter.id) expect(m.index.has(iter.id)).toBe(true);
  });

  it('functionDefinition id is indexed', () => {
    const m = parseFixture('base/base-bkm.dmn');
    const fn = m.businessKnowledgeModels[0]!.encapsulatedLogic as FunctionDefinition;
    if (fn.id) expect(m.index.has(fn.id)).toBe(true);
  });
});

describe('index — complete model thoroughness', () => {
  it('all decisions in complete-loan-approval-v1 are in index', () => {
    const xml = loadFixture('complete/complete-loan-approval-v1.dmn');
    const result = safeParse(xml);
    expect(result.success).toBe(true);
    if (!result.success) return;
    const { model } = result;
    for (const d of model.decisions) {
      expect(model.index.has(d.id)).toBe(true);
      expect(model.index.get(d.id)).toBe(d);
    }
  });

  it('index.get returns the same object reference', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    const d = m.decisions[0]!;
    expect(m.index.get(d.id)).toBe(d);
  });
});

describe('index — all structure fixtures have non-empty index', () => {
  const structureFixtures = CATALOG.filter(
    (f) => (f.category === 'structure' && f.type !== 'base') || f.type === 'complete',
  ).slice(0, 20); // Sample 20 to keep test time reasonable

  for (const fixture of structureFixtures) {
    it(`${fixture.path} index is populated`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      // Models with IDs should have entries in the index
      const hasDecisions = result.model.decisions.length > 0;
      if (hasDecisions) {
        expect(result.model.index.size).toBeGreaterThan(0);
      }
    });
  }
});
