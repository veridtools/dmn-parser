/**
 * Test-case name alignment.
 * For every fixture with a companion test-cases JSON (testCasesPath in the catalog),
 * verifies that the context variable names used in test scenarios match the
 * inputData (or decision) names in the parsed model.
 *
 * What this checks:
 *   context keys → must match an inputData.name, decision.name, or BKM.name in the model.
 *
 * Why only context, not expected:
 *   The `expected` field in test cases uses an evaluator-specific notation (e.g. `"result"`,
 *   numeric indices, or short names) that does NOT reliably correspond to decision names.
 *   The `context` field, however, directly lists the input variable names fed into the model,
 *   which must match the DMN element names the parser produces.
 *
 * Empty contexts (common in FEEL-function fixtures that use literal inputs) are skipped.
 */
import { CATALOG, loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';
import { loadTestCasesJson } from './helpers.js';

describe('testcases — context variable names match parsed model element names', () => {
  // Only check fixtures that have both a non-trivial context and inputData in the model.
  // FEEL-function and feel-type fixtures often use empty contexts (literal inline inputs).
  const fixtures = CATALOG.filter((f) => f.testCasesPath != null && f.category === 'execution');

  for (const fixture of fixtures) {
    it(fixture.path, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (!result.success) return;

      const tc = loadTestCasesJson(fixture.testCasesPath!);
      const knownNames = new Set([
        ...result.model.inputData.map((id) => id.name),
        ...result.model.decisions.map((d) => d.name),
        ...result.model.businessKnowledgeModels.map((b) => b.name),
      ]);

      if (knownNames.size === 0) return; // model has no named elements to check against

      for (const c of tc.cases) {
        if (!c.context || typeof c.context !== 'object') continue;
        const contextKeys = Object.keys(c.context);
        if (contextKeys.length === 0) continue; // empty context — nothing to verify

        for (const key of contextKeys) {
          expect(
            knownNames,
            `"${fixture.path}": context key "${key}" not found in model elements [${[...knownNames].join(', ')}]`,
          ).toContain(key);
        }
      }
    });
  }
});
