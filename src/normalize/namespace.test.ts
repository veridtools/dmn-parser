import { describe, expect, it } from 'vitest';
import { detectVersionFromRaw } from './namespace.js';

const makeXml = (ns: string) => `<definitions xmlns="${ns}" id="x" name="x" namespace="x"/>`;

describe('detectVersionFromRaw', () => {
  const cases: [string, string][] = [
    ['http://www.omg.org/spec/DMN/20151101/dmn.xsd', '1.1'],
    ['http://www.omg.org/spec/DMN/20151101/MODEL/', '1.1'],
    ['http://www.omg.org/spec/DMN/20180521/MODEL/', '1.2'],
    ['https://www.omg.org/spec/DMN/20191111/MODEL/', '1.3'],
    ['https://www.omg.org/spec/DMN/20211108/MODEL/', '1.4'],
    ['https://www.omg.org/spec/DMN/20230324/MODEL/', '1.5'],
  ];

  for (const [ns, version] of cases) {
    it(`detects DMN ${version} from ${ns}`, () => {
      expect(detectVersionFromRaw(makeXml(ns))).toBe(version);
    });
  }

  it('defaults to 1.5 for unknown namespace', () => {
    expect(detectVersionFromRaw(makeXml('http://example.com/unknown'))).toBe('1.5');
  });
});
