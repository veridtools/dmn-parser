import { XMLParser } from 'fast-xml-parser';
import type { DMNVersion } from './types.js';
import { isRecord } from './utils.js';

// All tags that can appear multiple times as siblings in DMN XML
export const ARRAY_TAGS = new Set([
  'decision',
  'inputData',
  'businessKnowledgeModel',
  'knowledgeSource',
  'decisionService',
  'import',
  'itemDefinition',
  'itemComponent',
  'elementCollection',
  'performanceIndicator',
  'organizationUnit',
  'input',
  'output',
  'annotation',
  'rule',
  'inputEntry',
  'outputEntry',
  'annotationEntry',
  'contextEntry',
  'formalParameter',
  'binding',
  'informationRequirement',
  'knowledgeRequirement',
  'authorityRequirement',
  'outputDecision',
  'encapsulatedDecision',
  'inputDecision',
  'textAnnotation',
  'association',
  'group',
  'column',
  'row',
  'expression',
  'literalExpression',
  'supportedObjective',
  'impactedPerformanceIndicator',
  'decisionMaker',
  'decisionOwner',
  'usingProcess',
  'usingTask',
  'impactingDecision',
  'decisionMade',
  'decisionOwned',
  'drgElement',
  'parameters',
  'DMNDiagram',
]);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  textNodeName: '#text',
  removeNSPrefix: true,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: false,
  isArray: (tagName) => ARRAY_TAGS.has(tagName),
});

export function parseXml(xml: string): Record<string, unknown> {
  const result: unknown = parser.parse(xml);
  if (!isRecord(result)) throw new Error('XML parser returned non-object');
  return result;
}

// Known DMN namespace URIs mapped to version strings
export const DMN_NAMESPACES: Record<string, DMNVersion> = {
  'http://www.omg.org/spec/DMN/20151101/dmn.xsd': '1.1',
  'http://www.omg.org/spec/DMN/20151101/MODEL/': '1.1',
  'http://www.omg.org/spec/DMN/20180521/MODEL/': '1.2',
  'https://www.omg.org/spec/DMN/20191111/MODEL/': '1.3',
  'https://www.omg.org/spec/DMN/20211108/MODEL/': '1.4',
  'https://www.omg.org/spec/DMN/20230324/MODEL/': '1.5',
};

export function detectDmnVersion(xml: string): string {
  const matches = xml.matchAll(/xmlns(?::\w+)?="([^"]+)"/g);
  for (const m of matches) {
    const ns = m[1];
    if (ns && DMN_NAMESPACES[ns]) return DMN_NAMESPACES[ns]!;
  }
  return 'unknown';
}
