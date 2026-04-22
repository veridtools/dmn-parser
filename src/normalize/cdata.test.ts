import { describe, expect, it } from 'vitest';
import { preprocessXml } from './cdata.js';

describe('preprocessXml', () => {
  it('removes UTF-8 BOM', () => {
    const input = '﻿<?xml version="1.0"?><root/>';
    expect(preprocessXml(input)).not.toMatch(/^﻿/);
    expect(preprocessXml(input)).toMatch(/^<\?xml/);
  });

  it('converts CDATA to xml entities', () => {
    const input = `<text><![CDATA[score > 700]]></text>`;
    expect(preprocessXml(input)).toContain('&gt;');
    expect(preprocessXml(input)).not.toContain('<![CDATA[');
  });

  it('converts CDATA ampersand', () => {
    const input = `<text><![CDATA[a & b]]></text>`;
    expect(preprocessXml(input)).toContain('&amp;');
  });

  it('leaves normal content unchanged', () => {
    const input = `<?xml version="1.0"?><root id="x"/>`;
    expect(preprocessXml(input)).toBe(input);
  });

  it('CDATA and entities produce same parsed text', () => {
    const cdata = preprocessXml(`<t><![CDATA[> 700]]></t>`);
    const entities = `<t>&gt; 700</t>`;
    expect(cdata).toBe(entities);
  });
});
