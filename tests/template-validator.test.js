import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import {
  validateContent,
  validateFile,
  validateAllTemplates,
  TEMPLATE_SCHEMAS,
} from '../tools/templates/template-validator.js';

describe('Wiki Template Validator Engine', () => {
  const vaultRoot = fs.existsSync(path.join(process.cwd(), '99_System', 'Templates'))
    ? process.cwd()
    : path.resolve(process.cwd(), '../../frameworks/vault/narr/templates');
  const templatesDir = path.join(vaultRoot, '99_System', 'Templates');

  it('all 11 standard archetype templates in 99_System/Templates/ must pass validation', () => {
    const report = validateAllTemplates();
    expect(report.valid).toBe(true);
    expect(report.summary.total).toBe(11);
    expect(report.summary.passed).toBe(11);
    expect(report.summary.failed).toBe(0);
  });

  it('should validate individual canonical character template file', () => {
    const filePath = path.join(templatesDir, 'TPL_Canon_Character.md');
    const result = validateFile(filePath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('canon-character');
    expect(result.errors).toHaveLength(0);
  });

  it('should validate individual Bible POD template file', () => {
    const filePath = path.join(templatesDir, 'TPL_Bible_Divergence_POD.md');
    const result = validateFile(filePath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('fic-pod');
    expect(result.errors).toHaveLength(0);
  });

  it('should reject content with missing frontmatter', () => {
    const content = '# Raw Markdown\nWithout YAML header';
    const result = validateContent(content);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Missing or empty YAML frontmatter block');
  });

  it('should reject content with malformed YAML syntax', () => {
    const content = '---\nnote_type: [unclosed array\n---\n# Title';
    const result = validateContent(content);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Invalid YAML frontmatter');
  });

  it('should reject content with missing mandatory note_type', () => {
    const content = '---\ntype: character\n---\n# Title';
    const result = validateContent(content);

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Missing mandatory frontmatter property: "note_type"');
  });

  it('should reject content missing required fields for the note_type', () => {
    const content = `---
note_type: "canon-character"
type: "character"
cosmology: "Universe_Primary"
---
# Incomplete Character
`;
    const result = validateContent(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('canon_tier'))).toBe(true);
    expect(result.errors.some(e => e.includes('aliases'))).toBe(true);
  });

  it('should reject content with type mismatch against schema contract', () => {
    const content = `---
note_type: "canon-character"
type: "wrong_type"
cosmology: "Universe_Primary"
canon_tier: "G-Primary"
aliases: []
---
# Mismatched Character
`;
    const result = validateContent(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('type" mismatch'))).toBe(true);
  });

  it('should reject content missing mandatory section headings', () => {
    const content = `---
note_type: "canon-character"
type: "character"
cosmology: "Universe_Primary"
canon_tier: "G-Primary"
aliases: []
---
# Character Without Headings

Some intro text without the 8 mandatory numbered sections.
`;
    const result = validateContent(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Missing required section heading'))).toBe(true);
  });

  it('should warn and skip schema enforcement on unindexed custom note_types', () => {
    const content = `---
note_type: "custom-note"
---
# My Custom Note
`;
    const result = validateContent(content);
    expect(result.valid).toBe(true);
    expect(result.warnings.some(w => w.includes('Unknown or unindexed note_type'))).toBe(true);
  });

  it('should parse and validate frontmatter without trailing newline after closing delimiter', () => {
    const content = '---\nnote_type: "custom-note"\n---';
    const result = validateContent(content);
    expect(result.valid).toBe(true);
  });

  it('should parse scene frontmatter with setup_introduced and payoff_resolved', () => {
    const scenePath = path.join(vaultRoot, 'Manuscript', 'pt-BR', '01_Scenes', 'C01_S01_Scene_Template.md');
    const result = validateFile(scenePath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('scene-pt');

    const content = fs.readFileSync(scenePath, 'utf8');
    expect(content).toContain('setup_introduced:');
    expect(content).toContain('payoff_resolved:');
  });

  it('should validate enriched Bible cast profile template with multiverse, dual-tier scaling, resistance matrix and visual prompts', () => {
    const castPath = path.join(templatesDir, 'TPL_Bible_Cast_Profile.md');
    const result = validateFile(castPath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('fic-cast');

    const content = fs.readFileSync(castPath, 'utf8');
    // Section 1
    expect(content).toContain('Biographical & Dimensional Matrix');
    expect(content).toContain('Age (Time-Dilation Adjusted)');
    expect(content).toContain('Divine Domains / Hereditary Traits');
    // Section 2
    expect(content).toContain('art-concept');
    expect(content).toContain('[Subject & Action]:');
    expect(content).toContain('[Aura & Manifestation]:');
    // Section 3
    expect(content).toContain('Dual-Tier Power Scaling & Classification Benchmarks');
    expect(content).toContain('Multiverse Energy Systems & Synergy Matrix');
    expect(content).toContain('Multicross Resistance & Immunity Matrix');
    expect(content).toContain('Modular / Optional LitRPG & Gamer System Interface');
    expect(content).toContain('HP (Health Points)');
    // Section 4 & 5
    expect(content).toContain('Armaments, Sacred Gears & Noble Phantasms');
    expect(content).toContain('Retinue, Peerage & Faction Network');
  });

  it('should validate enriched Canon character template with in-universe parameter matrix and structured proficiencies', () => {
    const canonPath = path.join(templatesDir, 'TPL_Canon_Character.md');
    const result = validateFile(canonPath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('canon-character');

    const content = fs.readFileSync(canonPath, 'utf8');
    expect(content).toContain('In-Universe Parameter Matrix');
    expect(content).toContain('Physical Strength');
    expect(content).toContain('Durability & Resilience');
    expect(content).toContain('Combat Speed & Reflexes');
    expect(content).toContain('Energy Reserves & Output');
    expect(content).toContain('Tactical Intellect');
    expect(content).toContain('Effective Combat Range');
    expect(content).toContain('Primary Energy System Arts & Techniques');
    expect(content).toContain('Physiological Limitations & Energetic Bottlenecks');
  });
});
