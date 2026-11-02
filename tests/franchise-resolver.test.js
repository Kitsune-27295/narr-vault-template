import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { detectFranchiseWithRules, ensureCanonScaffold } from '../tools/clipper/franchise-resolver.js';

describe('Centralized Franchise Resolver & Canon Scaffolder', () => {
  const vaultRoot = process.cwd();
  const testFranchise = 'Archetype_Test';
  const testDir = path.join(vaultRoot, 'Canon', testFranchise);

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    const canonDir = path.join(vaultRoot, 'Canon');
    if (fs.existsSync(canonDir) && fs.readdirSync(canonDir).length === 0) {
      fs.rmdirSync(canonDir);
    }
  });

  it('should resolve explicit franchise flag with highest priority', () => {
    const res = detectFranchiseWithRules({
      url: 'https://example-world.fandom.com/wiki/Power',
      explicitFranchise: 'Custom_Crossover',
      vaultRoot,
    });
    expect(res.franchise).toBe('Custom_Crossover');
  });

  it('should match patterns defined in 99_System/franchise-rules.json', () => {
    const res1 = detectFranchiseWithRules({
      url: 'https://universe-primary.fandom.com/wiki/Energy_System',
      vaultRoot,
    });
    expect(res1.franchise).toBe('Universe_Primary');
    expect(res1.canonTier).toBe('G-Primary');

    const res2 = detectFranchiseWithRules({
      url: 'https://universe-tertiary.tertiary-world.wiki/events/100',
      vaultRoot,
    });
    expect(res2.franchise).toBe('Universe_Tertiary');
    expect(res2.canonTier).toBe('W-Author-WoB');

    const res3 = detectFranchiseWithRules({
      url: 'https://primary-world.wiki/rules/01',
      vaultRoot,
    });
    expect(res3.franchise).toBe('Universe_Primary');
  });

  it('should fallback to extracting fandom subdomain for unregistered fandoms', () => {
    const res = detectFranchiseWithRules({
      url: 'https://novel-cosmology.fandom.com/wiki/Aura',
      vaultRoot,
    });
    expect(res.franchise).toBe('Novel_Cosmology');
  });

  it('should automatically scaffold the 7 canonical subdirectories and index note when new franchise appears', () => {
    const scaffolded = ensureCanonScaffold({
      franchise: testFranchise,
      vaultRoot,
    });

    expect(scaffolded).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'Sources'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '01_Characters'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '02_Locations'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '03_Factions_Cultures'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '04_Rules_Mechanics'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '05_Items_Artifacts'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '06_Timeline_Events'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, `00_${testFranchise}_Index.md`))).toBe(true);

    const indexMd = fs.readFileSync(path.join(testDir, `00_${testFranchise}_Index.md`), 'utf8');
    expect(indexMd).toContain(`cosmology: ${testFranchise}`);
    expect(indexMd).toContain('# 📖 Canon Index');
  });
});

