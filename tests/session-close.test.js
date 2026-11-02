import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { closeSession, parseCliArgs } from '../tools/session-close.js';
import { validateContent } from '../tools/templates/template-validator.js';

const cliPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'tools', 'session-close.js');

describe('Session close', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-close-'));
    fs.mkdirSync(path.join(root, 'Ledgers'), { recursive: true });
    fs.mkdirSync(path.join(root, 'memory'), { recursive: true });
    fs.writeFileSync(path.join(root, 'Ledgers', 'LDG-Session_Handoff.md'), '| Date | Agent | Done | In flight | Next |\n|---|---|---|---|---|\n');
    fs.writeFileSync(path.join(root, 'memory', 'hot.md'), '---\nupdated: 2000-01-01\n---\n# Hot\n');
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('appends a handoff row with a neutral default operator', () => {
    closeSession({ date: '2026-11-02', done: 'Did the thing', next: 'Do the next thing' }, root);
    const ledger = fs.readFileSync(path.join(root, 'Ledgers', 'LDG-Session_Handoff.md'), 'utf8');
    expect(ledger).toContain('| 2026-11-02 | Agent | Did the thing | None | Do the next thing |');
  });

  it('creates a new monthly journal that passes note validation', () => {
    closeSession({ date: '2026-12-05', done: 'December work' }, root);
    const journal = fs.readFileSync(path.join(root, 'memory', 'journal', '2026-12.md'), 'utf8');
    expect(journal).toContain('- [2026-12-05] session | December work');
    const result = validateContent(journal);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it('appends to an existing journal without rewriting its frontmatter', () => {
    closeSession({ date: '2026-12-05', done: 'first' }, root);
    closeSession({ date: '2026-12-06', done: 'second' }, root);
    const journal = fs.readFileSync(path.join(root, 'memory', 'journal', '2026-12.md'), 'utf8');
    expect(journal.match(/^---$/gm)).toHaveLength(2);
    expect(journal).toContain('second');
  });

  it('refreshes the hot memory timestamp and reports a budget breach', () => {
    fs.writeFileSync(path.join(root, 'memory', 'hot.md'), `---\nupdated: 2000-01-01\n---\n${'line\n'.repeat(70)}`);
    const result = closeSession({ date: '2026-11-02', done: 'x' }, root);
    expect(fs.readFileSync(path.join(root, 'memory', 'hot.md'), 'utf8')).toContain('updated: 2026-11-02');
    expect(result.hotBudgetOk).toBe(false);
  });

  it('parses every CLI option including --date', () => {
    expect(parseCliArgs(['--date', '2026-11-02', '--done', 'a', '--in-flight', 'b', '--next', 'c', '--operator', 'd']))
      .toEqual({ date: '2026-11-02', done: 'a', inFlight: 'b', next: 'c', operator: 'd' });
  });

  it('refuses to record a handoff from the CLI without --done', () => {
    const run = spawnSync(process.execPath, [cliPath], { cwd: root, encoding: 'utf8' });
    expect(run.status).toBe(1);
    expect(run.stderr).toContain('Usage:');
    expect(run.stderr).toContain('--done');
    const ledger = fs.readFileSync(path.join(root, 'Ledgers', 'LDG-Session_Handoff.md'), 'utf8');
    expect(ledger.trim().split('\n')).toHaveLength(2);
  });
});
