import type { DMNVersion, ParseOptions } from './types.js';

export interface MapContext {
  index: Map<string, unknown>;
  version: DMNVersion;
  includeDMNDI: boolean;
}

export function createContext(version: DMNVersion, options: ParseOptions): MapContext {
  return {
    index: new Map(),
    version,
    includeDMNDI: options.includeDMNDI ?? false,
  };
}
