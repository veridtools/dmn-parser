import { describe, expect, it } from 'vitest';
import { parse } from '../parse.js';
import { ITEM_DEFINITION } from '../test-fixtures.js';

describe('mapItemDefinitions', () => {
  it('maps id, name, isCollection', () => {
    const model = parse(ITEM_DEFINITION);
    const it1 = model.itemDefinitions[0]!;
    expect(it1.id).toBe('it1');
    expect(it1.name).toBe('tStatus');
    expect(it1.isCollection).toBe(false);
  });

  it('maps typeRef from child element', () => {
    const model = parse(ITEM_DEFINITION);
    const it1 = model.itemDefinitions[0]!;
    expect(it1.typeRef).toBe('string');
  });

  it('maps allowedValues', () => {
    const model = parse(ITEM_DEFINITION);
    const it1 = model.itemDefinitions[0]!;
    expect(it1.allowedValues?.text).toBe('"active","inactive"');
  });

  it('isCollection defaults to false when absent', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/" id="_d" name="T" namespace="x">
  <itemDefinition id="it2" name="tX"/>
</definitions>`;
    const model = parse(xml);
    expect(model.itemDefinitions[0]!.isCollection).toBe(false);
  });

  it('isCollection=true when attribute is "true"', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/" id="_d" name="T" namespace="x">
  <itemDefinition id="it3" name="tList" isCollection="true"/>
</definitions>`;
    const model = parse(xml);
    expect(model.itemDefinitions[0]!.isCollection).toBe(true);
  });

  it('registers itemDefinition in index', () => {
    const model = parse(ITEM_DEFINITION);
    expect(model.index.has('it1')).toBe(true);
  });
});
