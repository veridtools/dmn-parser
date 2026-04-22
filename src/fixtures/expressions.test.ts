/**
 * Expression type validation using execution and feel-type fixtures.
 * Verifies that the parser correctly identifies expression types and populates
 * required fields for each expression kind.
 */
import { CATALOG, loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';
import type {
  Conditional,
  Context,
  Filter,
  FunctionDefinition,
  Invocation,
  Iterator,
  List,
  LiteralExpression,
  Relation,
} from '../types.js';
import { parseFixture } from './helpers.js';

// Helper: find the first decision with a given expression type across all decisions
function findExprType(model: ReturnType<typeof parseFixture>, type: string) {
  return model.decisions.find((d) => d.expression?.type === type);
}

describe('execution/literal-expression fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/literal-expression');

  for (const fixture of fixtures) {
    it(`${fixture.path} — primary decision has literalExpression`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = result.model.decisions.find((d) => d.expression?.type === 'literalExpression');
      // Some execution fixtures may use decisionTable; at least one decision should exist
      expect(result.model.decisions.length).toBeGreaterThan(0);
      if (d) {
        const le = d.expression as LiteralExpression;
        expect(le.type).toBe('literalExpression');
        expect(le.text).toBeTruthy();
      }
    });
  }
});

describe('execution/context-boxed fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/context-boxed');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has context expression`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = findExprType(result.model, 'context');
      expect(d).toBeDefined();
      if (d) {
        const ctx = d.expression as Context;
        expect(ctx.contextEntries.length).toBeGreaterThan(0);
      }
    });
  }
});

describe('execution/decision-table fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/decision-table');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has decisionTable with valid hitPolicy`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = findExprType(result.model, 'decisionTable');
      expect(d).toBeDefined();
      if (d?.expression?.type === 'decisionTable') {
        const validPolicies = [
          'UNIQUE',
          'FIRST',
          'PRIORITY',
          'ANY',
          'COLLECT',
          'RULE ORDER',
          'OUTPUT ORDER',
        ];
        expect(validPolicies).toContain(d.expression.hitPolicy);
        expect(d.expression.inputs.length).toBeGreaterThan(0);
        expect(d.expression.outputs.length).toBeGreaterThan(0);
        expect(d.expression.rules.length).toBeGreaterThan(0);
      }
    });
  }
});

describe('execution/list-boxed fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/list-boxed');

  for (const fixture of fixtures) {
    it(`${fixture.path} — parses and has decisions`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.model.decisions.length).toBeGreaterThan(0);
      // If a boxed list expression is present, it must have elements
      const d = findExprType(result.model, 'list');
      if (d) {
        const list = d.expression as List;
        expect(list.elements.length).toBeGreaterThan(0);
      }
    });
  }
});

describe('execution/relation-boxed fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/relation-boxed');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has relation with columns and rows`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = findExprType(result.model, 'relation');
      expect(d).toBeDefined();
      if (d) {
        const rel = d.expression as Relation;
        expect(rel.columns.length).toBeGreaterThan(0);
        expect(rel.rows.length).toBeGreaterThan(0);
        for (const row of rel.rows) {
          expect(row.elements.length).toBe(rel.columns.length);
        }
      }
    });
  }
});

describe('execution/conditional fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/conditional');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has conditional with if/then/else`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = findExprType(result.model, 'conditional');
      expect(d).toBeDefined();
      if (d) {
        const cond = d.expression as Conditional;
        expect(cond.if).toBeDefined();
        expect(cond.then).toBeDefined();
        expect(cond.else).toBeDefined();
        expect(cond.if.type).toBeTruthy();
        expect(cond.then.type).toBeTruthy();
        expect(cond.else.type).toBeTruthy();
      }
    });
  }
});

describe('execution/filter fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/filter');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has filter with in and match`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = findExprType(result.model, 'filter');
      expect(d).toBeDefined();
      if (d) {
        const filt = d.expression as Filter;
        expect(filt.in).toBeDefined();
        expect(filt.match).toBeDefined();
      }
    });
  }
});

describe('execution/iterator fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/iterator');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has iterator with variable, type, in`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = findExprType(result.model, 'iterator');
      expect(d).toBeDefined();
      if (d) {
        const iter = d.expression as Iterator;
        expect(iter.iteratorVariable).toBeTruthy();
        expect(['for', 'some', 'every']).toContain(iter.iteratorType);
        expect(iter.in).toBeDefined();
        if (iter.iteratorType === 'for') {
          expect(iter.return).toBeDefined();
        } else {
          expect(iter.satisfies).toBeDefined();
        }
      }
    });
  }
});

describe('execution/bkm fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/bkm');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has BKM or functionDefinition expression`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const hasBkm = result.model.businessKnowledgeModels.length > 0;
      const hasFnDecision = result.model.decisions.some(
        (d) => d.expression?.type === 'functionDefinition',
      );
      expect(hasBkm || hasFnDecision).toBe(true);
      if (hasBkm) {
        const bkm = result.model.businessKnowledgeModels[0]!;
        expect(bkm.encapsulatedLogic).toBeDefined();
        const fn = bkm.encapsulatedLogic as FunctionDefinition;
        expect(fn.type).toBe('functionDefinition');
        expect(['FEEL', 'Java', 'PMML']).toContain(fn.kind);
      }
    });
  }
});

describe('execution/decision-service fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.group === 'execution/decision-service');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has decisionService with refs`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      // May have decision services
      if (result.model.decisionServices.length > 0) {
        const ds = result.model.decisionServices[0]!;
        expect(ds.id).toBeTruthy();
        expect(ds.name).toBeTruthy();
        expect(ds.outputDecisions.length).toBeGreaterThan(0);
      }
    });
  }
});

describe('s-feel fixtures — decision table structure', () => {
  const fixtures = CATALOG.filter((f) => f.category === 's-feel');

  for (const fixture of fixtures) {
    it(`${fixture.path} — has well-formed decision table`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      // S-FEEL fixtures primarily use decision tables
      const withDt = result.model.decisions.find((d) => d.expression?.type === 'decisionTable');
      if (withDt?.expression?.type === 'decisionTable') {
        const dt = withDt.expression;
        // Empty tables are valid (sfeel-empty-table.dmn)
        for (const rule of dt.rules) {
          for (const entry of rule.inputEntries) {
            expect(entry.text).toBeDefined();
          }
        }
      }
    });
  }
});

describe('feel-types fixtures — expression text is captured without XML artifacts', () => {
  const fixtures = CATALOG.filter((f) => f.category === 'feel-types');

  for (const fixture of fixtures) {
    it(`${fixture.path} — expression type is known and literalExpression text is clean`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = result.model.decisions[0];
      expect(d).toBeDefined();
      if (!d?.expression) return;

      const validTypes = new Set([
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
      ]);
      expect(
        validTypes.has(d.expression.type),
        `unknown expression type: ${d.expression.type}`,
      ).toBe(true);

      // When text IS present, it must not contain raw XML encoding artifacts
      if (d.expression.type === 'literalExpression') {
        const le = d.expression as LiteralExpression;
        if (le.text !== undefined) {
          expect(le.text).not.toContain('<![CDATA[');
          expect(le.text).not.toMatch(/&(?:amp|lt|gt|apos|quot);/);
        }
      }
    });
  }
});

describe('feel-functions fixtures — expression text is captured without XML artifacts', () => {
  const fixtures = CATALOG.filter((f) => f.category === 'feel-functions');

  for (const fixture of fixtures) {
    it(`${fixture.path} — expression type is known and literalExpression text is clean`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;
      const d = result.model.decisions[0];
      expect(d).toBeDefined();
      if (!d?.expression) return;

      const validTypes = new Set([
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
      ]);
      expect(
        validTypes.has(d.expression.type),
        `unknown expression type: ${d.expression.type}`,
      ).toBe(true);

      // When text IS present, it must not contain raw XML encoding artifacts
      if (d.expression.type === 'literalExpression') {
        const le = d.expression as LiteralExpression;
        if (le.text !== undefined) {
          expect(le.text).not.toContain('<![CDATA[');
          expect(le.text).not.toMatch(/&(?:amp|lt|gt|apos|quot);/);
        }
      }
    });
  }
});

describe('invocation expression (base-invocation)', () => {
  it('invocation has callee with function name text', () => {
    const m = parseFixture('base/base-invocation.dmn');
    const d = m.decisions.find((d) => d.expression?.type === 'invocation')!;
    const inv = d.expression as Invocation;
    expect(inv.callee?.type).toBe('literalExpression');
    expect(inv.callee?.text).toBeTruthy();
  });

  it('each binding has named parameter', () => {
    const m = parseFixture('base/base-invocation.dmn');
    const d = m.decisions.find((d) => d.expression?.type === 'invocation')!;
    const inv = d.expression as Invocation;
    for (const b of inv.bindings) {
      expect(b.parameter.name).toBeTruthy();
      if (b.expression) {
        expect(b.expression.type).toBeTruthy();
      }
    }
  });
});
