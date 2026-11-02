import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { clipUrlOrHtml } from './clipper/clipper.js';
import { ingestSourceFile } from './ingestor/ingestor.js';

/**
 * End-to-End Orchestrator:
 * Takes a single URL, clips it to Sources/, and immediately ingests into Modular Dossiers.
 */
export async function runEndToEndPipeline({
  url,
  html = null,
  franchise = null,
  vaultRoot = process.cwd(),
  dryRun = false,
}) {
  console.log(`[PIPELINE] Starting end-to-end processing for: ${url || 'HTML input'}`);

  // 1. Engine 1: Clip URL
  const clipResult = await clipUrlOrHtml({
    url,
    html,
    franchise,
    vaultRoot,
    dryRun,
  });

  console.log(`[PIPELINE] Engine 1 complete: ${clipResult.status.toUpperCase()} -> ${clipResult.slug} (${clipResult.franchise})`);

  if (dryRun) {
    return {
      clipResult,
      ingestResult: null,
    };
  }

  // 2. Engine 2: Semantic Ingest into Modular Dossiers
  const ingestResult = await ingestSourceFile({
    mdPath: clipResult.mdPath,
    franchise: clipResult.franchise,
    vaultRoot,
  });

  console.log(`[PIPELINE] Engine 2 complete: Ingested into ${ingestResult.dossiersAffected.length} modular dossier(s).`);

  return {
    clipResult,
    ingestResult,
  };
}

// CLI entrypoint
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  let url = '';
  let franchise = null;
  let htmlPath = null;
  let dryRun = false;
  let vaultRoot = process.env.VAULT_ROOT || process.cwd();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      console.log('Usage: node tools/pipeline.js <url> [--franchise <name>] [--html-file <path>] [--vault <path>] [--dry-run]');
      process.exit(0);
    } else if (args[i] === '--franchise' || args[i] === '-f') {
      franchise = args[++i];
    } else if (args[i] === '--html-file') {
      htmlPath = args[++i];
    } else if (args[i] === '--vault') {
      vaultRoot = (await import('node:path')).resolve(args[++i]);
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    } else if (!url && !args[i].startsWith('-')) {
      url = args[i];
    }
  }

  if (!url && !htmlPath) {
    console.log('Usage: node tools/pipeline.js <url> [--franchise <name>] [--html-file <path>] [--vault <path>] [--dry-run]');
    process.exit(1);
  }

  let htmlContent = null;
  if (htmlPath) {
    const fs = await import('node:fs');
    htmlContent = fs.readFileSync(htmlPath, 'utf8');
  }

  runEndToEndPipeline({ url, html: htmlContent, franchise, vaultRoot, dryRun })
    .then(res => {
      console.log(`\n[SUCCESS] Pipeline successfully completed.`);
      console.log(`Source MD:   ${res.clipResult.mdPath}`);
      console.log(`Source JSON: ${res.clipResult.jsonPath}`);
      res.ingestResult?.dossiersAffected?.forEach(d => {
        console.log(`Dossier (${d.status.toUpperCase()}): ${d.filePath}`);
      });
    })
    .catch(err => {
      console.error('\n[PIPELINE FATAL ERROR]', err.message);
      process.exit(1);
    });
}
