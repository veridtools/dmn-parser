import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { loadFixture } from '@veridtools/dmn-fixtures';
import { safeParse } from '../parse.js';
import type { DecisionTable, DMNModel, Expression } from '../types.js';

export interface TestCase {
  context: Record<string, unknown>;
  expected: Record<string, unknown>;
}
export interface TestCasesFile {
  description?: string;
  cases: TestCase[];
}

const _require = createRequire(import.meta.url);
const _loaderPath = _require.resolve('@veridtools/dmn-fixtures/dist/loader.js');
const FIXTURES_DIR = join(dirname(_loaderPath), '..', 'fixtures');

/** Load the companion test-cases JSON file for a fixture (testCasesPath from CATALOG entry). */
export function loadTestCasesJson(testCasesPath: string): TestCasesFile {
  return JSON.parse(readFileSync(join(FIXTURES_DIR, testCasesPath), 'utf-8')) as TestCasesFile;
}

export function parseFixture(path: string): DMNModel {
  const xml = loadFixture(path);
  const result = safeParse(xml);
  if (!result.success) {
    throw new Error(`${path} failed to parse: ${result.errors[0]?.message}`);
  }
  return result.model;
}

export function decision0(model: DMNModel) {
  const d = model.decisions[0];
  if (!d) throw new Error('No decisions in model');
  return d;
}

export function expr0(model: DMNModel): Expression {
  const expr = decision0(model).expression;
  if (!expr) throw new Error('No expression on first decision');
  return expr;
}

export function dt0(model: DMNModel): DecisionTable {
  const expr = expr0(model);
  if (expr.type !== 'decisionTable') throw new Error(`Expected decisionTable, got ${expr.type}`);
  return expr;
}
