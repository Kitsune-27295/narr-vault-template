import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { clipUrlOrHtml, slugifyTitle, detectFranchise } from '../tools/clipper/clipper.js';

describe('Engine 1: Hybrid Web Clipper CLI', () => {
  const testOutputDir = path.join(process.cwd(), 'Canon', 'Test_Franchise');

  beforeEach(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    const canonDir = path.join(process.cwd(), 'Canon');
    if (fs.existsSync(canonDir) && fs.readdirSync(canonDir).length === 0) {
      fs.rmdirSync(canonDir);
    }
  });

  it('should auto-detect franchise from Fandom URL', () => {
    expect(detectFranchise('https://universe-primary.fandom.com/wiki/Energy_System')).toBe('Universe_Primary');
    expect(detectFranchise('https://universe-secondary.fandom.com/wiki/Exotic_Power')).toBe('Universe_Secondary');
    expect(detectFranchise('https://fantasy-realm.fandom.com/wiki/Magic_Core')).toBe('Fantasy_Realm');
    expect(detectFranchise('https://custom.com/page', 'Custom_Franchise')).toBe('Custom_Franchise');
  });

  it('should correctly slugify title', () => {
    expect(slugifyTitle('Aether Flow (Energy)')).toBe('Aether_Flow');
    expect(slugifyTitle('Entity Alpha: Part 1')).toBe('Entity_Alpha_Part_1');
  });

  it('should save clean .md and .json sidecar into Canon/<Franquia>/Sources/', async () => {
    const rawHtml = `
      <html>
        <head><title>Aether Flow | Fantasy Realm Wiki</title></head>
        <body>
          <h1 id="firstHeading">Aether Flow</h1>
          <div class="portable-infobox">
            <div class="pi-item pi-data" data-source="essence">
              <h3 class="pi-data-label">Essence</h3>
              <div class="pi-data-value">Pure Aether</div>
            </div>
          </div>
          <div id="content">
            <p>Aether Flow is the foundational energy of the Fantasy Realm.</p>
          </div>
        </body>
      </html>
    `;

    const result = await clipUrlOrHtml({
      html: rawHtml,
      url: 'https://fantasy-realm.fandom.com/wiki/Aether_Flow',
      franchise: 'Test_Franchise',
      vaultRoot: process.cwd(),
    });

    expect(result.status).toBe('created');
    expect(result.slug).toBe('Aether_Flow');
    expect(fs.existsSync(result.mdPath)).toBe(true);
    expect(fs.existsSync(result.jsonPath)).toBe(true);

    const mdContent = fs.readFileSync(result.mdPath, 'utf8');
    const jsonContent = JSON.parse(fs.readFileSync(result.jsonPath, 'utf8'));

    expect(mdContent).toContain('# Aether Flow');
    expect(jsonContent.title).toBe('Aether Flow');
    expect(jsonContent.franchise).toBe('Test_Franchise');
    expect(jsonContent.infobox['Essence']).toBe('Pure Aether');
    expect(jsonContent.content_sha256).toBeDefined();

    // Test Idempotency: clipping same content should return 'unchanged'
    const rerunResult = await clipUrlOrHtml({
      html: rawHtml,
      url: 'https://fantasy-realm.fandom.com/wiki/Aether_Flow',
      franchise: 'Test_Franchise',
      vaultRoot: process.cwd(),
    });

    expect(rerunResult.status).toBe('unchanged');
  });
});

