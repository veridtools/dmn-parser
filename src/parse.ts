import { createContext } from './context.js';
import { mapDefinitions } from './mappers/definitions.js';
import { preprocessXml } from './normalize/cdata.js';
import { normalizeNode } from './normalize/defaults.js';
import { detectVersionFromRaw } from './normalize/namespace.js';
import type {
  DMNModel,
  DMNVersion,
  ParseError,
  ParseOptions,
  ParseResult,
  ParseWarning,
} from './types.js';
import { isRecord } from './utils.js';
import { parseXml } from './xml.js';

function doParse(xml: string, options: ParseOptions = {}): DMNModel {
  const clean = preprocessXml(xml);
  const raw = parseXml(clean);
  const defs = raw.definitions;
  if (!isRecord(defs)) throw new Error('No <definitions> root element found');

  const version = options.version ?? detectVersionFromRaw(clean);
  normalizeNode(defs, 'definitions');

  const ctx = createContext(version, options);
  return mapDefinitions(defs, version, ctx);
}

export function parse(xml: string, options: ParseOptions = {}): DMNModel {
  return doParse(xml, options);
}

export function safeParse(xml: string, options: ParseOptions = {}): ParseResult {
  const warnings: ParseWarning[] = [];
  try {
    const model = doParse(xml, options);
    return { success: true, model, warnings };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const errors: ParseError[] = [{ code: 'PARSE_ERROR', message }];
    return { success: false, errors, warnings };
  }
}

export function detectVersion(xml: string): DMNVersion {
  try {
    const clean = preprocessXml(xml);
    return detectVersionFromRaw(clean);
  } catch {
    return '1.5';
  }
}
