import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';
import { detectFranchiseWithRules, ensureCanonScaffold } from '../clipper/franchise-resolver.js';

/**
 * Profile `narr`: serial-fiction story bible vault (Canon, Bible, Manuscript, ledgers).
 * Everything that is specific to this layout lives here; the clipper, the RAG and
 * the doctor are profile-agnostic and call these hooks.
 */

/** Determines zone, franchise, and ptype from file path and frontmatter. */
function classify(relPath, fm) {
  const normalized = relPath.replace(/\\/g, '/');
  const parts = normalized.split('/');

  let zone = 'Other';
  let franchise = fm.franchise || null;
  let ptype = fm.type || null;

  if (parts[0] === 'Canon') {
    zone = 'Canon';
    franchise = franchise || parts[1] || 'Shared';
  } else if (parts[0] === 'Bible') {
    zone = 'Bible';
    franchise = franchise || 'Shared';
  } else if (parts[0] === 'Manuscript') {
    zone = 'Manuscript';
    franchise = franchise || 'Multiverse';
  } else if (parts[0] === '00_Cockpit') {
    zone = 'Cockpit';
  } else if (parts[0] === '99_System') {
    zone = 'System';
  }

  if (!ptype) {
    if (normalized.includes('01_Divergences_AU')) {
      ptype = 'divergence_pod';
    } else if (normalized.includes('/Baselines/') || normalized.includes('Baselines')) {
      ptype = 'canon_baseline';
    } else if (normalized.includes('04_Rules_Mechanics') || normalized.includes('06_Power_Systems_Mechanics') || normalized.includes('07_Power_Systems_Mechanics')) {
      ptype = 'rule_mechanic';
    } else if ((normalized.includes('02_Cast_Characters') || normalized.includes('02_Characters')) && zone === 'Bible') {
      ptype = 'character_sheet';
    } else if ((normalized.includes('01_Characters') || normalized.includes('02_Characters')) && zone === 'Canon') {
      ptype = 'character_dossier';
    } else if (normalized.includes('Sources') || normalized.includes('/Sources/')) {
      ptype = 'source_raw';
    } else if (normalized.includes('04_Locations') || normalized.includes('04_World_Locations_Items') || normalized.includes('05_Items_Artifacts')) {
      ptype = normalized.includes('ITEM_') ? 'item_au' : 'world_delta';
    } else if (zone === 'Manuscript' && !normalized.endsWith('index.md') && !normalized.endsWith('index_es.md')) {
      ptype = 'scene_draft';
    } else {
      ptype = 'general';
    }
  }

  return { zone, franchise, ptype };
}

/** Categorizes a search result into one of the 5 Fiction-Conscious RAG tiers. */
function tierOf(doc) {
  const relPath = doc.rel_path || '';
  const ptype = doc.ptype || '';
  const zone = doc.zone || '';

  // Tier 2: Timeline Divergences (AU Overrides)
  if (ptype === 'divergence_pod' || relPath.includes('01_Divergences_AU') || relPath.includes('/DIV_') || relPath.startsWith('DIV_')) {
    return 2;
  }

  // Tier 3: AU Character Profiles & Voices
  if (ptype === 'character_sheet' || ptype === 'cast_profile' || (zone === 'Bible' && (relPath.includes('02_Cast_Characters') || relPath.includes('02_Characters')))) {
    return 3;
  }

  // Tier 4: System Mechanics & Hard Constraints (Canon & AU Power Systems, Techniques & Relics)
  if (
    ptype === 'rule_mechanic' ||
    ptype === 'power_system' ||
    ptype === 'power_system_au' ||
    ptype === 'technique_au' ||
    ptype === 'item_au' ||
    relPath.includes('04_Rules_Mechanics') ||
    relPath.includes('06_Power_Systems_Mechanics') ||
    relPath.includes('07_Power_Systems_Mechanics') ||
    relPath.includes('05_Items_Artifacts') ||
    (zone === 'Bible' && relPath.includes('02_Items')) ||
    (zone === 'Canon' && /(energy|power|mechanic|system)/i.test((doc.tags || '') + ' ' + (doc.title || '') + ' ' + relPath))
  ) {
    return 4;
  }

  // Tier 1: Scene drafts or active anchors
  if (ptype === 'scene_draft' || (zone === 'Manuscript' && relPath.endsWith('.md') && !relPath.endsWith('Index.md') && !relPath.endsWith('Index_ES.md')) || zone === 'Cockpit') {
    return 1;
  }

  // Tier 5: Canonical background lore
  return 5;
}

/** Routes a capture to Canon/<Franchise>/Sources/ and names its provenance fields. */
function routeClip({ url, explicitFranchise, vaultRoot }) {
  const resolved = detectFranchiseWithRules({ url: url || '', explicitFranchise, vaultRoot });
  if (resolved.canonTier === 'F-Fanon') {
    throw new Error('Fanon wiki sources cannot be filed as Canon captures. Use research/workbench notes instead.');
  }
  const franchise = resolved.franchise;
  return {
    group: franchise,
    sourcesDir: path.join(vaultRoot, 'Canon', franchise, 'Sources'),
    scaffold: () => ensureCanonScaffold({ franchise, vaultRoot }),
    noteType: 'canon-source',
    frontmatter: [['cosmology', franchise], ['canon_tier', resolved.canonTier]],
    sidecar: { franchise, canon_tier: resolved.canonTier },
  };
}

/** Pipeline step after a capture: modular dossier ingestion. */
async function afterClip(clipResult, { vaultRoot }) {
  const { ingestSourceFile } = await import('../ingestor/ingestor.js');
  const ingestResult = await ingestSourceFile({
    mdPath: clipResult.mdPath,
    franchise: clipResult.franchise,
    vaultRoot,
  });
  console.log(`[PIPELINE] Engine 2 complete: Ingested into ${ingestResult.dossiersAffected.length} modular dossier(s).`);
  return ingestResult;
}

/** Vault-specific doctor checks. `record(category, name, passed, details)` is provided by the doctor. */
function doctor(projectRoot, record) {
  // 2. Vault Declarative Configuration
  const vaultYamlPath = path.join(projectRoot, 'vault.yaml');
  if (fs.existsSync(vaultYamlPath)) {
    try {
      const content = fs.readFileSync(vaultYamlPath, 'utf8');
      const config = yamlLoad(content);
      const hasCore = config && config.story && config.languages && config.modules && config.budgets;
      record('Configuration', 'vault.yaml Schema', Boolean(hasCore), hasCore ? `Title: ${config.story.title}` : 'Missing required keys');
    } catch (err) {
      record('Configuration', 'vault.yaml Schema', false, `YAML parse error: ${err.message}`);
    }
  } else {
    record('Configuration', 'vault.yaml Existence', false, 'vault.yaml not found at root');
  }

  // 3. Vault Layer Boundaries
  const requiredDirs = [
    '00_Cockpit',
    'Canon',
    'Bible',
    'Manuscript',
    'Ledgers',
    'Sandbox',
    'Craft',
    'Research',
    'context',
    'memory',
    '99_System',
    'tools',
  ];

  for (const dir of requiredDirs) {
    const fullPath = path.join(projectRoot, dir);
    record('Directory Architecture', `Domain: ${dir}/`, fs.existsSync(fullPath), fs.existsSync(fullPath) ? 'Present' : 'Missing');
  }

  // 4. Cognitive Harness State
  const hotPath = path.join(projectRoot, 'memory', 'hot.md');
  if (fs.existsSync(hotPath)) {
    const lines = fs.readFileSync(hotPath, 'utf8').split('\n').length;
    record('Cognitive Harness', 'memory/hot.md Budget (<= 60 lines)', lines <= 60, `Current lines: ${lines}`);
  } else {
    record('Cognitive Harness', 'memory/hot.md Existence', false, 'memory/hot.md missing');
  }

  const authorPath = path.join(projectRoot, 'context', 'author.md');
  record('Cognitive Harness', 'context/author.md Existence', fs.existsSync(authorPath), fs.existsSync(authorPath) ? 'Present' : 'Missing');

  const langPath = path.join(projectRoot, 'context', 'languages.md');
  record('Cognitive Harness', 'context/languages.md Existence', fs.existsSync(langPath), fs.existsSync(langPath) ? 'Present' : 'Missing');

  // 5. Ledgers Suite
  const ledgers = [
    'LDG-Chekhov.md',
    'LDG-Decisions.md',
    'LDG-Open_Threads.md',
    'LDG-Contradictions.md',
    'LDG-Session_Handoff.md',
  ];
  for (const ldg of ledgers) {
    const ldgPath = path.join(projectRoot, 'Ledgers', ldg);
    record('Ledgers Suite', `Ledger: ${ldg}`, fs.existsSync(ldgPath), fs.existsSync(ldgPath) ? 'Present' : 'Missing');
  }

  // 6. Sandbox Registry
  const sandboxRegPath = path.join(projectRoot, 'Sandbox', '_registry.md');
  record('Sandbox Laboratory', 'Sandbox/_registry.md Existence', fs.existsSync(sandboxRegPath), fs.existsSync(sandboxRegPath) ? 'Present' : 'Missing');
}

export default {
  id: 'narr',
  classify,
  tierOf,
  context: {
    heading: 'FICTION-CONSCIOUS RETRIEVAL AUGMENTED CONTEXT (F-RAG)',
    preface: `> [!IMPORTANT]
> **Timeline Divergences (AU Overrides) strictly supersede canonical dossiers.**
> Where a point of divergence is active, adhere strictly to the AU reality over default canon.`,
    tierTitles: {
      1: '## [TIER 1: ACTIVE SCENE & POV ANCHOR]',
      2: '## [TIER 2: TIMELINE DIVERGENCES (AU OVERRIDES)]',
      3: '## [TIER 3: CHARACTER PROFILES & ACTIVE VOICES]',
      4: '## [TIER 4: SYSTEM MECHANICS & CONSTRAINTS]',
      5: '## [TIER 5: CANONICAL BACKGROUND LORE]',
    },
    banners: {
      2: '> [!WARNING] **AU OVERRIDE**: The following facts alter canon history.',
    },
    anchor: { zone: 'Manuscript', ptype: 'scene_draft' },
  },
  cli: {
    title: 'Vault Fiction-Conscious RAG CLI (F-RAG)',
    zones: 'Canon|Bible|Manuscript|Cockpit',
    franchises: 'Universe_Primary|Universe_Secondary|Shared',
    ptypes: 'canon_baseline|rule_mechanic|divergence_pod|character_sheet|character_dossier|scene_draft',
    anchorFlag: '--scene <path_to_scene.md>',
  },
  clip: { route: routeClip },
  afterClip,
  doctor,
};
