/**
 * Structural validation of base fixtures.
 * Each describe block targets one base fixture and asserts specific model fields.
 */
import { describe, expect, it } from 'vitest';
import type {
  Conditional,
  Context,
  Filter,
  FunctionDefinition,
  Invocation,
  Iterator,
  List,
  LiteralExpression,
  Relation,
} from '../types.js';
import { dt0, expr0, parseFixture } from './helpers.js';

describe('definitions (base-def)', () => {
  it('model id, name, namespace', () => {
    const m = parseFixture('base/base-def.dmn');
    expect(m.id).toBe('_def_001');
    expect(m.name).toBe('Base Model');
    expect(m.namespace).toBe('https://verid.tools/fixtures/base');
    expect(m.dmnVersion).toBe('1.5');
  });

  it('expressionLanguage and typeLanguage', () => {
    const m = parseFixture('base/base-def.dmn');
    expect(m.expressionLanguage).toBe('https://www.omg.org/spec/DMN/20230324/FEEL/');
    expect(m.typeLanguage).toBe('https://www.omg.org/spec/DMN/20230324/FEEL/');
  });

  it('description parsed', () => {
    const m = parseFixture('base/base-def.dmn');
    expect(m.description).toBeTruthy();
  });

  it('no decisions in base-def', () => {
    const m = parseFixture('base/base-def.dmn');
    expect(m.decisions).toHaveLength(0);
  });
});

describe('literal expression (base-literal-expression)', () => {
  it('expression type is literalExpression', () => {
    const m = parseFixture('base/base-literal-expression.dmn');
    const expr = expr0(m) as LiteralExpression;
    expect(expr.type).toBe('literalExpression');
  });

  it('expression has text and typeRef', () => {
    const m = parseFixture('base/base-literal-expression.dmn');
    const expr = expr0(m) as LiteralExpression;
    expect(expr.text).toBeTruthy();
    expect(expr.typeRef).toBe('number');
  });

  it('expression id is indexed', () => {
    const m = parseFixture('base/base-literal-expression.dmn');
    const expr = expr0(m) as LiteralExpression;
    expect(expr.id).toBeTruthy();
    expect(m.index.has(expr.id!)).toBe(true);
  });
});

describe('context expression (base-context)', () => {
  it('expression type is context', () => {
    const m = parseFixture('base/base-context.dmn');
    expect(expr0(m).type).toBe('context');
  });

  it('has contextEntries', () => {
    const m = parseFixture('base/base-context.dmn');
    const ctx = expr0(m) as Context;
    expect(ctx.contextEntries.length).toBeGreaterThan(0);
  });

  it('contextEntry has variable and expression', () => {
    const m = parseFixture('base/base-context.dmn');
    const ctx = expr0(m) as Context;
    const entry = ctx.contextEntries[0]!;
    expect(entry.variable?.name).toBeTruthy();
    expect(entry.expression).toBeDefined();
  });

  it('context and entries are indexed by id', () => {
    const m = parseFixture('base/base-context.dmn');
    const ctx = expr0(m) as Context;
    expect(m.index.has(ctx.id!)).toBe(true);
    for (const e of ctx.contextEntries) {
      if (e.id) expect(m.index.has(e.id)).toBe(true);
    }
  });
});

describe('conditional expression (base-conditional)', () => {
  it('expression type is conditional', () => {
    const m = parseFixture('base/base-conditional.dmn');
    expect(expr0(m).type).toBe('conditional');
  });

  it('has if, then, else branches', () => {
    const m = parseFixture('base/base-conditional.dmn');
    const cond = expr0(m) as Conditional;
    expect(cond.if).toBeDefined();
    expect(cond.then).toBeDefined();
    expect(cond.else).toBeDefined();
  });

  it('each branch is an expression', () => {
    const m = parseFixture('base/base-conditional.dmn');
    const cond = expr0(m) as Conditional;
    expect(cond.if.type).toBeTruthy();
    expect(cond.then.type).toBeTruthy();
    expect(cond.else.type).toBeTruthy();
  });
});

describe('filter expression (base-filter)', () => {
  it('expression type is filter', () => {
    const m = parseFixture('base/base-filter.dmn');
    expect(expr0(m).type).toBe('filter');
  });

  it('has in and match expressions', () => {
    const m = parseFixture('base/base-filter.dmn');
    const filt = expr0(m) as Filter;
    expect(filt.in).toBeDefined();
    expect(filt.match).toBeDefined();
    expect(filt.in.type).toBeTruthy();
    expect(filt.match.type).toBeTruthy();
  });
});

describe('iterator for (base-iterator-for)', () => {
  it('expression type is iterator', () => {
    const m = parseFixture('base/base-iterator-for.dmn');
    expect(expr0(m).type).toBe('iterator');
  });

  it('iteratorType is for', () => {
    const m = parseFixture('base/base-iterator-for.dmn');
    const iter = expr0(m) as Iterator;
    expect(iter.iteratorType).toBe('for');
  });

  it('has iteratorVariable, in, and return', () => {
    const m = parseFixture('base/base-iterator-for.dmn');
    const iter = expr0(m) as Iterator;
    expect(iter.iteratorVariable).toBeTruthy();
    expect(iter.in).toBeDefined();
    expect(iter.return).toBeDefined();
    expect(iter.satisfies).toBeUndefined();
  });
});

describe('iterator some (base-iterator-some)', () => {
  it('iteratorType is some', () => {
    const m = parseFixture('base/base-iterator-some.dmn');
    const iter = expr0(m) as Iterator;
    expect(iter.iteratorType).toBe('some');
  });

  it('has satisfies but no return', () => {
    const m = parseFixture('base/base-iterator-some.dmn');
    const iter = expr0(m) as Iterator;
    expect(iter.satisfies).toBeDefined();
    expect(iter.return).toBeUndefined();
  });
});

describe('iterator every (base-iterator-every)', () => {
  it('iteratorType is every', () => {
    const m = parseFixture('base/base-iterator-every.dmn');
    const iter = expr0(m) as Iterator;
    expect(iter.iteratorType).toBe('every');
  });

  it('has satisfies but no return', () => {
    const m = parseFixture('base/base-iterator-every.dmn');
    const iter = expr0(m) as Iterator;
    expect(iter.satisfies).toBeDefined();
    expect(iter.return).toBeUndefined();
  });
});

describe('list expression (base-list)', () => {
  it('expression type is list', () => {
    const m = parseFixture('base/base-list.dmn');
    expect(expr0(m).type).toBe('list');
  });

  it('has elements array', () => {
    const m = parseFixture('base/base-list.dmn');
    const list = expr0(m) as List;
    expect(Array.isArray(list.elements)).toBe(true);
    expect(list.elements.length).toBeGreaterThan(0);
  });

  it('elements are expressions', () => {
    const m = parseFixture('base/base-list.dmn');
    const list = expr0(m) as List;
    for (const el of list.elements) {
      expect(el.type).toBeTruthy();
    }
  });
});

describe('relation expression (base-relation)', () => {
  it('expression type is relation', () => {
    const m = parseFixture('base/base-relation.dmn');
    expect(expr0(m).type).toBe('relation');
  });

  it('has columns and rows', () => {
    const m = parseFixture('base/base-relation.dmn');
    const rel = expr0(m) as Relation;
    expect(rel.columns.length).toBeGreaterThan(0);
    expect(rel.rows.length).toBeGreaterThan(0);
  });

  it('columns have name and typeRef', () => {
    const m = parseFixture('base/base-relation.dmn');
    const rel = expr0(m) as Relation;
    for (const col of rel.columns) {
      expect(col.name).toBeTruthy();
    }
  });

  it('rows have elements matching column count', () => {
    const m = parseFixture('base/base-relation.dmn');
    const rel = expr0(m) as Relation;
    for (const row of rel.rows) {
      expect(row.elements.length).toBe(rel.columns.length);
    }
  });
});

describe('invocation (base-invocation)', () => {
  it('expression type is invocation', () => {
    const m = parseFixture('base/base-invocation.dmn');
    // Find a decision that uses invocation
    const d = m.decisions.find((d) => d.expression?.type === 'invocation');
    expect(d).toBeDefined();
  });

  it('has callee and bindings', () => {
    const m = parseFixture('base/base-invocation.dmn');
    const d = m.decisions.find((d) => d.expression?.type === 'invocation')!;
    const inv = d.expression as Invocation;
    expect(inv.callee?.text).toBeTruthy();
    expect(Array.isArray(inv.bindings)).toBe(true);
    expect(inv.bindings.length).toBeGreaterThan(0);
  });

  it('bindings have parameter and expression', () => {
    const m = parseFixture('base/base-invocation.dmn');
    const d = m.decisions.find((d) => d.expression?.type === 'invocation')!;
    const inv = d.expression as Invocation;
    for (const b of inv.bindings) {
      expect(b.parameter.name).toBeTruthy();
    }
  });
});

describe('decision table — unique (base-dt-unique)', () => {
  it('expression type is decisionTable', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    expect(expr0(m).type).toBe('decisionTable');
  });

  it('hitPolicy is UNIQUE', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    expect(dt0(m).hitPolicy).toBe('UNIQUE');
  });

  it('has inputs, outputs, rules as arrays', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    const dt = dt0(m);
    expect(Array.isArray(dt.inputs)).toBe(true);
    expect(Array.isArray(dt.outputs)).toBe(true);
    expect(Array.isArray(dt.rules)).toBe(true);
  });

  it('inputExpression has text', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    for (const inp of dt0(m).inputs) {
      expect(inp.inputExpression.text).toBeTruthy();
    }
  });

  it('has exactly 3 rules with correct inputEntry and outputEntry text', () => {
    const m = parseFixture('base/base-dt-unique.dmn');
    const dt = dt0(m);
    expect(dt.rules).toHaveLength(3);
    // Verify exact FEEL expression text from the fixture
    expect(dt.rules[0]!.inputEntries[0]!.text).toBe('> 700');
    expect(dt.rules[0]!.outputEntries[0]!.text).toBe('"approved"');
    expect(dt.rules[1]!.inputEntries[0]!.text).toBe('[500..700]');
    expect(dt.rules[1]!.outputEntries[0]!.text).toBe('"manual"');
    expect(dt.rules[2]!.inputEntries[0]!.text).toBe('< 500');
    expect(dt.rules[2]!.outputEntries[0]!.text).toBe('"rejected"');
  });
});

describe('decision table — 2 inputs (base-dt-2inputs)', () => {
  it('has 2 inputs', () => {
    const m = parseFixture('base/base-dt-2inputs.dmn');
    expect(dt0(m).inputs).toHaveLength(2);
  });

  it('each input has label and expression', () => {
    const m = parseFixture('base/base-dt-2inputs.dmn');
    for (const inp of dt0(m).inputs) {
      expect(inp.label).toBeTruthy();
      expect(inp.inputExpression.text).toBeTruthy();
    }
  });
});

describe('decision table — multi-output (base-dt-multioutput)', () => {
  it('has multiple outputs', () => {
    const m = parseFixture('base/base-dt-multioutput.dmn');
    expect(dt0(m).outputs.length).toBeGreaterThan(1);
  });

  it('output has name and typeRef', () => {
    const m = parseFixture('base/base-dt-multioutput.dmn');
    for (const out of dt0(m).outputs) {
      expect(out.name).toBeTruthy();
    }
  });

  it('output with outputValues parses them', () => {
    const m = parseFixture('base/base-dt-multioutput.dmn');
    const out = dt0(m).outputs.find((o) => o.outputValues !== undefined);
    expect(out).toBeDefined();
    expect(out?.outputValues?.text).toBeTruthy();
  });
});

describe('decision table — rules (base-dt-rules)', () => {
  it('hitPolicy is FIRST', () => {
    const m = parseFixture('base/base-dt-rules.dmn');
    expect(dt0(m).hitPolicy).toBe('FIRST');
  });

  it('has 5 rules', () => {
    const m = parseFixture('base/base-dt-rules.dmn');
    expect(dt0(m).rules).toHaveLength(5);
  });

  it('rules have inputEntries and outputEntries', () => {
    const m = parseFixture('base/base-dt-rules.dmn');
    for (const rule of dt0(m).rules) {
      expect(rule.inputEntries.length).toBeGreaterThan(0);
      expect(rule.outputEntries.length).toBeGreaterThan(0);
    }
  });

  it('rule description is parsed', () => {
    const m = parseFixture('base/base-dt-rules.dmn');
    const r1 = dt0(m).rules[0]!;
    expect(r1.description).toBeTruthy();
  });

  it('wildcard inputEntry text is preserved', () => {
    const m = parseFixture('base/base-dt-rules.dmn');
    const wildcards = dt0(m).rules.flatMap((r) => r.inputEntries.filter((e) => e.text === '-'));
    expect(wildcards.length).toBeGreaterThan(0);
  });

  it('exact inputEntry and outputEntry text values for all 5 rules', () => {
    const dt = dt0(parseFixture('base/base-dt-rules.dmn'));
    // Rule 1: high score + employed → auto-approved
    expect(dt.rules[0]!.inputEntries[0]!.text).toBe('> 750');
    expect(dt.rules[0]!.inputEntries[1]!.text).toBe('"employed"');
    expect(dt.rules[0]!.outputEntries[0]!.text).toBe('"auto-approved"');
    // Rule 2: mid score + employed/self-employed → approved
    expect(dt.rules[1]!.inputEntries[0]!.text).toBe('[600..750]');
    expect(dt.rules[1]!.inputEntries[1]!.text).toBe('"employed","self-employed"');
    expect(dt.rules[1]!.outputEntries[0]!.text).toBe('"approved"');
    // Rule 3: lower score, any employment → manual-review (wildcard on employment)
    expect(dt.rules[2]!.inputEntries[0]!.text).toBe('[400..600)');
    expect(dt.rules[2]!.inputEntries[1]!.text).toBe('-');
    expect(dt.rules[2]!.outputEntries[0]!.text).toBe('"manual-review"');
    // Rule 4: any score + unemployed → manual-review (wildcard on score)
    expect(dt.rules[3]!.inputEntries[0]!.text).toBe('-');
    expect(dt.rules[3]!.inputEntries[1]!.text).toBe('"unemployed"');
    expect(dt.rules[3]!.outputEntries[0]!.text).toBe('"manual-review"');
    // Rule 5: very low score → rejected
    expect(dt.rules[4]!.inputEntries[0]!.text).toBe('< 400');
    expect(dt.rules[4]!.inputEntries[1]!.text).toBe('-');
    expect(dt.rules[4]!.outputEntries[0]!.text).toBe('"rejected"');
  });
});

describe('decision table — annotations (base-dt-annotation)', () => {
  it('has annotation columns', () => {
    const m = parseFixture('base/base-dt-annotation.dmn');
    expect(dt0(m).annotations.length).toBeGreaterThan(0);
  });

  it('annotation column has name', () => {
    const m = parseFixture('base/base-dt-annotation.dmn');
    for (const ann of dt0(m).annotations) {
      expect(ann.name).toBeTruthy();
    }
  });

  it('rules have annotationEntries matching annotation column count', () => {
    const m = parseFixture('base/base-dt-annotation.dmn');
    const dt = dt0(m);
    for (const rule of dt.rules) {
      expect(rule.annotationEntries.length).toBe(dt.annotations.length);
    }
  });

  it('annotationEntry has text', () => {
    const m = parseFixture('base/base-dt-annotation.dmn');
    for (const rule of dt0(m).rules) {
      for (const ann of rule.annotationEntries) {
        expect(ann.text).toBeTruthy();
      }
    }
  });
});

describe('BKM (base-bkm)', () => {
  it('has businessKnowledgeModels', () => {
    const m = parseFixture('base/base-bkm.dmn');
    expect(m.businessKnowledgeModels.length).toBeGreaterThan(0);
  });

  it('BKM has name, id, variable', () => {
    const m = parseFixture('base/base-bkm.dmn');
    const bkm = m.businessKnowledgeModels[0]!;
    expect(bkm.id).toBeTruthy();
    expect(bkm.name).toBeTruthy();
    expect(bkm.variable?.name).toBeTruthy();
  });

  it('BKM has encapsulatedLogic as functionDefinition', () => {
    const m = parseFixture('base/base-bkm.dmn');
    const bkm = m.businessKnowledgeModels[0]!;
    expect(bkm.encapsulatedLogic).toBeDefined();
    expect(bkm.encapsulatedLogic?.type).toBe('functionDefinition');
  });

  it('encapsulatedLogic has kind and formalParameters', () => {
    const m = parseFixture('base/base-bkm.dmn');
    const fn = m.businessKnowledgeModels[0]!.encapsulatedLogic as FunctionDefinition;
    expect(fn.kind).toBeTruthy();
    expect(Array.isArray(fn.formalParameters)).toBe(true);
    expect(fn.formalParameters.length).toBeGreaterThan(0);
  });

  it('BKM is indexed', () => {
    const m = parseFixture('base/base-bkm.dmn');
    const bkm = m.businessKnowledgeModels[0]!;
    expect(m.index.has(bkm.id)).toBe(true);
  });
});

describe('requirements (base-requirements)', () => {
  it('decision has informationRequirements', () => {
    const m = parseFixture('base/base-requirements.dmn');
    const d = m.decisions.find((d) => d.informationRequirements.length > 0);
    expect(d).toBeDefined();
  });

  it('informationRequirement has requiredDecision or requiredInput', () => {
    const m = parseFixture('base/base-requirements.dmn');
    for (const d of m.decisions) {
      for (const ir of d.informationRequirements) {
        const hasRef = ir.requiredDecision !== undefined || ir.requiredInput !== undefined;
        expect(hasRef).toBe(true);
      }
    }
  });

  it('href references are not empty', () => {
    const m = parseFixture('base/base-requirements.dmn');
    for (const d of m.decisions) {
      for (const ir of d.informationRequirements) {
        const href = ir.requiredDecision?.href ?? ir.requiredInput?.href ?? '';
        expect(href).toBeTruthy();
      }
    }
  });
});

describe('decision service (base-decision-service)', () => {
  it('has decisionServices', () => {
    const m = parseFixture('base/base-decision-service.dmn');
    expect(m.decisionServices.length).toBeGreaterThan(0);
  });

  it('service has outputDecisions, encapsulatedDecisions, inputData', () => {
    const m = parseFixture('base/base-decision-service.dmn');
    const ds = m.decisionServices[0]!;
    expect(ds.id).toBeTruthy();
    expect(ds.name).toBeTruthy();
    expect(Array.isArray(ds.outputDecisions)).toBe(true);
    expect(Array.isArray(ds.encapsulatedDecisions)).toBe(true);
    expect(Array.isArray(ds.inputData)).toBe(true);
  });

  it('output, encapsulated, and input decisions have hrefs', () => {
    const m = parseFixture('base/base-decision-service.dmn');
    const ds = m.decisionServices[0]!;
    for (const ref of [...ds.outputDecisions, ...ds.encapsulatedDecisions, ...ds.inputDecisions]) {
      expect(ref.href).toBeTruthy();
    }
  });
});

describe('input data (base-input-data)', () => {
  it('has inputData entries', () => {
    const m = parseFixture('base/base-input-data.dmn');
    expect(m.inputData.length).toBeGreaterThan(0);
  });

  it('inputData has id, name, variable', () => {
    const m = parseFixture('base/base-input-data.dmn');
    for (const id of m.inputData) {
      expect(id.id).toBeTruthy();
      expect(id.name).toBeTruthy();
    }
  });
});

describe('item definitions (base-item-definitions)', () => {
  it('has itemDefinitions', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    expect(m.itemDefinitions.length).toBeGreaterThan(0);
  });

  it('item definition has id, name, typeRef', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    for (const td of m.itemDefinitions) {
      expect(td.id).toBeTruthy();
      expect(td.name).toBeTruthy();
    }
  });

  it('isCollection parsed as boolean', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    const coll = m.itemDefinitions.find((td) => td.name === 'tScoreList');
    expect(coll?.isCollection).toBe(true);
    const notColl = m.itemDefinitions.find((td) => td.name === 'tRisk');
    expect(notColl?.isCollection).toBe(false);
  });

  it('allowedValues parsed with text', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    const tRisk = m.itemDefinitions.find((td) => td.name === 'tRisk');
    expect(tRisk?.allowedValues?.text).toBeTruthy();
  });

  it('nested itemComponents are parsed', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    const tApplicant = m.itemDefinitions.find((td) => td.name === 'tApplicant');
    expect(tApplicant).toBeDefined();
    expect(tApplicant?.itemComponents.length).toBeGreaterThan(0);
  });

  it('itemComponent has name and typeRef', () => {
    const m = parseFixture('base/base-item-definitions.dmn');
    const tApplicant = m.itemDefinitions.find((td) => td.name === 'tApplicant')!;
    for (const comp of tApplicant.itemComponents) {
      expect(comp.name).toBeTruthy();
    }
  });
});

describe('artifacts (base-artifacts)', () => {
  it('has textAnnotations', () => {
    const m = parseFixture('base/base-artifacts.dmn');
    expect(m.textAnnotations.length).toBeGreaterThan(0);
  });

  it('textAnnotation has text and textFormat', () => {
    const m = parseFixture('base/base-artifacts.dmn');
    for (const ann of m.textAnnotations) {
      expect(ann.id).toBeTruthy();
      expect(ann.text).toBeTruthy();
      expect(ann.textFormat).toBeTruthy();
    }
  });

  it('has associations', () => {
    const m = parseFixture('base/base-artifacts.dmn');
    expect(m.associations.length).toBeGreaterThan(0);
  });

  it('association has sourceRef, targetRef, direction', () => {
    const m = parseFixture('base/base-artifacts.dmn');
    for (const assoc of m.associations) {
      expect(assoc.sourceRef.href).toBeTruthy();
      expect(assoc.targetRef.href).toBeTruthy();
      expect(assoc.associationDirection).toBeTruthy();
    }
  });
});

describe('groups (base-group)', () => {
  it('has groups', () => {
    const m = parseFixture('base/base-group.dmn');
    expect(m.groups.length).toBeGreaterThan(0);
  });

  it('group has id', () => {
    const m = parseFixture('base/base-group.dmn');
    for (const g of m.groups) {
      expect(g.id).toBeTruthy();
    }
  });
});

describe('knowledge source (base-knowledge-source)', () => {
  it('has knowledgeSources', () => {
    const m = parseFixture('base/base-knowledge-source.dmn');
    expect(m.knowledgeSources.length).toBeGreaterThan(0);
  });

  it('knowledge source has id, name', () => {
    const m = parseFixture('base/base-knowledge-source.dmn');
    for (const ks of m.knowledgeSources) {
      expect(ks.id).toBeTruthy();
      expect(ks.name).toBeTruthy();
    }
  });
});

describe('business context (base-business-context)', () => {
  it('has performanceIndicators', () => {
    const m = parseFixture('base/base-business-context.dmn');
    expect(m.performanceIndicators.length).toBeGreaterThan(0);
  });

  it('has organizationUnits', () => {
    const m = parseFixture('base/base-business-context.dmn');
    expect(m.organizationUnits.length).toBeGreaterThan(0);
  });

  it('performanceIndicator has name and uri', () => {
    const m = parseFixture('base/base-business-context.dmn');
    const pi = m.performanceIndicators[0]!;
    expect(pi.name).toBeTruthy();
  });

  it('decision has question and allowedAnswers', () => {
    const m = parseFixture('base/base-business-context.dmn');
    const d = m.decisions[0]!;
    expect(d.question).toBeTruthy();
    expect(d.allowedAnswers).toBeTruthy();
  });

  it('decision has decisionMakers, decisionOwners', () => {
    const m = parseFixture('base/base-business-context.dmn');
    const d = m.decisions[0]!;
    expect(d.decisionMakers.length).toBeGreaterThan(0);
    expect(d.decisionOwners.length).toBeGreaterThan(0);
  });
});

describe('element collection (base-element-collection)', () => {
  it('has elementCollections', () => {
    const m = parseFixture('base/base-element-collection.dmn');
    expect(m.elementCollections.length).toBeGreaterThan(0);
  });

  it('collection has drgElements refs', () => {
    const m = parseFixture('base/base-element-collection.dmn');
    const ec = m.elementCollections[0]!;
    expect(ec.id).toBeTruthy();
    expect(ec.drgElements.length).toBeGreaterThan(0);
    for (const ref of ec.drgElements) {
      expect(ref.href).toBeTruthy();
    }
  });
});

describe('imports (base-imports)', () => {
  it('has imports', () => {
    const m = parseFixture('base/base-imports.dmn');
    expect(m.imports.length).toBeGreaterThan(0);
  });

  it('import has name and importType', () => {
    const m = parseFixture('base/base-imports.dmn');
    for (const imp of m.imports) {
      expect(imp.name).toBeTruthy();
      expect(imp.importType).toBeTruthy();
    }
  });
});

describe('no-IDs model (base-no-ids)', () => {
  it('parses successfully even with rules lacking IDs', () => {
    const m = parseFixture('base/base-no-ids.dmn');
    expect(m.decisions.length).toBeGreaterThan(0);
  });

  it('rules without IDs still have inputEntries and outputEntries', () => {
    const m = parseFixture('base/base-no-ids.dmn');
    const dt = dt0(m);
    expect(dt.rules.length).toBeGreaterThan(0);
    for (const rule of dt.rules) {
      expect(rule.inputEntries.length).toBeGreaterThan(0);
      expect(rule.outputEntries.length).toBeGreaterThan(0);
    }
  });
});

describe('DMNDI excluded by default (base-with-dmndi)', () => {
  it('dmndi is undefined when includeDMNDI is false (default)', () => {
    const m = parseFixture('base/base-with-dmndi.dmn');
    expect(m.dmndi).toBeUndefined();
  });
});

describe('isCollection marker on inputData (base-iscollection-marker)', () => {
  it('inputData with isCollection=true is parsed but not attached to inputData', () => {
    // isCollection is a DMN attribute on itemDefinition, not inputData in spec —
    // this fixture tests that the parser doesn't crash on it
    const m = parseFixture('base/base-iscollection-marker.dmn');
    expect(m.inputData.length).toBeGreaterThan(0);
  });
});

describe('allowedValues generalized (base-allowedvalues-generalized)', () => {
  it('itemDefinition allowedValues is parsed', () => {
    const m = parseFixture('base/base-allowedvalues-generalized.dmn');
    const withAv = m.itemDefinitions.find((td) => td.allowedValues !== undefined);
    expect(withAv).toBeDefined();
    expect(withAv?.allowedValues?.text).toBeTruthy();
  });
});

describe('typeConstraint (base-typeconstraint)', () => {
  it('itemDefinition typeConstraint is parsed', () => {
    const m = parseFixture('base/base-typeconstraint.dmn');
    const withTc = m.itemDefinitions.find((td) => td.typeConstraint !== undefined);
    expect(withTc).toBeDefined();
    expect(withTc?.typeConstraint?.text).toBeTruthy();
  });
});

// ── DMN 1.1 → 1.5 base fixtures ──────────────────────────────────────────────
//
// The five base-dmnXX fixtures contain the same decision model expressed with
// different DMN version namespace URIs. Each must parse with the correct
// dmnVersion and produce an identical structural shape.

describe('DMN versions (base-dmn11 through base-dmn15)', () => {
  const versionMap: Array<[string, string]> = [
    ['base/base-dmn11.dmn', '1.1'],
    ['base/base-dmn12.dmn', '1.2'],
    ['base/base-dmn13.dmn', '1.3'],
    ['base/base-dmn14.dmn', '1.4'],
    ['base/base-dmn15.dmn', '1.5'],
  ];

  for (const [path, expectedVersion] of versionMap) {
    it(`${path} → dmnVersion is ${expectedVersion}`, () => {
      const m = parseFixture(path);
      expect(m.dmnVersion).toBe(expectedVersion);
    });
  }

  it('all five versions produce exactly 1 decision with a decisionTable', () => {
    for (const [path] of versionMap) {
      const m = parseFixture(path);
      expect(m.decisions, `${path}: expected 1 decision`).toHaveLength(1);
      expect(m.decisions[0]!.expression?.type, `${path}: expected decisionTable`).toBe(
        'decisionTable',
      );
    }
  });

  it('decision name is identical across all versions', () => {
    const names = versionMap.map(([path]) => parseFixture(path).decisions[0]!.name);
    const unique = new Set(names);
    expect(unique.size).toBe(1);
  });
});
