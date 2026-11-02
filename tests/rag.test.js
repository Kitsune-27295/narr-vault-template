import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { initDatabase, indexDocument } from '../tools/rag/search.js';
import { assembleContext } from '../tools/rag/context-assembler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Fiction-Conscious Context Assembler (F-RAG)', () => {
  let db;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    initDatabase(db);

    // 1. Canon Rule
    indexDocument(db, {
      relPath: 'Canon/Universe_Primary/04_Rules_Mechanics/Primary_Energy_System.md',
      content: `---
title: Primary Energy System
type: rule_mechanic
tags: [energy, limits, primary_system]
---
# Primary Energy System
Primary Energy is finite. Overuse causes biological exhaustion or core burnout. Only practitioners with open pathways can project force.
`,
      mtime: Date.now(),
    });

    // 2. Canon Character Dossier
    indexDocument(db, {
      relPath: 'Canon/Universe_Primary/01_Characters/Entity_Alpha.md',
      content: `---
title: Entity Alpha (Canon)
type: character_dossier
tags: [native, practitioner]
---
# Entity Alpha
Native warrior. No knowledge of multiversal crossover or foreign energy cores.
`,
      mtime: Date.now(),
    });

    // 3. Bible Character Sheet (AU)
    indexDocument(db, {
      relPath: 'Bible/02_Cast_Characters/SI_Protagonist_Template.md',
      content: `---
title: SI Protagonist (AU Profile)
type: character_sheet
tags: [protagonist, traveler, foreign_energy]
---
# SI Protagonist (AU)
Voice: Determined, rebellious, sharper instincts after awakening the dormant multiversal template.
Current Abilities: Basic circulation, energy projection, Dormant Spirit Core.
`,
      mtime: Date.now(),
    });

    // 4. Divergence POD (AU Override)
    indexDocument(db, {
      relPath: 'Bible/01_Divergences_AU/DIV_01_Foreign_Energy_Awakening.md',
      content: `---
title: DIV_01 - Foreign Energy Awakening
type: divergence_pod
tags: [divergence, incursion, foreign_energy]
---
# DIV_01: Foreign Energy Awakening
Point of Divergence: Under severe tactical pressure, the protagonist awakens a foreign secondary energy core instead of relying solely on primary native energy.
AU Override: The protagonist now possesses both native biological pathways AND a foreign energy template.
`,
      mtime: Date.now(),
    });
  });

  afterEach(() => {
    try {
      db.close();
    } catch {
      // ignore
    }
  });

  it('should assemble context with AU divergence overrides taking precedence over canon', () => {
    const result = assembleContext({
      query: 'Protagonist awakens foreign energy and molds primary flow against barrier',
      budgetTokens: 2000,
      db,
    });

    expect(result.contextText).toBeDefined();
    expect(result.contextText).toContain('FICTION-CONSCIOUS RETRIEVAL AUGMENTED CONTEXT (F-RAG)');
    expect(result.contextText).toContain('[TIER 2: TIMELINE DIVERGENCES (AU OVERRIDES)]');
    expect(result.contextText).toContain('DIV_01: Foreign Energy Awakening');

    // Verify Tier 2 appears BEFORE Tier 4 (Canon Mechanics)
    const tier2Index = result.contextText.indexOf('[TIER 2: TIMELINE DIVERGENCES (AU OVERRIDES)]');
    const tier4Index = result.contextText.indexOf('[TIER 4: SYSTEM MECHANICS & CONSTRAINTS]');
    expect(tier2Index).toBeLessThan(tier4Index);
  });

  it('should respect the token/character budget limit', () => {
    const tightBudget = 200; // ~800 chars
    const result = assembleContext({
      query: 'Protagonist Primary Energy Foreign Core',
      budgetTokens: tightBudget,
      db,
    });

    // Rough check: budget in chars approx budgetTokens * 4
    expect(result.tokenEstimate).toBeLessThanOrEqual(tightBudget + 100);
    expect(result.packedTiers.length).toBeGreaterThan(0);
  });

  it('should extract active character voice guidelines for prompt injection', () => {
    const result = assembleContext({
      query: 'Protagonist in tactical pressure combat',
      budgetTokens: 2500,
      db,
    });

    expect(result.contextText).toContain('[TIER 3: CHARACTER PROFILES & ACTIVE VOICES]');
    expect(result.contextText).toContain('Voice: Determined, rebellious, sharper instincts');
  });

  it('should anchor a scene file into Tier 1', () => {
    const sceneRel = 'Manuscript/pt-BR/01_Scenes/C01_S01_Scene_Template.md';
    const sceneFile = fs.existsSync(sceneRel)
      ? sceneRel
      : path.resolve(__dirname, '../../../frameworks/vault/narr/templates', sceneRel);

    const result = assembleContext({
      query: 'Chakra',
      scenePath: sceneFile,
      budgetTokens: 2500,
      db,
    });

    expect(result.packedTiers).toContain(1);
    expect(result.contextText).toContain('[TIER 1: ACTIVE SCENE & POV ANCHOR]');
    expect(result.contextText).toContain('C01 S01 Scene Template');
  });

  it('should append truncation marker when a long document exceeds remaining tier budget', () => {
    indexDocument(db, {
      relPath: 'Bible/01_Divergences_AU/DIV_99_Massive_POD.md',
      content: '# DIV 99\n' + 'Divergence long text lore. '.repeat(100),
      mtime: Date.now(),
    });

    const result = assembleContext({
      query: 'Massive POD',
      budgetTokens: 180, // tight budget ~720 chars
      db,
    });

    expect(result.contextText).toContain('*(Truncated to preserve context budget)*');
  });
});
