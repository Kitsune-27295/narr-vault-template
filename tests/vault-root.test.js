import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { clipUrlOrHtml } from '../tools/clipper/clipper.js';
import { ingestSourceFile } from '../tools/ingestor/ingestor.js';
import { openVaultDatabase, syncVault, searchDocuments } from '../tools/rag/search.js';
import { assembleContext } from '../tools/rag/context-assembler.js';

describe('Explicit Vault Root Parameter Enforcement', () => {
  const customVaultRoot = path.join(process.cwd(), '.scratch', 'test_custom_vault_root');

  beforeEach(() => {
    if (fs.existsSync(customVaultRoot)) {
      fs.rmSync(customVaultRoot, { recursive: true, force: true });
    }
    fs.mkdirSync(customVaultRoot, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(customVaultRoot)) {
      fs.rmSync(customVaultRoot, { recursive: true, force: true });
    }
  });

  it('clipper should clip into explicit custom vault root', async () => {
    const rawHtml = `<html><head><title>Custom Lore</title></head><body><h1>Custom Lore</h1><p>Test content in custom root.</p></body></html>`;
    const result = await clipUrlOrHtml({
      html: rawHtml,
      url: 'https://test-universe.fandom.com/wiki/Custom_Lore',
      franchise: 'Test_Universe',
      vaultRoot: customVaultRoot,
    });

    expect(result.status).toBe('created');
    expect(result.mdPath.startsWith(customVaultRoot)).toBe(true);
    expect(result.jsonPath.startsWith(customVaultRoot)).toBe(true);
    expect(fs.existsSync(result.mdPath)).toBe(true);
    expect(fs.existsSync(result.jsonPath)).toBe(true);
  });

  it('ingestor should ingest source file into explicit custom vault root', async () => {
    const rawHtml = `<html><head><title>Primary Energy System</title></head><body><h1>Primary Energy System</h1><p>Foundational energy mechanics.</p><ul><li><strong>Circulation:</strong> Pathway mechanics.</li></ul></body></html>`;
    const clipRes = await clipUrlOrHtml({
      html: rawHtml,
      url: 'https://test-universe.fandom.com/wiki/Primary_Energy_System',
      franchise: 'Test_Universe',
      vaultRoot: customVaultRoot,
    });

    const ingestRes = await ingestSourceFile({
      mdPath: clipRes.mdPath,
      franchise: 'Test_Universe',
      vaultRoot: customVaultRoot,
    });

    expect(ingestRes.dossiersAffected.length).toBeGreaterThan(0);
    const dossierPath = ingestRes.dossiersAffected[0].filePath;
    expect(dossierPath.startsWith(customVaultRoot)).toBe(true);
    expect(fs.existsSync(dossierPath)).toBe(true);
  });

  it('RAG should synchronize, search, and assemble context within explicit custom vault root', () => {
    const canonDir = path.join(customVaultRoot, 'Canon', 'Test_Universe', '04_Rules_Mechanics');
    fs.mkdirSync(canonDir, { recursive: true });
    fs.writeFileSync(
      path.join(canonDir, 'Dossier_Energy_Law.md'),
      `---\ntitle: Energy Law\ntags: [energy, law]\ntype: rule_mechanic\n---\n# Energy Law\nFundamental energy law in custom vault.\n`,
      'utf8'
    );

    const dbPath = path.join(customVaultRoot, '.scratch', 'vault_index.db');
    const db = openVaultDatabase(dbPath);

    try {
      const syncStats = syncVault(customVaultRoot, db);
      expect(syncStats.indexed).toBeGreaterThanOrEqual(1);

      const searchRes = searchDocuments(db, 'Fundamental energy');
      expect(searchRes.length).toBeGreaterThan(0);
      expect(searchRes[0].title).toBe('Energy Law');

      const contextRes = assembleContext({
        query: 'Fundamental energy',
        db,
        budgetTokens: 1000,
      });

      expect(contextRes.contextText).toContain('Energy Law');
      expect(contextRes.packedTiers).toContain(4);
    } finally {
      db.close();
    }
  });
});
