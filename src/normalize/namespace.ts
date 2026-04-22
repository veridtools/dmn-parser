import type { DMNVersion } from '../types.js';
import { DMN_NAMESPACES } from '../xml.js';

// fast-xml-parser with removeNSPrefix strips xmlns declarations from the parsed
// object, so version detection must work on the raw XML string instead.
export function detectVersionFromRaw(xml: string): DMNVersion {
  const matches = xml.matchAll(/xmlns(?::\w+)?="([^"]+)"/g);
  for (const m of matches) {
    const ns = m[1];
    if (ns && DMN_NAMESPACES[ns]) return DMN_NAMESPACES[ns]!;
  }
  return '1.5';
}
