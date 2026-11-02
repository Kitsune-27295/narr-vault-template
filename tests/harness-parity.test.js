import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Test Suite: Agent contract integrity.
 * AGENTS.md is the single source of truth for every agent harness; CLAUDE.md must only
 * import it and add Claude Code specifics, so the contract is never maintained twice.
 */
describe('Agent contract (AGENTS.md is the single source, CLAUDE.md imports it)', () => {
  const rootDir = process.cwd();
  const agentsPath = path.join(rootDir, 'AGENTS.md');
  const claudePath = path.join(rootDir, 'CLAUDE.md');
  const agents = () => fs.readFileSync(agentsPath, 'utf8');
  const claude = () => fs.readFileSync(claudePath, 'utf8');

  it('both files exist and AGENTS.md carries a substantial contract', () => {
    expect(fs.existsSync(agentsPath), 'AGENTS.md must exist in root').toBe(true);
    expect(fs.existsSync(claudePath), 'CLAUDE.md must exist in root').toBe(true);
    expect(agents().trim().length).toBeGreaterThan(1000);
  });

  it('CLAUDE.md imports AGENTS.md and does not restate the contract', () => {
    const content = claude();
    expect(content).toMatch(/^@AGENTS\.md$/m);
    expect(content.split('\n').length, 'CLAUDE.md must stay a short pointer').toBeLessThan(40);
    expect(content).not.toContain('Invariant Rules for AI Agents');
    expect(content).not.toContain('Cold-Start Sequence');
  });

  it('AGENTS.md references the agent skills infrastructure files', () => {
    const expectedReferences = [
      '.scratch/<feature-slug>/issues/',
      'docs/agents/issue-tracker.md',
      'GLOSSARY.md',
      'docs/adr/',
      'docs/agents/domain.md',
      'docs/agents/native-construction-workflow.md',
      'npm run validate:workflow',
    ];
    for (const ref of expectedReferences) {
      expect(agents(), `AGENTS.md missing reference: ${ref}`).toContain(ref);
    }
  });

  it('AGENTS.md declares the CLI command lifecycle', () => {
    const requiredCommands = [
      'npm test',
      'npm run validate:templates',
      'npm run validate:sources',
      'npm run validate:vault',
      'npm run validate:links',
      'npm run validate:workflow',
      'npm run clip -- <url>',
      'npm run ingest -- <path>',
      'npm run pipeline -- <url>',
      'npm run rag:sync',
      'npm run rag:search',
      'npm run rag:context',
    ];
    for (const cmd of requiredCommands) {
      expect(agents(), `AGENTS.md missing command: ${cmd}`).toContain(cmd);
    }
  });

  it('AGENTS.md enforces the vault layers and the 10 Bible modules', () => {
    const requiredVaultLayers = [
      '00_Cockpit/', 'Canon/', 'Sources/', 'Baselines/', 'Bible/',
      '01_Divergences_AU/', '02_Cast_Characters/', '03_Factions_Organizations/', '04_Locations/',
      '05_Items_Artifacts/', '06_Power_Systems_Mechanics/', '07_Relationship_Matrix/',
      '08_Chronology_Calendar/', '09_Plot_Threads_Arcs/', '10_Terminology_Glossary/',
      'Manuscript/', 'pt-BR/', 'es/', '99_System/',
    ];
    for (const layer of requiredVaultLayers) {
      expect(agents(), `AGENTS.md missing layer: ${layer}`).toContain(layer);
    }
  });

  it('AGENTS.md declares the 15 consolidated vault skills', () => {
    const expectedSkills = [
      'research', 'triage', 'ingest', 'dossier-compile', 'query', 'consolidate', 'conflict-arbitration', 'decide',
      'story-arc', 'narrative-architecture-audit', 'foreshadowing-audit', 'tone-and-voice-audit', 'reader-sim', 'revision-pass', 'unblock',
    ];
    for (const skill of expectedSkills) {
      expect(agents(), `AGENTS.md missing skill: ${skill}`).toContain(skill);
    }
  });

  it('AGENTS.md states the invariant operational rules', () => {
    const invariantKeyPhrases = [
      'en-US',
      'Manuscript/pt-BR/',
      'Manuscript/es/',
      'Points of Divergence',
      'Bible/01_Divergences_AU/',
      'Single-Link Baseline Provenance',
      'Non-Destructive Sourcing',
      'Fast Feedback & Test Safety',
      'npm test',
      'Authoritative Timeline Alignment',
      'Standardized Information Architecture (SNIA) & UID Conventions',
      'docs/adr/0008-standardized-vault-information-architecture.md',
    ];
    for (const phrase of invariantKeyPhrases) {
      expect(agents(), `AGENTS.md missing invariant rule phrase: ${phrase}`).toContain(phrase);
    }
  });

  it('AGENTS.md stays within the line budget declared in vault.yaml', () => {
    const vault = fs.readFileSync(path.join(rootDir, 'vault.yaml'), 'utf8');
    const budget = Number(/agents_lines:\s*(\d+)/.exec(vault)?.[1]);
    expect(budget).toBeGreaterThan(0);
    expect(agents().split('\n').length).toBeLessThanOrEqual(budget);
  });
});
