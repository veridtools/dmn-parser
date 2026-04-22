/**
 * Smoke-test: every fixture in the 0.2.0 catalog must parse without error.
 * Tests are grouped by category so failures are easy to triage.
 */
import { CATALOG, loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';

const categories = ['structure', 'execution', 'feel-types', 'feel-functions', 's-feel'] as const;

for (const category of categories) {
  const fixtures = CATALOG.filter((f) => f.category === category);
  describe(`parse-all / ${category} (${fixtures.length} fixtures)`, () => {
    for (const fixture of fixtures) {
      it(fixture.path, () => {
        const xml = loadFixture(fixture.path);
        const result = safeParse(xml);
        expect(
          result.success,
          `${fixture.path}: ${!result.success ? result.errors[0]?.message : ''}`,
        ).toBe(true);
      });
    }
  });
}

// Edge-case fixtures (xml format)
describe('parse-all / edge-cases', () => {
  const fixtures = CATALOG.filter((f) => f.type === 'edge-case');
  for (const fixture of fixtures) {
    it(fixture.path, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(
        result.success,
        `${fixture.path}: ${!result.success ? result.errors[0]?.message : ''}`,
      ).toBe(true);
    });
  }
});
