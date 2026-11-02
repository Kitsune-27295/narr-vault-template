import fs from 'node:fs';
import path from 'node:path';
import { dump as yamlDump } from 'js-yaml';

/**
 * Standard 7 canonical subdirectories for any cosmology in Canon/
 */
export const CANON_SUBDIRECTORIES = [
  'Sources',
  '00_Sources',
  '01_Characters',
  '02_Locations',
  '03_Factions_Cultures',
  '04_Rules_Mechanics',
  '05_Items_Artifacts',
  '06_Timeline_Events',
];

/**
 * Validates and sanitizes a franchise name to prevent path traversal or invalid identifiers.
 * Must match /^[A-Za-z0-9][A-Za-z0-9_]{0,63}$/ after whitespace/hyphen normalization.
 */
export function assertFranchiseName(name) {
  if (!name || typeof name !== 'string') {
    throw new Error(`Invalid franchise name: "${name}". Franchise name must be a non-empty string.`);
  }
  const clean = name.trim().replace(/[\s-]+/g, '_');
  if (!/^[A-Za-z0-9][A-Za-z0-9_]{0,63}$/.test(clean)) {
    throw new Error(`Invalid franchise name: "${name}". Must match /^[A-Za-z0-9][A-Za-z0-9_]{0,63}$/.`);
  }
  return clean;
}

/**
 * Matches a string against a simple wildcard glob (e.g. *naruto.fandom.com*)
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
      { franchise: 'Universe_Primary', patterns: ['*universe-primary*', '*primary-world.wiki*'], defaultCanonTier: 'G-Primary' },
      { franchise: 'Universe_Secondary', patterns: ['*universe-secondary*', '*secondary-world.wiki*'], defaultCanonTier: 'G-Primary' },
      { franchise: 'Universe_Tertiary', patterns: ['*universe-tertiary*', '*tertiary-world.wiki*'], defaultCanonTier: 'W-Author-WoB' },
    ],
    fallbackRule: {
      fandomSubdomainPattern: true,
      defaultFranchise: 'General',
    },
  };
}

/**
 * Resolves the destination franchise and default canon tier from URL / explicit flags
 */
export function detectFranchiseWithRules({ url = '', explicitFranchise = null, vaultRoot = process.cwd() }) {
  // 1. Explicit override via CLI flag has highest priority
  if (explicitFranchise) {
    const cleanName = assertFranchiseName(explicitFranchise);
    return {
      franchise: cleanName,
      canonTier: 'G-Primary',
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
          const validated = assertFranchiseName(rule.franchise);
          return {
            franchise: validated,
            canonTier: rule.defaultCanonTier || 'G-Primary',
            matchedRule: `pattern:${pattern}`,
          };
        }
      }
    }
  }

  // 3. Fallback: extract fandom subdomain (e.g. jujutsu-kaisen.fandom.com -> Jujutsu_kaisen)
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const parts = host.split('.');
    if (parts.length >= 3 && parts[1] === 'fandom') {
      const formatted = parts[0]
        .split(/[-_]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join('_');
      const validated = assertFranchiseName(formatted);
      return {
        franchise: validated,
        canonTier: 'G-Primary',
        matchedRule: 'fandom-subdomain',
      };
    }
  } catch {
    // Ignore invalid URL parse
  }

  // 4. Default fallback
  const fallback = config.fallbackRule?.defaultFranchise || 'General';
  return {
    franchise: assertFranchiseName(fallback),
    canonTier: 'G-Primary',
    matchedRule: 'default-fallback',
  };
}

/**
 * Ensures the 7 canonical subdirectories and master index exist for a franchise in Canon/
 */
export function ensureCanonScaffold({ franchise, vaultRoot = process.cwd() }) {
  const validatedFranchise = assertFranchiseName(franchise);
  const canonBase = path.resolve(vaultRoot, 'Canon');
  const franchiseDir = path.resolve(canonBase, validatedFranchise);

  if (!franchiseDir.startsWith(canonBase + path.sep)) {
    throw new Error(`Path traversal detected: franchise "${franchise}" resolves outside Canon directory.`);
  }

  let created = false;

  // 1. Create 7 canonical subdirectories
  for (const sub of CANON_SUBDIRECTORIES) {
    const subDir = path.join(franchiseDir, sub);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
      created = true;
    }
  }

  // 2. Create 00_<Franquia>_Index.md if not existing
  const indexFile = path.join(franchiseDir, `00_${validatedFranchise}_Index.md`);
  if (!fs.existsSync(indexFile)) {
    const cleanTitle = validatedFranchise.replace(/_/g, ' ');
    const frontmatterObj = {
      note_type: 'canon-index',
      cosmology: validatedFranchise,
      aliases: [cleanTitle, `${cleanTitle} Canon Index`],
    };
    const frontmatterStr = yamlDump(frontmatterObj, { lineWidth: -1 }).trim();

    const indexContent = `---
${frontmatterStr}
---

# 📖 Canon Index — ${cleanTitle}

> Immutable canon wiki of the ${cleanTitle} universe. Only facts proven by the original work. No fanon.

## Subdirectories

| Folder | Contents |
|---|---|
| [[Sources/|Sources/]] | Raw captures (Web Clipper) — unprocessed |
| [[01_Characters/|01_Characters/]] | Characters, named creatures, historical figures |
| [[02_Locations/|02_Locations/]] | Villages, countries, locations, cosmography |
| [[03_Factions_Cultures/|03_Factions_Cultures/]] | Clans, organizations, factions, cultures |
| [[04_Rules_Mechanics/|04_Rules_Mechanics/]] | Power systems, invariant laws, technical mechanics |
| [[05_Items_Artifacts/|05_Items_Artifacts/]] | Artifacts, legendary weapons, relics, items |
| [[06_Timeline_Events/|06_Timeline_Events/]] | Major historical events, eras, canonical timeline |

## Core References
<!-- Add key canon references here -->
`.trim() + '\n';

    fs.writeFileSync(indexFile, indexContent, 'utf8');
    created = true;
  }

  return created;
}
