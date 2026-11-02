import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { synthesizeModularDossier, upsertModularDossier } from '../tools/ingestor/synthesizer.js';

describe('Engine 2 Step 3 & 4: Canon Layering & Modular Dossier Upsert', () => {
  const testFranchiseDir = path.join(process.cwd(), 'Canon', 'Test_Universe');

  beforeEach(() => {
    if (fs.existsSync(testFranchiseDir)) {
      fs.rmSync(testFranchiseDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testFranchiseDir)) {
      fs.rmSync(testFranchiseDir, { recursive: true, force: true });
    }
  });

  it('should synthesize a Single-Domain Modular Dossier following the mandatory template', () => {
    const routedData = {
      name: 'Primary Energy System',
      domain: 'sistema_poder',
      id_dossier: 'dossier-primary-energy-system',
      delegatedWikilinks: ['[[Dossier - Specialized Practitioner Ranks]]'],
      claims: {
        definitions: ['Primary Energy System is the foundational energy cultivated in Test Universe.'],
        mechanics: [
          { name: 'Energy Conversion', rule: 'Circulated through physiological channels.' },
          { name: 'Recovery', rule: 'Recovered through deep meditation and rest.' },
        ],
        tables: [
          '| Rank Range | Title | Characteristics |\n|---|---|---|\n| 1-10 | Initiate Rank | Foundational circulation |\n| 11-20 | Adept Rank | Projection capability |',
        ],
        metadata: { Origin: 'Innate Core', 'Other names': 'Core Flow' },
      },
    };

    const dossierContent = synthesizeModularDossier({
      routedData,
      franchise: 'Test_Universe',
      fontesIntegradas: 1,
    });

    expect(dossierContent).toContain('tipo: dossier_modular');
    expect(dossierContent).toContain('id_dossier: dossier-primary-energy-system');
    expect(dossierContent).toContain('fontes_integradas: 1');
    expect(dossierContent).toContain('[[Dossier - Specialized Practitioner Ranks]]');
    expect(dossierContent).toContain('## 1. Definição Canônica Unificada & Normalização');
    expect(dossierContent).toContain('## 2. Mecânicas Fundamentais e Leis Invariantes');
    expect(dossierContent).toContain('## 3. Escala de Progressão e Reinos Consolidados');
    expect(dossierContent).toContain('## 4. Interações Entre Sistemas (Cross-Dossier Links)');
    expect(dossierContent).toContain('## 5. Registro de Divergências, Retcons e Casos de Borda');
  });

  it('should perform idempotent upsert and increment fontes_integradas without erasing rules', () => {
    const initialData = {
      name: 'Primary Energy System',
      domain: 'sistema_poder',
      id_dossier: 'dossier-primary-energy-system',
      delegatedWikilinks: ['[[Dossier - Specialized Practitioner Ranks]]'],
      claims: {
        definitions: ['Primary Energy System is the foundational energy.'],
        mechanics: [{ name: 'Energy Conversion', rule: 'Circulation through channels.' }],
        tables: ['| Rank | Title |\n|---|---|\n| 1-10 | Initiate |'],
        metadata: { Origin: 'Innate Core' },
      },
    };

    // First write
    const res1 = upsertModularDossier({
      routedData: initialData,
      franchise: 'Test_Universe',
      vaultRoot: process.cwd(),
      sourceSha: 'sha_first_source',
    });

    expect(res1.status).toBe('created');
    expect(fs.existsSync(res1.filePath)).toBe(true);

    const firstContent = fs.readFileSync(res1.filePath, 'utf8');
    expect(firstContent).toContain('fontes_integradas: 1');

    // Second write with complementary claim
    const complementaryData = {
      name: 'Primary Energy System',
      domain: 'sistema_poder',
      id_dossier: 'dossier-primary-energy-system',
      delegatedWikilinks: ['[[Dossier - Manifestation Templates]]'],
      claims: {
        definitions: ['Primary Energy System is the foundational energy.'],
        mechanics: [{ name: 'Compression', rule: 'Higher ranks require energy liquefaction and crystallization.' }],
        tables: [],
        metadata: { 'Portuguese Term': 'Sistema de Energia Primaria' },
      },
    };

    const res2 = upsertModularDossier({
      routedData: complementaryData,
      franchise: 'Test_Universe',
      vaultRoot: process.cwd(),
      sourceSha: 'sha_second_source',
    });

    expect(res2.status).toBe('updated');
    const secondContent = fs.readFileSync(res2.filePath, 'utf8');

    expect(secondContent).toContain('fontes_integradas: 2');
    // Both mechanics should be preserved
    expect(secondContent).toContain('Circulation through channels.');
    expect(secondContent).toContain('liquefaction and crystallization.');
    // Both dependencies should be present
    expect(secondContent).toContain('[[Dossier - Specialized Practitioner Ranks]]');
    expect(secondContent).toContain('[[Dossier - Manifestation Templates]]');
  });
});

