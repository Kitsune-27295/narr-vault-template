import fs from 'node:fs';
import path from 'node:path';
import { extractAtomicClaims, routeClaimsToDomains } from './claim-router.js';
import { upsertModularDossier } from './synthesizer.js';

/**
 * Ingests a single .md + .json source file pair into Modular Dossiers
 */
export async function ingestSourceFile({ mdPath, franchise = null, vaultRoot = process.cwd() }) {
  if (!fs.existsSync(mdPath)) {
    throw new Error(`Source markdown file not found: ${mdPath}`);
  }

  const jsonPath = mdPath.replace(/\.md$/, '.json');
  let sidecar = {};
  if (fs.existsSync(jsonPath)) {
    try {
      sidecar = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {
      console.warn(`[INGESTOR WARN] Could not parse sidecar JSON at ${jsonPath}:`, e.message);
    }
  }

  const targetFranchise = franchise || sidecar.franchise || 'General';
  const markdown = fs.readFileSync(mdPath, 'utf8');

  // Step 1: Atomic Claim Extraction
  const claims = extractAtomicClaims(markdown, sidecar);

  // Step 2: 3 Pillars & Scope Routing
  const routed = routeClaimsToDomains(claims, targetFranchise, sidecar);

  const results = [];

  // Step 3 & 4: Canon Layering & Idempotent Upsert
  for (const [key, dossierData] of Object.entries(routed.dossiers)) {
    const res = upsertModularDossier({
      routedData: dossierData,
      franchise: targetFranchise,
      vaultRoot,
      sourceSha: sidecar.content_sha256,
    });
    results.push(res);
  }

  return {
    source: mdPath,
    franchise: targetFranchise,
    dossiersAffected: results,
    catalogEntriesExtracted: Object.keys(routed.catalogEntries),
  };
}

/**
 * Ingests standard Canon sources and legacy captures from Canon/<Franchise>/Sources/.
 */
export async function ingestAllSources({ franchise = null, vaultRoot = process.cwd() }) {
  const canonDir = path.join(vaultRoot, 'Canon');
  const franchises = franchise
    ? [franchise]
    : fs
        .readdirSync(canonDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

  const allResults = [];

  for (const fr of franchises) {
    // Prefer the canonical path; read old vaults without breaking ingestion.
    const sourcesDirs = ['Sources', '00_Sources']
      .map(directory => path.join(canonDir, fr, directory))
      .filter(sourcesDir => fs.existsSync(sourcesDir));

    for (const sourcesDir of sourcesDirs) {
      const files = fs.readdirSync(sourcesDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const mdPath = path.join(sourcesDir, file);
        const res = await ingestSourceFile({ mdPath, franchise: fr, vaultRoot });
        allResults.push(res);
      }
    }
  }

  return allResults;
}

// CLI entrypoint
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);
  let sourcePath = null;
  let franchise = null;
  let all = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' || args[i] === '-s') {
      sourcePath = args[++i];
    } else if (args[i] === '--franchise' || args[i] === '-f') {
      franchise = args[++i];
    } else if (args[i] === '--all') {
      all = true;
    }
  }

  if (!sourcePath && !all) {
    console.log('Usage: node tools/ingestor/ingestor.js [--source <path>] [--franchise <name>] [--all]');
    process.exit(1);
  }

  const run = async () => {
    if (sourcePath) {
      const res = await ingestSourceFile({ mdPath: sourcePath, franchise });
      console.log(`[INGESTOR] Ingested ${res.source} into ${res.dossiersAffected.length} dossiers.`);
      res.dossiersAffected.forEach(d => console.log(`  -> ${d.status.toUpperCase()}: ${d.filePath}`));
    } else if (all) {
      const results = await ingestAllSources({ franchise });
      console.log(`[INGESTOR] Batch ingested ${results.length} source files.`);
      results.forEach(r => console.log(`  -> ${r.source} (${r.franchise})`));
    }
  };

  run().catch(err => {
    console.error('[INGESTOR ERROR]', err.message);
    process.exit(1);
  });
}

