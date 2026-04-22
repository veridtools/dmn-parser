import type { DMNModel } from './types.js';
import { DMN_NAMESPACES } from './xml.js';

// Maps version back to the canonical namespace URI
const VERSION_TO_NS: Record<string, string> = Object.fromEntries(
  Object.entries(DMN_NAMESPACES)
    .filter(([, v]) => ['1.1', '1.2', '1.3', '1.4', '1.5'].includes(v))
    .reduce((acc: Map<string, string>, [ns, v]) => {
      if (!acc.has(v)) acc.set(v, ns);
      return acc;
    }, new Map())
    .entries(),
);

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Produces a minimal but valid XML representation of the model.
// Intended for dmn-fmt and round-trip use cases — not a complete serializer.
export function serialize(model: DMNModel): string {
  const ns = VERSION_TO_NS[model.dmnVersion] ?? VERSION_TO_NS['1.5']!;
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>'];

  const attrs: string[] = [
    `xmlns="${ns}"`,
    `id="${esc(model.id)}"`,
    `name="${esc(model.name)}"`,
    `namespace="${esc(model.namespace)}"`,
  ];
  if (model.expressionLanguage) attrs.push(`expressionLanguage="${esc(model.expressionLanguage)}"`);
  if (model.typeLanguage) attrs.push(`typeLanguage="${esc(model.typeLanguage)}"`);

  lines.push(`<definitions ${attrs.join(' ')}>`);
  if (model.description) lines.push(`  <description>${esc(model.description)}</description>`);

  for (const imp of model.imports) {
    const a = [`name="${esc(imp.name)}"`, `importType="${esc(imp.importType)}"`];
    if (imp.namespace) a.push(`namespace="${esc(imp.namespace)}"`);
    if (imp.locationURI) a.push(`locationURI="${esc(imp.locationURI)}"`);
    lines.push(`  <import ${a.join(' ')}/>`);
  }

  lines.push('</definitions>');
  return lines.join('\n');
}
