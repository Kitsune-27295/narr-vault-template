import fs from 'node:fs';
import path from 'node:path';

/**
 * Standard canonical subdirectories for any cosmology in Canon/
 */
export const CANON_SUBDIRECTORIES = [
  'Sources',
  'Baselines',
];

/**
 * Matches a string against a simple wildcard glob (e.g. *example-world.fandom.com*)
 */
function matchGlob(str, pattern) {
  const escaped = pattern
    .replace(/[+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*');
  return new RegExp('^' + escaped + '$', 'i').test(str);
}

/**
 * Reads franchise rules from 99_System/franchise-rules.json with fallback defaults
 */
export function loadFranchiseRules(vaultRoot = process.cwd()) {
  const configPath = path.join(vaultRoot, '99_System', 'franchise-rules.json');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      console.warn(`[WARN] Could not parse ${configPath}:`, e.message);
    }
  }

  return {
    rules: [
      { franchise: 'Universe_Primary', patterns: ['*universe-primary.fandom.com*'], defaultCanonTier: 'C-Secondary' },
      { franchise: 'Universe_Primary', patterns: ['*primary-world.wiki*'], defaultCanonTier: 'G-Primary' },
      { franchise: 'Universe_Secondary', patterns: ['*universe-secondary.fandom.com*'], defaultCanonTier: 'C-Secondary' },
      { franchise: 'Universe_Secondary', patterns: ['*secondary-world.wiki*'], defaultCanonTier: 'G-Primary' },
      { franchise: 'Universe_Tertiary', patterns: ['*universe-tertiary*', '*tertiary-world.wiki*'], defaultCanonTier: 'W-Author-WoB' },
    ],
    fallbackRule: {
      fandomSubdomainPattern: true,
      defaultFranchise: 'General',
      defaultCanonTier: 'C-Secondary',
    },
  };
}

/**
 * Resolves the destination franchise and default canon tier from URL / explicit flags
 */
export function detectFranchiseWithRules({ url = '', explicitFranchise = null, vaultRoot = process.cwd() }) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes('fanon') && host.includes('fandom.com')) {
      const subdomain = host.split('.')[0];
      return {
        franchise: subdomain.split(/[-_]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_'),
        canonTier: 'F-Fanon',
        matchedRule: 'fanon-domain',
      };
    }
  } catch {
    // Explicit franchise routing can still be used with local HTML.
  }

  // 1. Explicit override via CLI flag has highest priority
  if (explicitFranchise) {
    const cleanName = explicitFranchise.trim().replace(/[\s-]+/g, '_');
    return {
      franchise: cleanName,
      canonTier: 'C-Secondary',
      matchedRule: 'explicit-flag',
    };
  }

  const config = loadFranchiseRules(vaultRoot);
  const cleanUrl = url.trim().toLowerCase();

  // 2. Pattern matching against franchise-rules.json
  if (cleanUrl) {
    for (const rule of config.rules || []) {
      for (const pattern of rule.patterns || []) {
        if (matchGlob(cleanUrl, pattern) || cleanUrl.includes(pattern.replace(/\*/g, ''))) {
          return {
            franchise: rule.franchise,
            canonTier: rule.defaultCanonTier || 'G-Primary',
            matchedRule: `pattern:${pattern}`,
          };
        }
      }
    }
  }

  // 3. Fallback: extract fandom subdomain (e.g. novel-cosmology.fandom.com -> Novel_Cosmology)
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const parts = host.split('.');
    if (parts.length >= 3 && parts[1] === 'fandom') {
      const formatted = parts[0]
        .split(/[-_]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join('_');
      return {
        franchise: formatted,
        canonTier: host.includes('fanon') ? 'F-Fanon' : 'C-Secondary',
        matchedRule: 'fandom-subdomain',
      };
    }
  } catch {
    // Ignore invalid URL parse
  }

  // 4. Default fallback
  return {
    franchise: config.fallbackRule?.defaultFranchise || 'General',
    canonTier: config.fallbackRule?.defaultCanonTier || 'C-Secondary',
    matchedRule: 'default-fallback',
  };
}

/**
 * Ensures canonical subdirectories ('Sources', 'Baselines') and master index exist for a franchise in Canon/
 */
export function ensureCanonScaffold({ franchise, vaultRoot = process.cwd() }) {
  const franchiseDir = path.join(vaultRoot, 'Canon', franchise);
  let created = false;

  // 1. Create canonical subdirectories (Sources, Baselines)
  for (const sub of CANON_SUBDIRECTORIES) {
    const subDir = path.join(franchiseDir, sub);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
      created = true;
    }
  }

  // 2. Create 00_<Franquia>_Index.md if not existing
  const indexFile = path.join(franchiseDir, `00_${franchise}_Index.md`);
  if (!fs.existsSync(indexFile)) {
    const cleanTitle = franchise.replace(/_/g, ' ');
    const indexContent = `---
note_type: canon-index
cosmology: ${franchise}
aliases: ["${cleanTitle}", "${cleanTitle} Canon Index"]
---

# 📖 Canon Index — ${cleanTitle}

> Immutable canon wiki of the ${cleanTitle} universe. Only facts proven by the original work. No fanon.

## Subdirectories

| Folder | Contents |
|---|---|
| [[Sources/|Sources/]] | Raw source captures and cryptographic provenance sidecars |
| [[Baselines/|Baselines/]] | Subject-specific canonical dossiers and authoritative reference hubs |

## Core References
<!-- Add key canon references here -->
`.trim() + '\n';

    fs.writeFileSync(indexFile, indexContent, 'utf8');
    created = true;
  }

  return created;
}

