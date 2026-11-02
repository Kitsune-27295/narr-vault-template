import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {
  validateContent,
  validateFile,
  validateAllTemplates,
  validateVaultNotes,
  validateSourceCaptures,
  TEMPLATE_SCHEMAS,
} from '../tools/templates/template-validator.js';

describe('Wiki Template Validator Engine', () => {
  const templatesDir = path.join(process.cwd(), '99_System', 'Templates');

  it('all standard templates and explicitly deprecated templates must be accounted for', () => {
    const report = validateAllTemplates();
    expect(report.valid).toBe(true);
    expect(report.summary.total).toBe(11);
    expect(report.summary.passed).toBe(11);
    expect(report.summary.failed).toBe(0);
  });

  it('should validate individual canonical baseline template file', () => {
    const filePath = path.join(templatesDir, 'TPL_Canon_Baseline.md');
    const result = validateFile(filePath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('canon-baseline');
    expect(result.errors).toHaveLength(0);
  });

  it('should validate individual Bible POD template file', () => {
    const filePath = path.join(templatesDir, 'TPL_Bible_Divergence_POD.md');
    const result = validateFile(filePath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('fic-pod');
    expect(result.errors).toHaveLength(0);
  });

  it('should validate individual Bible AU Power System template file', () => {
    const filePath = path.join(templatesDir, 'TPL_Bible_Power_System.md');
    const result = validateFile(filePath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('fic-power-system');
    expect(result.errors).toHaveLength(0);
  });

  it('should validate individual Bible AU Technique template file', () => {
    const filePath = path.join(templatesDir, 'TPL_Bible_Technique.md');
    const result = validateFile(filePath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('fic-technique');
    expect(result.errors).toHaveLength(0);
  });

  it('should validate individual Bible AU Item Artifact template file', () => {
    const filePath = path.join(templatesDir, 'TPL_Bible_Item_Artifact.md');
    const result = validateFile(filePath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('fic-item');
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

  it('should reject AU and fanon tiers on Canon dossiers', () => {
    for (const tier of ['AU-Override', 'F-Fanon']) {
      const content = ['---', 'note_type: canon-character', 'type: character', 'cosmology: Universe_Alpha', `canon_tier: ${tier}`, 'status: known', 'aliases: []', '---', '## Summary', '## Source-backed details', '## Sources and scope'].join('\n');
      expect(validateContent(content).errors.some(error => error.includes('canon_tier'))).toBe(true);
    }
  });

  it('should validate capture frontmatter against JSON provenance sidecars', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-source-validation-'));
    const directory = path.join(root, 'Canon', 'Universe_Alpha', 'Sources');
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'Page.md'), ['---', 'note_type: canon-source', 'cosmology: Universe_Alpha', 'canon_tier: C-Secondary', 'source_url: https://example.org/wiki/Page', 'is_processed: false', '---', '# Capture'].join('\n'));
    fs.writeFileSync(path.join(directory, 'Page.json'), JSON.stringify({ source_id: 'src_Page_test', url: 'https://example.org/wiki/Page', title: 'Page', franchise: 'Universe_Alpha', canon_tier: 'G-Primary', captured_at: '2026-11-01T00:00:00.000Z', content_sha256: 'a'.repeat(64), categories: [], infobox: {} }));
    try {
      const report = validateSourceCaptures(root);
      expect(report.valid).toBe(false);
      expect(report.results['Canon/Universe_Alpha/Sources/Page.md'].errors.some(error => error.includes('must match'))).toBe(true);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('should reject invalid field shapes and vocabulary', () => {
    const content = `---
note_type: canon-character
type: character
cosmology: Universe_Alpha
canon_tier: nonsense
status: nonsense
aliases: 7
---
# Character
## Summary
## Source-backed details
## Sources and scope
`;
    const result = validateContent(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(error => error.includes('canon_tier'))).toBe(true);
    expect(result.errors.some(error => error.includes('status'))).toBe(true);
    expect(result.errors.some(error => error.includes('aliases'))).toBe(true);
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

  it('should allow optional Bible sections to be omitted while retaining the type core', () => {
    const content = `---
note_type: fic-cast
type: cast_profile
cosmology: Universe_Alpha
canon_tier: AU-Override
status: established
aliases: []
---
# Character
## 1. Identity, Origin & Canon Divergence Delta
Established story state.
`;
    expect(validateContent(content).valid).toBe(true);
  });

  it('should reject unregistered custom note_types rather than silently skipping them', () => {
    const content = `---
note_type: "custom-note"
---
# My Custom Note
`;
    const result = validateContent(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Unknown or unregistered note_type'))).toBe(true);
  });

  it('should validate typed vault notes while excluding raw source captures and .scratch archives', () => {
    const root = fs.mkdtempSync(path.join(process.cwd(), '.scratch', 'validator-fixture-'));
    try {
      fs.mkdirSync(path.join(root, 'Canon', 'Test', 'Sources'), { recursive: true });
      fs.mkdirSync(path.join(root, 'Canon', 'Test', 'Baselines'), { recursive: true });
      fs.mkdirSync(path.join(root, 'Bible'), { recursive: true });
      fs.mkdirSync(path.join(root, '.scratch', 'old'), { recursive: true });
      fs.writeFileSync(path.join(root, 'Canon', 'Test', 'Baselines', 'valid.md'),
        '---\nnote_type: canon-baseline\ntype: baseline\ncosmology: Test\ncanon_tier: C-Secondary\nstatus: known\naliases: []\n---\n# Test\n## Summary\n## Source-backed details\n## Sources and scope\n');
      fs.writeFileSync(path.join(root, 'Canon', 'Test', 'Sources', 'raw.md'),
        '---\nnote_type: unregistered-raw\n---\nRaw capture');
      fs.writeFileSync(path.join(root, 'Bible', 'unknown.md'),
        '---\nnote_type: unregistered-note\n---\n# Unknown');
      fs.writeFileSync(path.join(root, 'Bible', 'bad-frontmatter.md'),
        '---\nnote_type: [invalid\n---\n# Bad YAML');
      fs.writeFileSync(path.join(root, 'Bible', 'no-note-type.md'),
        '---\ntitle: Missing Note Type\n---\n# Missing');
      fs.writeFileSync(path.join(root, '.scratch', 'old', 'historic.md'),
        '---\nnote_type: unregistered-archive\n---\n# Historic');

      const report = validateVaultNotes(root);
      expect(report.summary.total).toBe(4);
      expect(report.summary.failed).toBe(3);
      expect(report.results['Canon/Test/Baselines/valid.md'].valid).toBe(true);
      expect(report.results['Bible/unknown.md'].valid).toBe(false);
      expect(report.results['Bible/bad-frontmatter.md'].valid).toBe(false);
      expect(report.results['Bible/no-note-type.md'].valid).toBe(false);
      expect(report.results['Bible/no-note-type.md'].errors[0]).toContain('Missing mandatory frontmatter property: "note_type"');
      expect(report.results['Canon/Test/Sources/raw.md']).toBeUndefined();
      expect(report.results['.scratch/old/historic.md']).toBeUndefined();
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('should validate all active vault notes in the real workspace without any failures', () => {
    const report = validateVaultNotes(process.cwd());
    expect(report.valid).toBe(true);
    expect(report.summary.total).toBeGreaterThan(0);
    expect(report.summary.passed).toBe(report.summary.total);
    expect(report.summary.failed).toBe(0);
  });

  it('should parse frontmatter without trailing newline and reject its unregistered type', () => {
    const content = '---\nnote_type: "custom-note"\n---';
    const result = validateContent(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Unknown or unregistered note_type'))).toBe(true);
  });

  it('should parse chapter frontmatter with setup_introduced and payoff_resolved', () => {
    const chapterPath = path.join(process.cwd(), 'Manuscript', 'pt-BR', 'PT_Chapter_01_Template.md');
    const result = validateFile(chapterPath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('chapter-pt');

    const content = fs.readFileSync(chapterPath, 'utf8');
    expect(content).toContain('setup_introduced:');
    expect(content).toContain('payoff_resolved:');
  });

  it('should validate concise Bible cast template and avoid invented numeric defaults', () => {
    const castPath = path.join(templatesDir, 'TPL_Bible_Cast_Profile.md');
    const result = validateFile(castPath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('fic-cast');

    const content = fs.readFileSync(castPath, 'utf8');
    expect(content).toContain('Established AU delta');
    expect(content).toContain('Current motivation and pressure');
    expect(content).toContain('Record abilities that affect current story decisions');
    expect(content).toContain('Optional visual reference');
    expect(content).not.toContain('Loyalty Index (1–10)');
    expect(content).not.toContain('8.0x Multiplier');
  });

  it('should validate concise Canon baseline template without invented universal power-scaling fields', () => {
    const canonPath = path.join(templatesDir, 'TPL_Canon_Baseline.md');
    const result = validateFile(canonPath);

    expect(result.valid).toBe(true);
    expect(result.noteType).toBe('canon-baseline');

    const content = fs.readFileSync(canonPath, 'utf8');
    expect(content).toContain('## Summary');
    expect(content).toContain('## Source-backed details');
    expect(content).toContain('## Sources and scope');
    expect(content).not.toContain('In-Universe Parameter Matrix');
  });

  it('should reject markdown table containing unescaped pipes inside wikilinks', () => {
    const invalidTableContent = `---
note_type: "fic-cast"
type: "cast_profile"
cosmology: "Universe_Alpha"
canon_tier: "AU-Override"
status: "Active"
aliases: ["Test"]
---
## 1. Identity, Origin & Canon Divergence Delta
| Dimension | Specification | Notes |
|---|---|---|
| Universe | [[Canon/Universe_Alpha/00_Universe_Alpha_Index|Universe Alpha Cosmology]] | Native |
## 2. Psychological Architecture & Dual-Language Voice Guide
## 3. Active Abilities, Energy Systems & Multiversal Progression
## 4. Strategic Assets, Inventory & Secret Relics
## 5. Interpersonal Trajectories & Loyalty Thresholds
## 6. Operational Objectives & Arc Roadmap
`;
    const result = validateContent(invalidTableContent);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Unescaped pipe in table wikilink'))).toBe(true);
  });

  it('should accept markdown table with properly escaped pipes inside wikilinks', () => {
    const validTableContent = `---
note_type: "fic-cast"
type: "cast_profile"
cosmology: "Universe_Alpha"
canon_tier: "AU-Override"
status: "Active"
aliases: ["Test"]
---
## 1. Identity, Origin & Canon Divergence Delta
| Dimension | Specification | Notes |
|---|---|---|
| Universe | [[Canon/Universe_Alpha/00_Universe_Alpha_Index\\|Universe Alpha Cosmology]] | Native |
## 2. Psychological Architecture & Dual-Language Voice Guide
## 3. Active Abilities, Energy Systems & Multiversal Progression
## 4. Strategic Assets, Inventory & Secret Relics
## 5. Interpersonal Trajectories & Loyalty Thresholds
## 6. Operational Objectives & Arc Roadmap
`;
    const result = validateContent(validTableContent);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });


  it('should accept registered operational note types with exempt status', () => {
    const operationalTypes = [
      'cockpit-dashboard',
      'bible-index',
      'manuscript-index',
      'manuscript-outline',
      'chapter-pt-compiled',
      'seeds-inbox',
      'incubator-index',
      'incubator-lab',
      'bible-open-questions',
    ];

    for (const noteType of operationalTypes) {
      const content = `---
note_type: ${noteType}
title: "Test Operational Note"
---
# Test Content
`;
      const result = validateContent(content);
      expect(result.valid, `Expected ${noteType} to be valid`).toBe(true);
      expect(result.exempt, `Expected ${noteType} to be exempt`).toBe(true);
    }
  });
});
