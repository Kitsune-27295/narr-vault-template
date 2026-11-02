import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runEndToEndPipeline } from '../tools/pipeline.js';
import { ingestAllSources } from '../tools/ingestor/ingestor.js';

describe('End-to-End Pipeline Verification Suite', () => {
  const testUniverseDir = path.join(process.cwd(), 'Canon', 'Universe_Test_E2e');

  beforeEach(() => {
    if (fs.existsSync(testUniverseDir)) {
      fs.rmSync(testUniverseDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testUniverseDir)) {
      fs.rmSync(testUniverseDir, { recursive: true, force: true });
    }
  });

  const sampleGenericHtml = `
    <!DOCTYPE html>
    <html>
      <head><title>Primary Energy System | Universe Test Wiki</title></head>
      <body>
        <div class="portable-infobox">
          <h2 class="pi-title">Primary Energy System</h2>
          <div class="pi-item pi-data" data-source="origin">
            <h3 class="pi-data-label">Origin</h3>
            <div class="pi-data-value">Innate Core</div>
          </div>
        </div>
        <div id="content">
          <h1 id="firstHeading">Primary Energy System</h1>
          <p>Primary Energy System is the foundational bio-spiritual energy of Universe Test cultivated by practitioners.</p>
          <h2>Mechanics and Cultivation</h2>
          <p>Practitioners circulate environmental essence through physical channels into the internal core.</p>
          <ul>
            <li><strong>Energy Conversion:</strong> Ambient particles are filtered through biological pathways.</li>
            <li><strong>Innate Rank:</strong> Measured during the awakening ceremony up to Tier 10.</li>
            <li><strong>Recovery:</strong> Restored via deep meditation, natural sleep, or recovery catalysts.</li>
          </ul>
          <h2>Practitioner Rank Hierarchy</h2>
          <table>
            <thead><tr><th>Rank Range</th><th>Title</th><th>Features</th></tr></thead>
            <tbody>
              <tr><td>1-10</td><td>Initiate Rank</td><td>Awakening baseline</td></tr>
              <tr><td>11-20</td><td>Adept Rank</td><td>First energy core crystallization required</td></tr>
            </tbody>
          </table>
          <h2>Related Techniques</h2>
          <p>Practitioners utilize Fundamental Meditation to accelerate energy circulation through vital meridians.</p>
        </div>
      </body>
    </html>
  `;

  it('should clip and ingest generic cosmology lore into a Modular Dossier in one zero-friction pass', async () => {
    const result = await runEndToEndPipeline({
      url: 'https://universe-test-e2e.fandom.com/wiki/Primary_Energy_System',
      html: sampleGenericHtml,
      vaultRoot: process.cwd(),
    });

    expect(result.clipResult.status).toBe('created');
    expect(result.clipResult.franchise).toBe('Universe_Test_E2e');
    expect(fs.existsSync(result.clipResult.mdPath)).toBe(true);
    expect(fs.existsSync(result.clipResult.jsonPath)).toBe(true);

    // Verify Engine 2 created the dossier
    expect(result.ingestResult.dossiersAffected.length).toBeGreaterThan(0);
    const dossierInfo = result.ingestResult.dossiersAffected[0];
    expect(dossierInfo.status).toBe('created');
    expect(fs.existsSync(dossierInfo.filePath)).toBe(true);

    const dossierContent = fs.readFileSync(dossierInfo.filePath, 'utf8');

    // Verify mandatory schema & sections
    expect(dossierContent).toContain('tipo: dossier_modular');
    expect(dossierContent).toContain('universo: Universe_Test_E2e');
    expect(dossierContent).toContain('dominio: sistema_poder');
    expect(dossierContent).toContain('id_dossier: dossier-primary-energy-system');
    expect(dossierContent).toContain('fontes_integradas: 1');
    expect(dossierContent).toContain('## 1. Definição Canônica Unificada & Normalização');
    expect(dossierContent).toContain('## 2. Mecânicas Fundamentais e Leis Invariantes');
    expect(dossierContent).toContain('## 3. Escala de Progressão e Reinos Consolidados');
    expect(dossierContent).toContain('## 4. Interações Entre Sistemas (Cross-Dossier Links)');
    expect(dossierContent).toContain('## 5. Registro de Divergências, Retcons e Casos de Borda');
  });

  it('should be completely idempotent on re-run with unchanged content', async () => {
    // Run once
    const firstRun = await runEndToEndPipeline({
      url: 'https://universe-test-e2e.fandom.com/wiki/Primary_Energy_System',
      html: sampleGenericHtml,
      vaultRoot: process.cwd(),
    });
    expect(firstRun.clipResult.status).toBe('created');

    // Run twice with identical content
    const rerun = await runEndToEndPipeline({
      url: 'https://universe-test-e2e.fandom.com/wiki/Primary_Energy_System',
      html: sampleGenericHtml,
      vaultRoot: process.cwd(),
    });

    expect(rerun.clipResult.status).toBe('unchanged');
    expect(rerun.ingestResult.dossiersAffected[0].status).toBe('unchanged');
  });

  it('should discover Canon sources in both the standard and legacy directories', async () => {
    const vaultRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vault-source-discovery-'));
    const standardDir = path.join(vaultRoot, 'Canon', 'Test_Franchise', 'Sources');
    const legacyDir = path.join(vaultRoot, 'Canon', 'Test_Franchise', '00_Sources');
    fs.mkdirSync(standardDir, { recursive: true });
    fs.mkdirSync(legacyDir, { recursive: true });
    fs.writeFileSync(path.join(standardDir, 'Standard.md'), 'Standard source has enough text for claim extraction.');
    fs.writeFileSync(path.join(legacyDir, 'Legacy.md'), 'Legacy source has enough text for claim extraction.');

    try {
      const results = await ingestAllSources({ franchise: 'Test_Franchise', vaultRoot });
      expect(results.map(({ source }) => path.basename(source)).sort()).toEqual(['Legacy.md', 'Standard.md']);
    } finally {
      fs.rmSync(vaultRoot, { recursive: true, force: true });
    }
  });
});
