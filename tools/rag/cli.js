#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { openVaultDatabase, syncVault, searchDocuments } from './search.js';
import { assembleContext } from './context-assembler.js';

function parseArgs(args) {
  const parsed = {
    command: args[0] || 'help',
    query: '',
    flags: {},
  };

  let i = 1;
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        parsed.flags[key] = next;
        i += 2;
      } else {
        parsed.flags[key] = true;
        i += 1;
      }
    } else {
      if (!parsed.query) {
        parsed.query = arg;
      } else {
        parsed.query += ` ${arg}`;
      }
      i++;
    }
  }

  return parsed;
}

function printUsage() {
  console.log(`
Vault Fiction-Conscious RAG CLI (F-RAG)

Usage:
  node tools/rag/cli.js sync
    Incrementally syncs all markdown files into .scratch/vault_index.db

  node tools/rag/cli.js search "<query>" [options]
    Options:
      --zone <Canon|Bible|Manuscript|Cockpit>
      --franchise <Universe_Primary|Universe_Secondary|Shared>
      --ptype <rule_mechanic|divergence_pod|character_sheet|character_dossier|scene_draft>
      --limit <number> (default: 10)

  node tools/rag/cli.js context "<query>" [options]
    Options:
      --scene <path_to_scene.md>
      --budget <tokens> (default: 2500)
      --out <path_to_output.md>
`);
}

async function main() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);
  const vaultDir = parsed.flags.vault ? path.resolve(parsed.flags.vault) : (process.env.VAULT_ROOT ? path.resolve(process.env.VAULT_ROOT) : process.cwd());
  const dbPath = parsed.flags.db ? path.resolve(parsed.flags.db) : path.join(vaultDir, '.scratch', 'vault_index.db');
  const db = openVaultDatabase(dbPath);

  try {
    switch (parsed.command) {
      case 'sync': {
        console.log(`[RAG SYNC] Synchronizing vault at ${vaultDir}...`);
        const stats = syncVault(vaultDir, db);
        console.log(`[RAG SYNC] Done! Total files: ${stats.total}, Newly indexed: ${stats.indexed}, Skipped: ${stats.skipped}, Pruned/Deleted: ${stats.deleted || 0}`);
        break;
      }

      case 'search': {
        if (!parsed.query) {
          console.error('[RAG SEARCH ERROR] Please provide a search query.');
          process.exitCode = 1;
          return;
        }

        const rawLimit = parsed.flags.limit ? parseInt(parsed.flags.limit, 10) : 10;
        const boundedLimit = Math.min(Math.max(isNaN(rawLimit) ? 10 : rawLimit, 1), 100);

        const options = {
          zone: parsed.flags.zone,
          franchise: parsed.flags.franchise,
          ptype: parsed.flags.ptype,
          limit: boundedLimit,
        };

        const results = searchDocuments(db, parsed.query, options);
        console.log(`\nFound ${results.length} results for: "${parsed.query}"\n`);
        for (let i = 0; i < results.length; i++) {
          const doc = results[i];
          console.log(`[${i + 1}] ${doc.title} (${doc.zone} / ${doc.franchise || 'General'} / ${doc.ptype})`);
          console.log(`    Path: ${doc.rel_path}`);
          console.log(`    Rank: ${doc.rank.toFixed(4)} | Characters: ${doc.char_count}`);
          if (doc.snippet) {
            console.log(`    Snippet: ${doc.snippet.replace(/<b>|<\/b>/g, '**')}`);
          }
          console.log();
        }
        break;
      }

      case 'context': {
        if (!parsed.query && !parsed.flags.scene) {
          console.error('[RAG CONTEXT ERROR] Please provide a query prompt or --scene file.');
          process.exitCode = 1;
          return;
        }

        const rawBudget = parsed.flags.budget ? parseInt(parsed.flags.budget, 10) : 2500;
        const budgetTokens = Math.min(Math.max(isNaN(rawBudget) ? 2500 : rawBudget, 100), 50000);

        const result = assembleContext({
          query: parsed.query || '',
          scenePath: parsed.flags.scene,
          budgetTokens,
          db,
        });

        if (parsed.flags.out) {
          const outPath = path.resolve(vaultDir, parsed.flags.out);
          const normalizedVault = path.resolve(vaultDir);
          if (!outPath.startsWith(normalizedVault + path.sep) && outPath !== normalizedVault) {
            throw new Error(`Path traversal blocked: --out path "${parsed.flags.out}" must stay inside vault "${vaultDir}".`);
          }
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, result.contextText, 'utf-8');
          console.log(`[RAG CONTEXT] Output saved to ${outPath} (~${result.tokenEstimate} tokens, Tiers: ${result.packedTiers.join(', ')})`);
        } else {
          console.log(result.contextText);
          console.log(`\n<!-- Estimated tokens: ${result.tokenEstimate} | Packed Tiers: [${result.packedTiers.join(', ')}] | Sources: ${result.sources.length} -->`);
        }
        break;
      }

      case 'help':
      default:
        printUsage();
        break;
    }
  } finally {
    try {
      db.close();
    } catch {
      // ignore
    }
  }
}

main().catch((err) => {
  console.error('[RAG CLI ERROR]', err);
  process.exit(1);
});

