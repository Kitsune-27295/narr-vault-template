import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Test Suite: AI Coding Agent Harness Parity Monitor
 * Ensures AGENTS.md (generic agent harnesses) and CLAUDE.md (Claude Code)
 * maintain strict operational, architectural, and command parity.
 */
describe('AI Agent Harness Parity Monitor (AGENTS.md <-> CLAUDE.md)', () => {
  const rootDir = process.cwd();
  const agentsPath = path.join(rootDir, 'AGENTS.md');
  const claudePath = path.join(rootDir, 'CLAUDE.md');

  it('both AGENTS.md and CLAUDE.md must exist and be non-empty', () => {
    expect(fs.existsSync(agentsPath), 'AGENTS.md must exist in root').toBe(true);
    expect(fs.existsSync(claudePath), 'CLAUDE.md must exist in root').toBe(true);

    const agentsContent = fs.readFileSync(agentsPath, 'utf8').trim();
    const claudeContent = fs.readFileSync(claudePath, 'utf8').trim();

    expect(agentsContent.length).toBeGreaterThan(100);
    expect(claudeContent.length).toBeGreaterThan(100);
  });

  it('must reference the identical Agent Skills infrastructure files', () => {
    const agentsContent = fs.readFileSync(agentsPath, 'utf8');
    const claudeContent = fs.readFileSync(claudePath, 'utf8');

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
      expect(agentsContent, `AGENTS.md missing reference: ${ref}`).toContain(ref);
      expect(claudeContent, `CLAUDE.md missing reference: ${ref}`).toContain(ref);
    }
  });

  it('must declare the identical CLI command lifecycle', () => {
    const agentsContent = fs.readFileSync(agentsPath, 'utf8');
    const claudeContent = fs.readFileSync(claudePath, 'utf8');

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
      expect(agentsContent, `AGENTS.md missing command: ${cmd}`).toContain(cmd);
      expect(claudeContent, `CLAUDE.md missing command: ${cmd}`).toContain(cmd);
    }
  });

  it('must enforce the exact same 3-Layer Vault Architectural boundaries and 10 Bible modules', () => {
    const agentsContent = fs.readFileSync(agentsPath, 'utf8');
    const claudeContent = fs.readFileSync(claudePath, 'utf8');

    const requiredVaultLayers = [
      '00_Cockpit/',
      'Canon/',
      'Sources/',
      'Baselines/',
      'Bible/',
      '01_Divergences_AU/',
      '02_Cast_Characters/',
      '03_Factions_Organizations/',
      '04_Locations/',
      '05_Items_Artifacts/',
      '06_Power_Systems_Mechanics/',
      '07_Relationship_Matrix/',
      '08_Chronology_Calendar/',
      '09_Plot_Threads_Arcs/',
      '10_Terminology_Glossary/',
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

  it('must declare the 15 consolidated vault skills', () => {
    const agentsContent = fs.readFileSync(agentsPath, 'utf8');
    const claudeContent = fs.readFileSync(claudePath, 'utf8');

    const expectedSkills = [
      'research', 'triage', 'ingest', 'dossier-compile', 'query', 'consolidate', 'conflict-arbitration', 'decide',
      'story-arc', 'narrative-architecture-audit', 'foreshadowing-audit', 'tone-and-voice-audit', 'reader-sim', 'revision-pass', 'unblock',
    ];

    for (const skill of expectedSkills) {
      expect(agentsContent, `AGENTS.md missing skill: ${skill}`).toContain(skill);
      expect(claudeContent, `CLAUDE.md missing skill: ${skill}`).toContain(skill);
    }
  });

  it('must enforce identical invariant operational rules', () => {
    const agentsContent = fs.readFileSync(agentsPath, 'utf8');
    const claudeContent = fs.readFileSync(claudePath, 'utf8');

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
      expect(agentsContent, `AGENTS.md missing invariant rule phrase: ${phrase}`).toContain(phrase);
      expect(claudeContent, `CLAUDE.md missing invariant rule phrase: ${phrase}`).toContain(phrase);
    }
  });
});

