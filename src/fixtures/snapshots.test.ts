/**
 * Golden output snapshots for all base fixtures.
 * Each test serializes the full parse output and compares it to a committed snapshot.
 *
 * On first run, snapshots are created automatically.
 * When a snapshot changes unexpectedly, it signals a parser regression.
 * To accept intentional changes: pnpm test --update-snapshots
 */
import { CATALOG, loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';
import type { DMNModel } from '../types.js';

function serializeModel(model: DMNModel) {
  const { index, ...rest } = model;
  return {
    ...rest,
    _indexKeys: [...index.keys()].sort(),
  };
}

describe('base fixture snapshots', () => {
  const bases = CATALOG.filter((f) => f.type === 'base');

  for (const fixture of bases) {
    it(fixture.path, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success, `${fixture.path} failed to parse`).toBe(true);
      if (!result.success) return;
      expect(serializeModel(result.model)).toMatchSnapshot();
    });
  }
});
