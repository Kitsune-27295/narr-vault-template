import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { describe, it, expect } from 'vitest';
import { validateLedgers } from '../tools/vault/ledger-validator.js';

describe('Continuity Ledger Validator Suite', () => {
  it('should validate all ledgers in the repository without fatal issues', () => {
    const report = validateLedgers(process.cwd());
    expect(report).toBeDefined();
    expect(report.issues).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it('should detect same-chapter payoff violations and invalid statuses in malformed fixtures', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-test-'));
    try {
      const ledgersDir = path.join(tempDir, 'Ledgers');
      fs.mkdirSync(ledgersDir, { recursive: true });

      // Create malformed Chekhov ledger
      fs.writeFileSync(path.join(ledgersDir, 'LDG-Chekhov.md'), `
| Element | Planted in | Payoff in | Status | Note |
|---|---|---|---|---|
| Same Chapter Gun | C01 | C01 | planted | Coincidence |
| Invalid Status Gun | C01 | C03 | unknown_state | Test |
      `.trim());

      fs.writeFileSync(path.join(ledgersDir, 'LDG-Decisions.md'), `| Date | Decision | What was rejected | Why | Chapter |\n|---|---|---|---|---|\n| 2026-11-01 | Test | None | Rationale | C01 |`);
      fs.writeFileSync(path.join(ledgersDir, 'LDG-Open_Threads.md'), `| ID | Thread / Investigation | Opened in | Target | Status |\n|---|---|---|---|---|\n| THR-01 | Test | C01 | ARC_01 | active |`);
      fs.writeFileSync(path.join(ledgersDir, 'LDG-Contradictions.md'), `| Date | Scope | Side A | Side B | Status | Resolution |\n|---|---|---|---|---|---|\n| 2026-11-01 | Test | A | B | resolved | Fix |`);

      const report = validateLedgers(tempDir);
      expect(report.valid).toBe(false);
      expect(report.issues.some(err => err.includes('Same-chapter payoff violation'))).toBe(true);
      expect(report.issues.some(err => err.includes('Invalid status in LDG-Chekhov.md'))).toBe(true);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
