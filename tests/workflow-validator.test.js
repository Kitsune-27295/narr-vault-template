import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateWorkflow } from '../tools/workflow-validator.js';

describe('native workflow validator', () => {
  it('accepts the repository skill chain', () => {
    const result = validateWorkflow(process.cwd());
    expect(result.errors).toEqual([]);
  });

  it('reports missing skills, invalid metadata, broken references, and external paths', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-'));
    try {
      const skill = path.join(root, '.agents/skills/grilling');
      fs.mkdirSync(skill, { recursive: true });
      fs.writeFileSync(path.join(skill, 'SKILL.md'), '---\nname: wrong\ndescription: test\n---\nSee [guide](missing.md) C:\\Users\\person\\.gemini\\skills');
      const result = validateWorkflow(root);
      expect(result.errors.some((error) => error.includes('missing skill'))).toBe(true);
      expect(result.errors.some((error) => error.includes('name'))).toBe(true);
      expect(result.errors.some((error) => error.includes('reference'))).toBe(true);
      expect(result.errors.some((error) => error.includes('external'))).toBe(true);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('rejects a skill with a missing handoff even when the shared phase map names it', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-contract-'));
    try {
      const skill = path.join(root, '.agents/skills/grilling');
      fs.mkdirSync(skill, { recursive: true });
      fs.writeFileSync(path.join(skill, 'SKILL.md'), '---\nname: grilling\ndescription: test\n---\nThis handles materially unresolved decisions.');
      const docs = path.join(root, 'docs/agents');
      fs.mkdirSync(docs, { recursive: true });
      fs.writeFileSync(path.join(docs, 'native-construction-workflow.md'), 'grilling to-spec to-tickets implement tdd code-review');
      const result = validateWorkflow(root);
      expect(result.errors).toContain('grilling: missing protocol requirement $to-spec');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
