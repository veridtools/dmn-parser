/**
 * Requirements graph integrity.
 * For every structure and complete fixture, verifies that all internal hrefs
 * (href values starting with #) resolve to an element present in model.index.
 *
 * Catches two classes of bugs:
 *   1. Parser fails to index an element that other elements reference.
 *   2. Fixture data error: a href points to a non-existent ID.
 *
 * Only structure/complete fixtures are tested since feel-case fixtures rarely
 * contain requirements graphs.
 */
import { CATALOG, loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';
import type { DMNElementRef, DMNModel } from '../types.js';

function collectInternalHrefs(model: DMNModel): Array<{ href: string; from: string }> {
  const refs: Array<{ href: string; from: string }> = [];

  const add = (ref: DMNElementRef | undefined, from: string) => {
    if (ref?.href?.startsWith('#')) refs.push({ href: ref.href, from });
  };

  for (const d of model.decisions) {
    const loc = `decision "${d.name}"`;
    for (const ir of d.informationRequirements) {
      add(ir.requiredDecision, `${loc} informationRequirement`);
      add(ir.requiredInput, `${loc} informationRequirement`);
    }
    for (const kr of d.knowledgeRequirements) {
      add(kr.requiredKnowledge, `${loc} knowledgeRequirement`);
    }
    for (const ar of d.authorityRequirements) {
      add(ar.requiredDecision, `${loc} authorityRequirement`);
      add(ar.requiredInput, `${loc} authorityRequirement`);
      add(ar.requiredAuthority, `${loc} authorityRequirement`);
    }
  }

  for (const bkm of model.businessKnowledgeModels) {
    const loc = `BKM "${bkm.name}"`;
    for (const kr of bkm.knowledgeRequirements) {
      add(kr.requiredKnowledge, `${loc} knowledgeRequirement`);
    }
    for (const ar of bkm.authorityRequirements) {
      add(ar.requiredDecision, `${loc} authorityRequirement`);
      add(ar.requiredInput, `${loc} authorityRequirement`);
      add(ar.requiredAuthority, `${loc} authorityRequirement`);
    }
  }

  for (const ks of model.knowledgeSources) {
    const loc = `KnowledgeSource "${ks.name}"`;
    for (const ar of ks.authorityRequirements) {
      add(ar.requiredDecision, `${loc} authorityRequirement`);
      add(ar.requiredInput, `${loc} authorityRequirement`);
      add(ar.requiredAuthority, `${loc} authorityRequirement`);
    }
  }

  for (const ds of model.decisionServices) {
    const loc = `DecisionService "${ds.name}"`;
    for (const ref of ds.outputDecisions) add(ref, `${loc} outputDecision`);
    for (const ref of ds.encapsulatedDecisions) add(ref, `${loc} encapsulatedDecision`);
    for (const ref of ds.inputDecisions) add(ref, `${loc} inputDecision`);
    for (const ref of ds.inputData) add(ref, `${loc} inputData`);
  }

  for (const assoc of model.associations) {
    add(assoc.sourceRef, `association "${assoc.id}" sourceRef`);
    add(assoc.targetRef, `association "${assoc.id}" targetRef`);
  }

  for (const ec of model.elementCollections) {
    for (const ref of ec.drgElements) add(ref, `elementCollection "${ec.id}"`);
  }

  return refs;
}

describe('requirements graph integrity — structure fixtures', () => {
  const fixtures = CATALOG.filter((f) => f.category === 'structure' || f.type === 'complete');

  for (const fixture of fixtures) {
    it(`${fixture.path} — all internal hrefs resolve to indexed elements`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;

      const hrefs = collectInternalHrefs(result.model);
      for (const { href, from } of hrefs) {
        const id = href.slice(1); // strip leading #
        expect(
          result.model.index.has(id),
          `${from}: href="${href}" (id="${id}") not found in model.index`,
        ).toBe(true);
      }
    });
  }
});
