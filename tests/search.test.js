import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { initDatabase, indexDocument, searchDocuments, syncVault } from '../tools/rag/search.js';

describe('SQLite FTS5 Vault Search Engine', () => {
  let db;
  const testDir = path.join(process.cwd(), '.scratch', 'test_search_vault');

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    initDatabase(db);

    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    try {
      db.close();
    } catch {
      // ignore
    }
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should initialize database schema with documents and FTS5 table', () => {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table', 'virtual')").all();
    const names = tables.map((t) => t.name);
    expect(names).toContain('documents');
    expect(names).toContain('documents_fts');
  });

  it('should index a document with frontmatter and query it with BM25', () => {
    const doc = {
      relPath: 'Canon/Universe_Primary/04_Rules_Mechanics/Primary_Energy_System.md',
      content: `---
title: Primary Energy System
type: rule_mechanic
tags: [universe_primary, energy, mechanics]
aliases: [Aether Flow, Bio-Channels]
---
# Primary Energy System
Primary Energy is the essential life energy circulating through biological bio-channels.
Practitioners mold energy through mental discipline to project radiant force.
`,
      mtime: Date.now(),
    };

    indexDocument(db, doc);

    const results = searchDocuments(db, 'bio-channels');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe('Primary Energy System');
    expect(results[0].rel_path).toBe('Canon/Universe_Primary/04_Rules_Mechanics/Primary_Energy_System.md');
    expect(results[0].zone).toBe('Canon');
    expect(results[0].franchise).toBe('Universe_Primary');
  });

  it('should filter search results by zone and franchise', () => {
    indexDocument(db, {
      relPath: 'Canon/Universe_Primary/04_Rules_Mechanics/Primary_Energy_System.md',
      content: '---\ntitle: Primary Energy System\n---\nEnergy circulation flow.',
      mtime: Date.now(),
    });
    indexDocument(db, {
      relPath: 'Canon/Universe_Secondary/04_Rules_Mechanics/Secondary_Power_System.md',
      content: '---\ntitle: Secondary Power System\n---\nExotic energy and spirit resonance.',
      mtime: Date.now(),
    });
    indexDocument(db, {
      relPath: 'Bible/01_Divergences_AU/DIV_00_Cross_Resonance_Fusion.md',
      content: '---\ntitle: Cross Resonance Fusion\n---\nEnergy circulation combined with foreign resonance.',
      mtime: Date.now(),
    });

    const canonPrimaryResults = searchDocuments(db, 'Energy', { zone: 'Canon', franchise: 'Universe_Primary' });
    expect(canonPrimaryResults.length).toBe(1);
    expect(canonPrimaryResults[0].title).toBe('Primary Energy System');

    const bibleResults = searchDocuments(db, 'Resonance', { zone: 'Bible' });
    expect(bibleResults.length).toBe(1);
    expect(bibleResults[0].title).toBe('Cross Resonance Fusion');
  });

  it('should incrementally sync a vault folder without duplicate entries', () => {
    const file1 = path.join(testDir, 'Canon', 'Universe_Primary', 'Baselines');
    fs.mkdirSync(file1, { recursive: true });
    fs.writeFileSync(
      path.join(file1, 'Entity_Alpha.md'),
      '---\ntitle: Entity Alpha\ntags: [practitioner, prime]\n---\n# Entity Alpha\nThe bearer of the primal core.',
      'utf-8'
    );

    const stats = syncVault(testDir, db);
    expect(stats.indexed).toBe(1);

    // Re-sync without changes
    const stats2 = syncVault(testDir, db);
    expect(stats2.indexed).toBe(0);
    expect(stats2.skipped).toBe(1);

    const results = searchDocuments(db, 'primal core');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Entity Alpha');
  });

  it('excludes historical scratch plans from the writing-context search index', () => {
    const canonDir = path.join(testDir, 'Canon', 'Universe_Alpha', 'Baselines');
    const scratchDir = path.join(testDir, '.scratch', 'old-planning-record');
    fs.mkdirSync(canonDir, { recursive: true });
    fs.mkdirSync(scratchDir, { recursive: true });
    fs.writeFileSync(path.join(canonDir, 'Master_Chronology.md'), '# Current Alpha Chronology\nEpoch year 0 is the narrative start.', 'utf8');
    fs.writeFileSync(path.join(scratchDir, 'spec.md'), '# Superseded Planning Record\nYear -35 was an obsolete anchor.', 'utf8');

    const stats = syncVault(testDir, db);
    const rows = db.prepare('SELECT rel_path FROM documents').all();
    expect(stats.indexed).toBe(1);
    expect(rows.map((row) => row.rel_path)).toEqual(['Canon/Universe_Alpha/Baselines/Master_Chronology.md']);
    expect(searchDocuments(db, 'obsolete anchor').some((result) => result.rel_path.includes('.scratch'))).toBe(false);
  });

  it('should correctly classify real vault character paths in Canon and Bible', () => {
    indexDocument(db, {
      relPath: 'Canon/Universe_Primary/Baselines/Entity_Alpha.md',
      content: '# Entity Alpha\nNative realm guardian.',
      mtime: Date.now(),
    });
    indexDocument(db, {
      relPath: 'Bible/02_Cast_Characters/SI_Protagonist_Template.md',
      content: '# SI Protagonist\nReincarnated traveler.',
      mtime: Date.now(),
    });

    const canonChar = db.prepare("SELECT ptype, zone, franchise FROM documents WHERE rel_path LIKE '%Entity_Alpha%'").get();
    expect(canonChar.ptype).toBe('canon_baseline');
    expect(canonChar.zone).toBe('Canon');
    expect(canonChar.franchise).toBe('Universe_Primary');

    const bibleChar = db.prepare("SELECT ptype, zone FROM documents WHERE rel_path LIKE '%SI_Protagonist_Template%'").get();
    expect(bibleChar.ptype).toBe('character_sheet');
    expect(bibleChar.zone).toBe('Bible');
  });

  it('should prune deleted files from documents and FTS5 on incremental sync', () => {
    const dir = path.join(testDir, 'Canon', 'Universe_Primary', 'Baselines');
    fs.mkdirSync(dir, { recursive: true });
    const targetFile = path.join(dir, 'Rival_Entity.md');
    fs.writeFileSync(targetFile, '# Rival Entity\nProdigy possessing ocular resonance.', 'utf-8');

    syncVault(testDir, db);
    let rival = searchDocuments(db, 'ocular resonance');
    expect(rival.length).toBe(1);

    // Delete file and re-sync
    fs.unlinkSync(targetFile);
    const syncResult = syncVault(testDir, db);
    expect(syncResult.deleted).toBe(1);

    rival = searchDocuments(db, 'ocular resonance');
    expect(rival.length).toBe(0);
  });

  it('should skip a file that disappears between the directory walk and the read', () => {
    const dir = path.join(testDir, 'Canon', 'Universe_Primary', 'Baselines');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'Stays.md'), ['# Stays', 'Stable entry.'].join(String.fromCharCode(10)), 'utf-8');
    const vanishing = path.join(dir, 'Vanishes.md');
    fs.writeFileSync(vanishing, ['# Vanishes', 'Transient fixture.'].join(String.fromCharCode(10)), 'utf-8');

    const realStat = fs.statSync;
    const spy = vi.spyOn(fs, 'statSync').mockImplementation((target, ...rest) => {
      if (String(target) === vanishing) {
        throw Object.assign(new Error('ENOENT: no such file or directory'), { code: 'ENOENT' });
      }
      return realStat(target, ...rest);
    });
    try {
      const stats = syncVault(testDir, db);
      expect(stats.indexed).toBe(1);
      expect(searchDocuments(db, 'Transient').length).toBe(0);
      expect(searchDocuments(db, 'Stable').length).toBe(1);
    } finally {
      spy.mockRestore();
    }
  });

  it('should rethrow stat errors other than ENOENT', () => {
    const dir = path.join(testDir, 'Bible');
    fs.mkdirSync(dir, { recursive: true });
    const locked = path.join(dir, 'Locked.md');
    fs.writeFileSync(locked, '# Locked', 'utf-8');
    const realStat = fs.statSync;
    const spy = vi.spyOn(fs, 'statSync').mockImplementation((target, ...rest) => {
      if (String(target) === locked) throw Object.assign(new Error('EACCES'), { code: 'EACCES' });
      return realStat(target, ...rest);
    });
    try {
      expect(() => syncVault(testDir, db)).toThrow('EACCES');
    } finally {
      spy.mockRestore();
    }
  });

  it('should not index the tools directory (code and template skeletons are not vault notes)', () => {
    const toolsDir = path.join(testDir, 'tools', 'distribution', 'skeleton');
    fs.mkdirSync(toolsDir, { recursive: true });
    fs.writeFileSync(path.join(toolsDir, 'Skeleton_Note.md'), ['# Skeleton Note', 'should stay out of retrieval'].join(String.fromCharCode(10)), 'utf-8');
    const stats = syncVault(testDir, db);
    expect(stats.indexed).toBe(0);
    expect(searchDocuments(db, 'retrieval').length).toBe(0);
  });

  it('should still index a folder named tools when it is not the vault root tools directory', () => {
    const nested = path.join(testDir, 'Research', 'Notes', 'tools');
    fs.mkdirSync(nested, { recursive: true });
    fs.writeFileSync(path.join(nested, 'Hand_Tools.md'), ['# Hand Tools', 'Forged by apprentices.'].join(String.fromCharCode(10)), 'utf-8');
    expect(syncVault(testDir, db).indexed).toBe(1);
    expect(searchDocuments(db, 'apprentices').length).toBe(1);
  });
});
