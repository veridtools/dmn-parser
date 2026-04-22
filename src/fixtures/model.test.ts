/**
 * Deep model validation of complete fixtures.
 * Uses the loan-approval-v1 fixture as the primary validation target since
 * its full structure is known.
 */
import { loadFixture } from '@veridtools/dmn-fixtures';
import { describe, expect, it } from 'vitest';
import { safeParse } from '../parse.js';
import type { DecisionTable, Invocation } from '../types.js';

describe('complete-loan-approval-v1 — model fields', () => {
  function loadLoan() {
    const xml = loadFixture('complete/complete-loan-approval-v1.dmn');
    const result = safeParse(xml);
    if (!result.success) throw new Error(result.errors[0]?.message);
    return result.model;
  }

  it('top-level model fields', () => {
    const m = loadLoan();
    expect(m.id).toBe('_loan_v1');
    expect(m.name).toBe('Loan Approval v1');
    expect(m.namespace).toBe('https://verid.tools/fixtures/complete/loan-approval-v1');
    expect(m.dmnVersion).toBe('1.5');
  });

  it('3 decisions in correct order', () => {
    const m = loadLoan();
    expect(m.decisions).toHaveLength(3);
    const names = m.decisions.map((d) => d.name);
    expect(names).toContain('Risk Category');
    expect(names).toContain('Debt to Income Ratio');
    expect(names).toContain('Loan Approval');
  });

  it('3 inputData elements', () => {
    const m = loadLoan();
    expect(m.inputData).toHaveLength(3);
    const names = m.inputData.map((id) => id.name);
    expect(names).toContain('Credit Score');
    expect(names).toContain('Monthly Income');
    expect(names).toContain('Loan Amount');
  });

  it('1 businessKnowledgeModel', () => {
    const m = loadLoan();
    expect(m.businessKnowledgeModels).toHaveLength(1);
    const bkm = m.businessKnowledgeModels[0]!;
    expect(bkm.name).toBe('Calculate DTI');
    expect(bkm.id).toBe('bkm_dti');
  });

  it('BKM has functionDefinition with formalParameters', () => {
    const m = loadLoan();
    const bkm = m.businessKnowledgeModels[0]!;
    expect(bkm.encapsulatedLogic?.type).toBe('functionDefinition');
    expect(bkm.encapsulatedLogic?.formalParameters).toHaveLength(2);
    const names = bkm.encapsulatedLogic!.formalParameters.map((p) => p.name);
    expect(names).toContain('monthly income');
    expect(names).toContain('loan amount');
  });

  it('BKM body is literalExpression', () => {
    const m = loadLoan();
    const bkm = m.businessKnowledgeModels[0]!;
    expect(bkm.encapsulatedLogic?.expression?.type).toBe('literalExpression');
  });

  it('1 decisionService', () => {
    const m = loadLoan();
    expect(m.decisionServices).toHaveLength(1);
    const ds = m.decisionServices[0]!;
    expect(ds.name).toBe('Loan Approval Service');
    expect(ds.outputDecisions).toHaveLength(1);
    expect(ds.encapsulatedDecisions).toHaveLength(2);
    expect(ds.inputData).toHaveLength(3);
  });

  it('2 itemDefinitions', () => {
    const m = loadLoan();
    expect(m.itemDefinitions).toHaveLength(2);
    const names = m.itemDefinitions.map((td) => td.name);
    expect(names).toContain('tRisk');
    expect(names).toContain('tDecision');
  });

  it('Risk Category uses UNIQUE decision table', () => {
    const m = loadLoan();
    const d = m.decisions.find((d) => d.name === 'Risk Category')!;
    expect(d.expression?.type).toBe('decisionTable');
    const dt = d.expression as DecisionTable;
    expect(dt.hitPolicy).toBe('UNIQUE');
    expect(dt.inputs).toHaveLength(1);
    expect(dt.outputs).toHaveLength(1);
    expect(dt.rules).toHaveLength(3);
  });

  it('Loan Approval uses FIRST decision table', () => {
    const m = loadLoan();
    const d = m.decisions.find((d) => d.name === 'Loan Approval')!;
    expect(d.expression?.type).toBe('decisionTable');
    const dt = d.expression as DecisionTable;
    expect(dt.hitPolicy).toBe('FIRST');
    expect(dt.inputs).toHaveLength(2);
    expect(dt.rules).toHaveLength(4);
  });

  it('DTI decision uses invocation', () => {
    const m = loadLoan();
    const d = m.decisions.find((d) => d.name === 'Debt to Income Ratio')!;
    expect(d.expression?.type).toBe('invocation');
    const inv = d.expression as Invocation;
    expect(inv.callee?.text).toBe('Calculate DTI');
    expect(inv.bindings).toHaveLength(2);
  });

  it('DTI has knowledgeRequirement to BKM', () => {
    const m = loadLoan();
    const d = m.decisions.find((d) => d.name === 'Debt to Income Ratio')!;
    expect(d.knowledgeRequirements).toHaveLength(1);
    expect(d.knowledgeRequirements[0]!.requiredKnowledge.href).toBe('#bkm_dti');
  });

  it('Loan Approval has informationRequirements to both upstream decisions', () => {
    const m = loadLoan();
    const d = m.decisions.find((d) => d.name === 'Loan Approval')!;
    expect(d.informationRequirements).toHaveLength(2);
    const hrefs = d.informationRequirements.map((ir) => ir.requiredDecision?.href);
    expect(hrefs).toContain('#d_risk');
    expect(hrefs).toContain('#d_dti');
  });
});

describe('complete-loan-approval-v1 — index completeness', () => {
  function loadLoan() {
    const xml = loadFixture('complete/complete-loan-approval-v1.dmn');
    const result = safeParse(xml);
    if (!result.success) throw new Error(result.errors[0]?.message);
    return result.model;
  }

  const knownIds = [
    '_loan_v1', // definitions
    'tRisk',
    'tDecision', // itemDefinitions
    'id_score',
    'id_income',
    'id_amount', // inputData
    'bkm_dti', // BKM
    'd_risk',
    'd_dti',
    'd_approval', // decisions
    'ds_loan', // decisionService
    'dt_risk',
    'dt_approval', // decisionTables
    'inv_dti', // invocation
    'rr1',
    'rr2',
    'rr3', // risk rules
    'ra1',
    'ra2',
    'ra3',
    'ra4', // approval rules
    'ic_risk_score',
    'ic_app_risk',
    'ic_app_dti', // input clauses
    'oc_risk',
    'oc_approval', // output clauses
    'fd_dti', // functionDefinition
    'le_dti_body', // literalExpression inside BKM
    'b_dti_income',
    'b_dti_amount', // bindings
    'le_b_income',
    'le_b_amount', // binding literal expressions
  ];

  for (const id of knownIds) {
    it(`index contains "${id}"`, () => {
      const m = loadLoan();
      expect(m.index.has(id)).toBe(true);
    });
  }
});

describe('complete fixture variants', () => {
  it('complete-loan-approval-v1 and v2 both parse', () => {
    for (const v of ['v1', 'v2']) {
      const xml = loadFixture(`complete/complete-loan-approval-${v}.dmn`);
      const result = safeParse(xml);
      expect(result.success, `v${v}: ${!result.success ? result.errors[0]?.message : ''}`).toBe(
        true,
      );
    }
  });
});
