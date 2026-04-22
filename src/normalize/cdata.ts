// Pre-parse string transformations: BOM removal and CDATA normalization.
// Both forms represent the same content — normalize to XML-escaped entities
// so the parser produces identical output regardless of which form was used.

export function preprocessXml(xml: string): string {
  let result = xml.replace(/^﻿/, '');
  result = result.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, content: string) =>
    content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;'),
  );
  return result;
}
