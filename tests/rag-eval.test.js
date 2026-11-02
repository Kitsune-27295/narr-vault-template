import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { openVaultDatabase, syncVault } from '../tools/rag/search.js';
import { runRagBenchmark } from '../tools/rag/eval.js';

describe('RAG Benchmark Suite', () => {
  let db;
  let tmpDir;

  beforeAll(() => {
    // Hermetic: a private index in the OS temp dir, so parallel test files never share a database.
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rag-eval-'));
    db = openVaultDatabase(path.join(tmpDir, 'vault_index.db'));
    syncVault(process.cwd(), db);
  });

  afterAll(() => {
    try { db?.close(); } catch {}
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should run benchmark against eval/queries.yaml and produce valid MRR and recall metrics', () => {
    const queriesPath = path.join(process.cwd(), 'eval', 'queries.yaml');
    const benchmark = runRagBenchmark(db, queriesPath);

    expect(benchmark).toBeDefined();
    expect(benchmark.queriesCount).toBeGreaterThan(0);
    expect(benchmark.mrr).toBeGreaterThan(0.2);
    expect(benchmark.avgRecallAt5).toBeGreaterThan(0.4);
    expect(benchmark.results.length).toBe(benchmark.queriesCount);
  });
});
