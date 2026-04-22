import { describe, expect, it } from 'vitest';
import { parse } from '../parse.js';
import { ARTIFACTS, BKM_DEFINITION, DECISION_SERVICE, SIMPLE_DECISION } from '../test-fixtures.js';

describe('mapDecisions', () => {
  it('maps decision id, name, variable', () => {
    const model = parse(SIMPLE_DECISION);
    const d = model.decisions[0]!;
    expect(d.id).toBe('d1');
    expect(d.name).toBe('Approval');
    expect(d.variable?.name).toBe('Approval');
    expect(d.variable?.typeRef).toBe('string');
  });

  it('registers decision in index', () => {
    const model = parse(SIMPLE_DECISION);
    expect(model.index.has('d1')).toBe(true);
  });

  it('always returns arrays for requirements', () => {
    const model = parse(SIMPLE_DECISION);
    const d = model.decisions[0]!;
    expect(Array.isArray(d.informationRequirements)).toBe(true);
    expect(Array.isArray(d.knowledgeRequirements)).toBe(true);
    expect(Array.isArray(d.authorityRequirements)).toBe(true);
  });
});

describe('mapInputData', () => {
  it('maps inputData id and name', () => {
    const model = parse(DECISION_SERVICE);
    const id = model.inputData[0]!;
    expect(id.id).toBe('in1');
    expect(id.name).toBe('Score');
  });
});

describe('mapBusinessKnowledgeModels', () => {
  it('maps BKM with encapsulatedLogic', () => {
    const model = parse(BKM_DEFINITION);
    const bkm = model.businessKnowledgeModels[0]!;
    expect(bkm.id).toBe('bkm1');
    expect(bkm.name).toBe('Risk Score');
    expect(bkm.encapsulatedLogic).toBeDefined();
  });
});

describe('mapDecisionServices', () => {
  it('maps decision service with refs', () => {
    const model = parse(DECISION_SERVICE);
    const ds = model.decisionServices[0]!;
    expect(ds.id).toBe('ds1');
    expect(ds.outputDecisions[0]!.href).toBe('#d1');
    expect(ds.inputData[0]!.href).toBe('#in1');
  });
});

describe('mapTextAnnotations', () => {
  it('maps text annotation text', () => {
    const model = parse(ARTIFACTS);
    const ann = model.textAnnotations[0]!;
    expect(ann.id).toBe('ann1');
    expect(ann.text).toBe('A note');
    expect(ann.textFormat).toBe('text/plain');
  });
});
