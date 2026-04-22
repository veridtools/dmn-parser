/**
 * DMN version detection: verify that every fixture with a known dmnVersion
 * is parsed with the correct model.dmnVersion.
 */
import { CATALOG, loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { detectVersion, safeParse } from '../parse.js';

const versionFixtures = CATALOG.filter(
  (f) => f.dmnVersion !== undefined && (f.format === 'dmn' || f.format === 'xml'),
);

describe('model.dmnVersion matches catalog entry', () => {
  for (const fixture of versionFixtures) {
    it(`${fixture.path} → ${fixture.dmnVersion}`, () => {
      const xml = loadFixture(fixture.path);
      const result = safeParse(xml);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.model.dmnVersion).toBe(fixture.dmnVersion);
      }
    });
  }
});

describe('detectVersion() standalone', () => {
  const cases: [string, string][] = [
    ['base/base-dmn11.dmn', '1.1'],
    ['base/base-dmn12.dmn', '1.2'],
    ['base/base-dmn13.dmn', '1.3'],
    ['base/base-dmn14.dmn', '1.4'],
    ['base/base-dmn15.dmn', '1.5'],
  ];

  for (const [path, version] of cases) {
    it(`detectVersion(${path}) === ${version}`, () => {
      const xml = loadFixture(path);
      expect(detectVersion(xml)).toBe(version);
    });
  }
});

describe('version override via ParseOptions', () => {
  it('options.version overrides auto-detected version', () => {
    const xml = loadFixture('base/base-dmn15.dmn');
    const result = safeParse(xml, { version: '1.3' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.model.dmnVersion).toBe('1.3');
    }
  });
});
