import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolves file content, expanding one-line `@filename` imports.
 */
function readHarnessFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (raw.startsWith('@')) {
    const target = path.resolve(path.dirname(filePath), raw.slice(1).trim());
    return fs.readFileSync(target, 'utf8').trim();
  }
  return raw;
}

/**
 * Test Suite: AI Coding Agent Harness Parity Monitor
 * Ensures AGENTS.md (Antigravity & generic agents) and CLAUDE.md (Claude Code)
 * maintain strict operational, architectural, and command parity.
 */
describe('AI Agent Harness Parity Monitor (AGENTS.md <-> CLAUDE.md)', () => {
  const rootDir = process.cwd();
  const rulesDir = fs.existsSync(path.join(rootDir, 'AGENTS.md'))
    ? rootDir
    : path.resolve(rootDir, '../../frameworks/vault/narr/rules');

  const agentsPath = path.join(rulesDir, 'AGENTS.md');
  const claudePath = path.join(rulesDir, 'CLAUDE.md');

  it('both AGENTS.md and CLAUDE.md must exist and be non-empty', () => {
    expect(fs.existsSync(agentsPath), 'AGENTS.md must exist').toBe(true);
    expect(fs.existsSync(claudePath), 'CLAUDE.md must exist').toBe(true);

    const agentsContent = readHarnessFile(agentsPath);
    const claudeContent = readHarnessFile(claudePath);

    expect(agentsContent.length).toBeGreaterThan(100);
    expect(claudeContent.length).toBeGreaterThan(100);
  });

  it('must reference the identical Agent Skills infrastructure files', () => {
    const agentsContent = readHarnessFile(agentsPath);
    const claudeContent = readHarnessFile(claudePath);

    const expectedReferences = [
      '.scratch/<feature-slug>/issues/',
      'docs/agents/issue-tracker.md',
      'GLOSSARY.md',
      'docs/adr/',
      'docs/agents/domain.md',
    ];

    for (const ref of expectedReferences) {
      expect(agentsContent, `AGENTS.md missing reference: ${ref}`).toContain(ref);
      expect(claudeContent, `CLAUDE.md missing reference: ${ref}`).toContain(ref);
    }
  });

  it('must declare the identical CLI command lifecycle', () => {
    const agentsContent = readHarnessFile(agentsPath);
    const claudeContent = readHarnessFile(claudePath);

    const requiredCommands = [
      'npm test',
      'npm run validate:templates',
      'npm run clip -- <url>',
      'npm run ingest -- <path>',
      'npm run pipeline -- <url>',
      'npm run rag:sync',
      'npm run rag:search',
      'npm run rag:context',
    ];

    for (const cmd of requiredCommands) {
      expect(agentsContent, `AGENTS.md missing command: ${cmd}`).toContain(cmd);
      expect(claudeContent, `CLAUDE.md missing command: ${cmd}`).toContain(cmd);
    }
  });

  it('must enforce the exact same 3-Layer Vault Architectural boundaries', () => {
    const agentsContent = readHarnessFile(agentsPath);
    const claudeContent = readHarnessFile(claudePath);

    const requiredVaultLayers = [
      '00_Cockpit/',
      'Canon/',
      'Bible/',
      '01_Divergences_AU/',
      'Manuscript/',
      'pt-BR/',
      'es/',
      '99_System/',
    ];

    for (const layer of requiredVaultLayers) {
      expect(agentsContent, `AGENTS.md missing layer: ${layer}`).toContain(layer);
      expect(claudeContent, `CLAUDE.md missing layer: ${layer}`).toContain(layer);
    }
  });

  it('must enforce identical invariant operational rules', () => {
    const agentsContent = readHarnessFile(agentsPath);
    const claudeContent = readHarnessFile(claudePath);

    const invariantKeyPhrases = [
      'en-US',
      'Manuscript/pt-BR/',
      'Manuscript/es/',
      'Points of Divergence',
      'Bible/01_Divergences_AU/',
      'Non-Destructive Sourcing',
      'Fast Feedback & Test Safety',
      'npm test',
    ];

    for (const phrase of invariantKeyPhrases) {
      expect(agentsContent, `AGENTS.md missing invariant rule phrase: ${phrase}`).toContain(phrase);
      expect(claudeContent, `CLAUDE.md missing invariant rule phrase: ${phrase}`).toContain(phrase);
    }
  });
});
