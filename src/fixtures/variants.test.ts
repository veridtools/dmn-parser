/**
 * Structural assertions for all 283 variant fixtures, organized by group.
 * Each group targets the field or concept the variant exercises, ensuring the
 * parser correctly handles every supported variation — not just that it doesn't crash.
 *
 * Group-specific assertions go beyond the smoke test in parse-all.test.ts:
 *   - hit-policy variants → hitPolicy is a recognized valid value
 *   - rules variants      → rules have correct inputEntries/outputEntries structure
 *   - bkm variants        → BKMs have encapsulatedLogic
 *   - etc.
 *
 * noDiff variants (same model expressed in a different DMN version namespace) additionally
 * verify that the parsed structural shape is equivalent to their base fixture.
 */
import { CATALOG, loadFixture, loadPair } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';
import type {
  Conditional,
  Context,
  DecisionTable,
  Filter,
  Invocation,
  Iterator,
  List,
  Relation,
} from '../types.js';

const VALID_HIT_POLICIES = new Set([
  'UNIQUE',
  'FIRST',
  'PRIORITY',
  'ANY',
  'COLLECT',
  'RULE ORDER',
  'OUTPUT ORDER',
]);

function parseVariant(path: string) {
  const xml = loadFixture(path);
  const result = safeParse(xml);
  if (!result.success) throw new Error(`${path}: ${result.errors[0]?.message}`);
  return result.model;
}

function variantsInGroup(group: string) {
  return CATALOG.filter((f) => f.type === 'variant' && f.group === group);
}

// ── Hit policy ──────────────────────────────────────────────────────────────

describe('variants — hit-policy', () => {
  for (const f of variantsInGroup('hit-policy')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'decisionTable');
      expect(d, 'no decision with decisionTable').toBeDefined();
      if (!d || d.expression?.type !== 'decisionTable') return;
      const dt = d.expression as DecisionTable;
      expect(VALID_HIT_POLICIES.has(dt.hitPolicy), `invalid hitPolicy: ${dt.hitPolicy}`).toBe(true);
      expect(Array.isArray(dt.inputs)).toBe(true);
      expect(Array.isArray(dt.outputs)).toBe(true);
      expect(Array.isArray(dt.rules)).toBe(true);
    });
  }
});

// ── Rules ────────────────────────────────────────────────────────────────────

describe('variants — rules', () => {
  for (const f of variantsInGroup('rules')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'decisionTable');
      expect(d).toBeDefined();
      if (!d || d.expression?.type !== 'decisionTable') return;
      const dt = d.expression as DecisionTable;
      for (const rule of dt.rules) {
        expect(Array.isArray(rule.inputEntries)).toBe(true);
        expect(Array.isArray(rule.outputEntries)).toBe(true);
        expect(Array.isArray(rule.annotationEntries)).toBe(true);
      }
    });
  }
});

// ── Input clause ─────────────────────────────────────────────────────────────

describe('variants — input-clause', () => {
  for (const f of variantsInGroup('input-clause')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'decisionTable');
      expect(d).toBeDefined();
      if (!d || d.expression?.type !== 'decisionTable') return;
      const dt = d.expression as DecisionTable;
      expect(dt.inputs.length).toBeGreaterThan(0);
      for (const inp of dt.inputs) {
        expect(inp.inputExpression).toBeDefined();
        expect(inp.inputExpression.type).toBe('literalExpression');
      }
    });
  }
});

// ── Output clause ────────────────────────────────────────────────────────────

describe('variants — output-clause', () => {
  for (const f of variantsInGroup('output-clause')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'decisionTable');
      expect(d).toBeDefined();
      if (!d || d.expression?.type !== 'decisionTable') return;
      const dt = d.expression as DecisionTable;
      expect(dt.outputs.length).toBeGreaterThan(0);
    });
  }
});

// ── Annotation columns ───────────────────────────────────────────────────────

describe('variants — annotation-columns', () => {
  for (const f of variantsInGroup('annotation-columns')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'decisionTable');
      expect(d).toBeDefined();
      if (!d || d.expression?.type !== 'decisionTable') return;
      const dt = d.expression as DecisionTable;
      // Each rule must have annotationEntries count matching dt.annotations count
      for (const rule of dt.rules) {
        expect(rule.annotationEntries).toHaveLength(dt.annotations.length);
      }
    });
  }
});

// ── BKM ──────────────────────────────────────────────────────────────────────

describe('variants — bkm', () => {
  for (const f of variantsInGroup('bkm')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      // Some bkm variants remove the BKM (and related decisions) entirely — parse must succeed
      expect(m.id).toBeTruthy();
      // When BKMs are present, verify their structure
      for (const bkm of m.businessKnowledgeModels) {
        expect(bkm.name).toBeTruthy();
        if (bkm.encapsulatedLogic) {
          expect(bkm.encapsulatedLogic.type).toBe('functionDefinition');
          expect(['FEEL', 'Java', 'PMML']).toContain(bkm.encapsulatedLogic.kind);
          expect(Array.isArray(bkm.encapsulatedLogic.formalParameters)).toBe(true);
        }
      }
    });
  }
});

// ── Context expression ───────────────────────────────────────────────────────

describe('variants — context-expression', () => {
  for (const f of variantsInGroup('context-expression')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'context');
      expect(d).toBeDefined();
      if (!d) return;
      const ctx = d.expression as Context;
      expect(Array.isArray(ctx.contextEntries)).toBe(true);
    });
  }
});

// ── Conditional ──────────────────────────────────────────────────────────────

describe('variants — conditional', () => {
  for (const f of variantsInGroup('conditional')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      expect(m.decisions.length).toBeGreaterThan(0);
      // Some variants replace the conditional with a literal — when conditional IS present, check structure
      const d = m.decisions.find((d) => d.expression?.type === 'conditional');
      if (!d) return;
      const cond = d.expression as Conditional;
      expect(cond.if).toBeDefined();
      expect(cond.then).toBeDefined();
      expect(cond.else).toBeDefined();
      expect(cond.if.type).toBeTruthy();
      expect(cond.then.type).toBeTruthy();
      expect(cond.else.type).toBeTruthy();
    });
  }
});

// ── Filter ───────────────────────────────────────────────────────────────────

describe('variants — filter', () => {
  for (const f of variantsInGroup('filter')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      expect(m.decisions.length).toBeGreaterThan(0);
      // Some variants replace the filter with a literal — when filter IS present, check structure
      const d = m.decisions.find((d) => d.expression?.type === 'filter');
      if (!d) return;
      const filt = d.expression as Filter;
      expect(filt.in).toBeDefined();
      expect(filt.match).toBeDefined();
    });
  }
});

// ── Iterator ─────────────────────────────────────────────────────────────────

describe('variants — iterator', () => {
  for (const f of variantsInGroup('iterator')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      expect(m.decisions.length).toBeGreaterThan(0);
      // Some variants replace the iterator with a literal — when iterator IS present, check structure
      const d = m.decisions.find((d) => d.expression?.type === 'iterator');
      if (!d) return;
      const iter = d.expression as Iterator;
      expect(['for', 'some', 'every']).toContain(iter.iteratorType);
      expect(iter.iteratorVariable).toBeTruthy();
      expect(iter.in).toBeDefined();
      if (iter.iteratorType === 'for') {
        expect(iter.return).toBeDefined();
      } else {
        expect(iter.satisfies).toBeDefined();
      }
    });
  }
});

// ── List expression ──────────────────────────────────────────────────────────

describe('variants — list-expression', () => {
  for (const f of variantsInGroup('list-expression')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'list');
      expect(d).toBeDefined();
      if (!d) return;
      const list = d.expression as List;
      expect(Array.isArray(list.elements)).toBe(true);
    });
  }
});

// ── Relation expression ──────────────────────────────────────────────────────

describe('variants — relation-expression', () => {
  for (const f of variantsInGroup('relation-expression')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'relation');
      expect(d).toBeDefined();
      if (!d) return;
      const rel = d.expression as Relation;
      expect(rel.columns.length).toBeGreaterThan(0);
      expect(rel.rows.length).toBeGreaterThan(0);
      for (const row of rel.rows) {
        expect(row.elements).toHaveLength(rel.columns.length);
      }
    });
  }
});

// ── Invocation ───────────────────────────────────────────────────────────────

describe('variants — invocation', () => {
  for (const f of variantsInGroup('invocation')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const d = m.decisions.find((d) => d.expression?.type === 'invocation');
      expect(d).toBeDefined();
      if (!d) return;
      const inv = d.expression as Invocation;
      expect(inv.callee).toBeDefined();
      expect(inv.callee?.text).toBeTruthy();
      expect(Array.isArray(inv.bindings)).toBe(true);
    });
  }
});

// ── Requirements ─────────────────────────────────────────────────────────────

describe('variants — requirements', () => {
  for (const f of variantsInGroup('requirements')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const hasAnyReq = m.decisions.some(
        (d) =>
          d.informationRequirements.length > 0 ||
          d.knowledgeRequirements.length > 0 ||
          d.authorityRequirements.length > 0,
      );
      // Variants in this group always exercise at least one requirement type
      expect(hasAnyReq).toBe(true);
    });
  }
});

// ── Decision service ─────────────────────────────────────────────────────────

describe('variants — decision-service', () => {
  for (const f of variantsInGroup('decision-service')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      // Some variants remove the service — model must still have decisions
      expect(m.decisions.length).toBeGreaterThan(0);
      // When services are present, verify their structure
      for (const ds of m.decisionServices) {
        expect(ds.id).toBeTruthy();
        expect(ds.name).toBeTruthy();
        expect(Array.isArray(ds.outputDecisions)).toBe(true);
        expect(Array.isArray(ds.encapsulatedDecisions)).toBe(true);
        expect(Array.isArray(ds.inputDecisions)).toBe(true);
        expect(Array.isArray(ds.inputData)).toBe(true);
      }
    });
  }
});

// ── Item definitions ─────────────────────────────────────────────────────────

describe('variants — item-definitions', () => {
  for (const f of variantsInGroup('item-definitions')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      expect(m.itemDefinitions.length).toBeGreaterThan(0);
      for (const td of m.itemDefinitions) {
        expect(td.id).toBeTruthy();
        expect(td.name).toBeTruthy();
        expect(typeof td.isCollection).toBe('boolean');
        expect(Array.isArray(td.itemComponents)).toBe(true);
      }
    });
  }
});

// ── Imports ──────────────────────────────────────────────────────────────────

describe('variants — import', () => {
  for (const f of variantsInGroup('import')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      expect(m.imports.length).toBeGreaterThan(0);
      for (const imp of m.imports) {
        expect(imp.importType).toBeTruthy();
      }
    });
  }
});

// ── Knowledge source ─────────────────────────────────────────────────────────

describe('variants — knowledge-source', () => {
  for (const f of variantsInGroup('knowledge-source')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      expect(m.knowledgeSources.length).toBeGreaterThan(0);
      for (const ks of m.knowledgeSources) {
        expect(ks.id).toBeTruthy();
        expect(ks.name).toBeTruthy();
      }
    });
  }
});

// ── Artifacts ────────────────────────────────────────────────────────────────

describe('variants — artifacts', () => {
  for (const f of variantsInGroup('artifacts')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const hasArtifacts =
        m.textAnnotations.length > 0 || m.associations.length > 0 || m.groups.length > 0;
      expect(hasArtifacts, 'no artifacts found in artifacts-group variant').toBe(true);
    });
  }
});

// ── Business context ─────────────────────────────────────────────────────────

describe('variants — business-context', () => {
  for (const f of variantsInGroup('business-context')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const hasContext =
        m.performanceIndicators.length > 0 ||
        m.organizationUnits.length > 0 ||
        m.decisions.some((d) => d.question || d.decisionMakers.length > 0);
      expect(hasContext, 'no business-context elements found').toBe(true);
    });
  }
});

// ── Element collection ───────────────────────────────────────────────────────

describe('variants — element-collection', () => {
  for (const f of variantsInGroup('element-collection')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      // Some variants remove the collection — model must still have decisions
      const hasElements = m.decisions.length > 0 || m.elementCollections.length > 0;
      expect(hasElements, 'model is completely empty').toBe(true);
      // When collections are present, verify their structure
      for (const ec of m.elementCollections) {
        expect(ec.id).toBeTruthy();
        expect(Array.isArray(ec.drgElements)).toBe(true);
      }
    });
  }
});

// ── Group artifact ───────────────────────────────────────────────────────────

describe('variants — group-artifact', () => {
  for (const f of variantsInGroup('group-artifact')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      expect(m.groups.length).toBeGreaterThan(0);
    });
  }
});

// ── No IDs ───────────────────────────────────────────────────────────────────

describe('variants — no-ids', () => {
  for (const f of variantsInGroup('no-ids')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      // Model must still contain decisions even without IDs
      expect(m.decisions.length).toBeGreaterThan(0);
    });
  }
});

// ── DMNDI ────────────────────────────────────────────────────────────────────

describe('variants — dmndi (excluded by default)', () => {
  for (const f of variantsInGroup('dmndi')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      expect(m.dmndi).toBeUndefined();
    });
  }
});

// ── DMN features (general) ───────────────────────────────────────────────────

describe('variants — dmn-features', () => {
  for (const f of variantsInGroup('dmn-features')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      const hasElements =
        m.decisions.length > 0 ||
        m.inputData.length > 0 ||
        m.businessKnowledgeModels.length > 0 ||
        m.itemDefinitions.length > 0;
      expect(hasElements, 'model appears completely empty').toBe(true);
    });
  }
});

// ── Import extensibility ─────────────────────────────────────────────────────

describe('variants — import-extensibility', () => {
  for (const f of variantsInGroup('import-extensibility')) {
    it(f.path, () => {
      const m = parseVariant(f.path);
      // extensionElements must not leak into the model
      expect((m as unknown as Record<string, unknown>).extensionElements).toBeUndefined();
    });
  }
});

// ── DMN versions — cross-version equivalence ─────────────────────────────────
//
// The five base-dmnXX fixtures represent the same decision model in versions 1.1–1.5.
// All must produce an identical structural shape; only dmnVersion differs.

describe('cross-version equivalence — base-dmn11 through base-dmn15', () => {
  const versionFixtures = [
    'base/base-dmn11.dmn',
    'base/base-dmn12.dmn',
    'base/base-dmn13.dmn',
    'base/base-dmn14.dmn',
    'base/base-dmn15.dmn',
  ] as const;
  const expectedVersions = ['1.1', '1.2', '1.3', '1.4', '1.5'] as const;

  for (let i = 0; i < versionFixtures.length; i++) {
    const path = versionFixtures[i]!;
    const expectedVersion = expectedVersions[i]!;

    it(`${path} → dmnVersion is ${expectedVersion}`, () => {
      const m = parseVariant(path);
      expect(m.dmnVersion).toBe(expectedVersion);
    });

    it(`${path} → same structure as base-dmn15 (1 decision, decisionTable)`, () => {
      const m = parseVariant(path);
      expect(m.decisions).toHaveLength(1);
      expect(m.decisions[0]!.expression?.type).toBe('decisionTable');
      const dt = m.decisions[0]!.expression as DecisionTable;
      expect(VALID_HIT_POLICIES.has(dt.hitPolicy)).toBe(true);
      expect(dt.inputs.length).toBeGreaterThan(0);
      expect(dt.outputs.length).toBeGreaterThan(0);
    });
  }
});

// ── noDiff variants — structural equivalence with base ───────────────────────
//
// Fixtures marked noDiff:true express the same model in a different DMN namespace.
// Parsing base and variant must yield identical decision counts, names, and expression types.

describe('noDiff variants — equivalent structure to base', () => {
  // Only dmn-versions noDiff fixtures where the dmnVersion CHANGED represent pure namespace
  // changes (same model, different xmlns URI). Same-version noDiff variants are semantic-only
  // changes ("no diff in the diff tool") and may have different structures.
  const noDiffVariants = CATALOG.filter((f) => {
    if (!(f.type === 'variant' && f.noDiff && f.base && f.group === 'dmn-versions')) return false;
    const base = CATALOG.find((b) => b.path === f.base);
    return base !== undefined && base.dmnVersion !== f.dmnVersion;
  });

  for (const f of noDiffVariants) {
    it(`${f.path} ≡ ${f.base}`, () => {
      const [baseXml, variantXml] = loadPair(f.base!, f.path);
      const baseResult = safeParse(baseXml);
      const variantResult = safeParse(variantXml);

      expect(baseResult.success).toBe(true);
      expect(variantResult.success).toBe(true);
      if (!baseResult.success || !variantResult.success) return;

      const base = baseResult.model;
      const variant = variantResult.model;

      expect(variant.decisions).toHaveLength(base.decisions.length);
      expect(variant.inputData).toHaveLength(base.inputData.length);
      expect(variant.businessKnowledgeModels).toHaveLength(base.businessKnowledgeModels.length);

      const baseExprTypes = base.decisions.map((d) => d.expression?.type ?? 'none');
      const variantExprTypes = variant.decisions.map((d) => d.expression?.type ?? 'none');
      expect(variantExprTypes).toEqual(baseExprTypes);

      const baseNames = base.decisions.map((d) => d.name).sort();
      const variantNames = variant.decisions.map((d) => d.name).sort();
      expect(variantNames).toEqual(baseNames);
    });
  }
});
