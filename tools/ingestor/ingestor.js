import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { extractAtomicClaims, routeClaimsToDomains } from './claim-router.js';
import { upsertModularDossier } from './synthesizer.js';
import { assertFranchiseName } from '../clipper/franchise-resolver.js';

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

  const rawFranchise = franchise || sidecar.franchise || 'General';
  const targetFranchise = assertFranchiseName(rawFranchise);
  const markdown = fs.readFileSync(mdPath, 'utf8');

  // Step 1: Atomic Claim Extraction
  const claims = extractAtomicClaims(markdown, sidecar);

  // Step 2: 3 Pillars & Scope Routing
  const routed = routeClaimsToDomains(claims, targetFranchise, sidecar);

  const results = [];

  // Step 3 & 4: Canon Layering & Idempotent Upsert
  for (const [, dossierData] of Object.entries(routed.dossiers)) {
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
 * Ingests all sources in Canon/<Franquia>/Sources/
 */
export async function ingestAllSources({ franchise = null, vaultRoot = process.cwd() }) {
  const canonDir = path.join(vaultRoot, 'Canon');
  if (!fs.existsSync(canonDir)) {
    return [];
  }

  const validatedFranchise = franchise ? assertFranchiseName(franchise) : null;
  const franchises = validatedFranchise
    ? [validatedFranchise]
    : fs
        .readdirSync(canonDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

  const allResults = [];

  for (const fr of franchises) {
    const sourcesDir = fs.existsSync(path.join(canonDir, fr, '00_Sources'))
      ? path.join(canonDir, fr, '00_Sources')
      : path.join(canonDir, fr, 'Sources');
    if (!fs.existsSync(sourcesDir)) continue;

    const files = fs.readdirSync(sourcesDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const mdPath = path.join(sourcesDir, file);
      const res = await ingestSourceFile({ mdPath, franchise: fr, vaultRoot });
      allResults.push(res);
    }
  }

  return allResults;
}

// CLI entrypoint
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  let sourcePath = null;
  let franchise = null;
  let all = false;
  let vaultRoot = process.env.VAULT_ROOT || process.cwd();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' || args[i] === '-s') {
      sourcePath = args[++i];
    } else if (args[i] === '--franchise' || args[i] === '-f') {
      franchise = args[++i];
    } else if (args[i] === '--vault') {
      vaultRoot = path.resolve(args[++i]);
    } else if (args[i] === '--all') {
      all = true;
    }
  }

  if (!sourcePath && !all) {
    console.log('Usage: node tools/ingestor/ingestor.js [--source <path>] [--franchise <name>] [--vault <path>] [--all]');
    process.exit(1);
  }

  const run = async () => {
    if (sourcePath) {
      const res = await ingestSourceFile({ mdPath: sourcePath, franchise, vaultRoot });
      console.log(`[INGESTOR] Ingested ${res.source} into ${res.dossiersAffected.length} dossiers.`);
      res.dossiersAffected.forEach(d => console.log(`  -> ${d.status.toUpperCase()}: ${d.filePath}`));
    } else if (all) {
      const results = await ingestAllSources({ franchise, vaultRoot });
      console.log(`[INGESTOR] Batch ingested ${results.length} source files.`);
      results.forEach(r => console.log(`  -> ${r.source} (${r.franchise})`));
    }
  };

  run().catch(err => {
    console.error('[INGESTOR ERROR]', err.message);
    process.exit(1);
  });
}
