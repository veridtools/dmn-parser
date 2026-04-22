import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const SIMPLE_DMN = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <decision id="d1" name="Approval">
    <literalExpression id="le1"><text>true</text></literalExpression>
  </decision>
</definitions>`;

function writeTmp(name: string, content: string): string {
  const path = join(tmpdir(), name);
  writeFileSync(path, content, 'utf-8');
  return path;
}

function run(args: string, cwd?: string): { stdout: string; stderr: string; code: number } {
  try {
    const stdout = execSync(`node --import tsx/esm bin/dmn-parser.ts ${args}`, {
      cwd: cwd ?? ROOT,
      encoding: 'utf-8',
      env: { ...process.env, NO_COLOR: '1' },
    });
    return { stdout, stderr: '', code: 0 };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; status?: number };
    return { stdout: e.stdout ?? '', stderr: e.stderr ?? '', code: e.status ?? 1 };
  }
}

describe('dmn-parser CLI', () => {
  it('exits 0 and shows summary for valid file', () => {
    const path = writeTmp('test.dmn', SIMPLE_DMN);
    const { code, stdout } = run(`"${path}"`);
    expect(code).toBe(0);
    expect(stdout).toContain('DMN version');
    expect(stdout).toContain('1.5');
  });

  it('--json outputs valid JSON', () => {
    const path = writeTmp('test.dmn', SIMPLE_DMN);
    const { code, stdout } = run(`"${path}" --json`);
    expect(code).toBe(0);
    const obj = JSON.parse(stdout);
    expect(obj.dmnVersion).toBe('1.5');
    expect(Array.isArray(obj.decisions)).toBe(true);
  });

  it('--elements lists indexed IDs', () => {
    const path = writeTmp('test.dmn', SIMPLE_DMN);
    const { code, stdout } = run(`"${path}" --elements`);
    expect(code).toBe(0);
    expect(stdout).toContain('d1');
    expect(stdout).toContain('le1');
  });

  it('exits 1 for missing file', () => {
    const { code } = run('"nonexistent.dmn"');
    expect(code).toBe(1);
  });

  it('--help exits 0 and prints banner', () => {
    const { code, stdout } = run('--help');
    expect(code).toBe(0);
    expect(stdout).toContain('dmn-parser');
  });

  it('exits 1 for unknown flag', () => {
    const path = writeTmp('test.dmn', SIMPLE_DMN);
    const { code } = run(`"${path}" --unknown-flag`);
    expect(code).toBe(1);
  });
});
