import { describe, it, expect } from 'vitest';
import { runDoctorChecks } from '../tools/doctor.js';

describe('Vault Doctor Tool Suite', () => {
  it('should run all diagnostic checks and pass on the target vault', async () => {
    const report = await runDoctorChecks(process.cwd());
    expect(report).toBeDefined();
    expect(report.checks.length).toBeGreaterThan(10);
    expect(report.passed).toBe(true);

    const runtimeCheck = report.checks.find(c => c.category === 'Runtime' && c.name.includes('Node.js'));
    expect(runtimeCheck).toBeDefined();
    expect(runtimeCheck?.passed).toBe(true);

    const configCheck = report.checks.find(c => c.name.includes('vault.yaml'));
    expect(configCheck?.passed).toBe(true);

    const harnessCheck = report.checks.find(c => c.name.includes('memory/hot.md'));
    expect(harnessCheck?.passed).toBe(true);
  });
});

