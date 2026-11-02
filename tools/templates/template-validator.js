import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

/**
 * Expected schema contracts per note_type
 */
export const TEMPLATE_SCHEMAS = {
  'canon-character': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'character',
    requiredHeadings: [
      '## 1. Overview & Identification',
      '## 2. Appearance & Physical Profile',
      '## 3. Personality & Behavioral Traits',
      '## 4. Abilities, Skills & Power System Integration',
      '## 5. Equipment & Signature Relics',
      '## 6. Chronological History & In-Universe Biography',
      '## 7. Key Relationships & Interpersonal Dynamics',
      '## 8. Verified Canonical Sources',
    ],
  },
  'canon-location': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'location',
    requiredHeadings: [
      '## 1. Overview & Geographic Classification',
      '## 2. Physical Geography, Climate & Biosphere',
      '## 3. Demographics, Inhabitants & Cultural Structure',
      '## 4. Governance, Economy & Political Affiliation',
      '## 5. Strategic Defenses & Metaphysical Barriers',
      '## 6. Key Points of Interest & Notable Landmarks',
      '## 7. Historical Chronology & Major Battles',
      '## 8. Verified Canonical Sources',
    ],
  },
  'canon-power-system': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'power_system',
    requiredHeadings: [
      '## 1. Unified Canonical Definition & Normalization',
      '## 2. Fundamental Mechanics & Invariant Physical Laws',
      '## 3. Progression Scale & Consolidated Realm Tiers',
      '## 4. Costs, Rebounds & Energetic Limitations',
      '## 5. Cross-System Interactions & Compatibility Laws',
      '## 6. Exemplary Techniques & Universal Applications',
      '## 7. Record of Divergences, Retcons & Edge Cases',
      '## 8. Verified Canonical Sources',
    ],
  },
  'canon-faction': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'faction',
    requiredHeadings: [
      '## 1. Overview & Organizational Charter',
      '## 2. Ideology, Doctrine & Core Objectives',
      '## 3. Internal Structure & Chain of Command',
      '## 4. Operational Capacity, Military Assets & Technology',
      '## 5. Territory, Bases & Strongholds',
      '## 6. Historical Evolution & Major Campaigns',
      '## 7. Diplomatic Relations & Faction Web',
      '## 8. Verified Canonical Sources',
    ],
  },
  'canon-item': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'item',
    requiredHeadings: [
      '## 1. Overview & Technical Classification',
      '## 2. Physical Appearance, Composition & Dimensions',
      '## 3. Anomalous Properties, Capabilities & Output',
      '## 4. Attunement Requirements, Energy Drain & Usage Hazards',
      '## 5. Storage, Containment & Preservation Protocols',
      '## 6. Provenance, Creation & Ownership History',
      '## 7. Known Replicas, Variants & Countermeasures',
      '## 8. Verified Canonical Sources',
    ],
  },
  'canon-event': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'timeline_event',
    requiredHeadings: [
      '## 1. Overview & Historical Significance',
      '## 2. Belligerents, Factions & Key Commanders',
      '## 3. Preconditions, Causality & Strategic Context',
      '## 4. Chronological Course of Events & Key Phases',
      '## 5. Casualties, Losses & Structural Devastation',
      '## 6. Immediate Aftermath, Treaties & Geopolitical Shift',
      '## 7. Long-Term Historical Legacy',
      '## 8. Verified Canonical Sources',
    ],
  },
  'fic-pod': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'divergence_pod',
    requiredHeadings: [
      '## 1. Divergence Overview & Anchor Catalyst',
      '## 2. Canon Baseline vs. Fanfiction Reality',
      '## 3. Immediate Anomalies & Asymmetric Knowledge',
      '## 4. Cascading Ripple Effects & Faction Responses',
      '## 5. Chronological Milestone Deviations',
      '## 6. Cross-Cosmology Incursion Laws (Multiverse Integration)',
    ],
  },
  'fic-cast': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'cast_profile',
    requiredHeadings: [
      '## 1. Identity, Origin & Canon Divergence Delta',
      '## 2. Psychological Architecture & Dual-Language Voice Guide',
      '## 3. Active Abilities, Energy Systems & Multiversal Progression',
      '## 4. Strategic Assets, Inventory & Secret Relics',
      '## 5. Interpersonal Trajectories & Loyalty Thresholds',
      '## 6. Operational Objectives & Arc Roadmap',
    ],
  },
  'fic-matrix': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'relationship_matrix',
    requiredHeadings: [
      '## 1. Matrix Overview & Narrative Core',
      '## 2. Primary Relationship Axes',
      '## 3. Dynamic Tension & Conflict Thresholds',
      '## 4. Information Asymmetry & Secret Distribution Web',
      '## 5. Evolution Across Narrative Acts',
    ],
  },
  'fic-world': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'world_delta',
    requiredHeadings: [
      '## 1. World Shift Overview & Scope',
      '## 2. Canonical Baseline vs. Fanfiction World State',
      '## 3. Relocated Entities, Garrisons & Fortifications',
      '## 4. Metaphysical Environmental Anomalies',
      '## 5. Geopolitical Alliances & Border Shift Map',
    ],
  },
  'fic-arc': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'narrative_arc',
    requiredHeadings: [
      '## 1. Arc Overview & Dramatic Premise',
      '## 2. Story Grid Diagnostic Framework',
      '## 3. Chronological Scene Roadmap',
      '## 4. Thematic Undercurrents & Metaphysical Stakes',
      '## 5. Cross-Arc Cascades & Open Questions',
    ],
  },
};

/**
 * Extracts frontmatter and body from markdown
 */
export function parseMarkdown(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/);
  if (!match) {
    return { frontmatter: null, body: content };
  }
  try {
    const frontmatter = yamlLoad(match[1]);
    return { frontmatter, body: match[2] || '' };
  } catch (err) {
    return { frontmatter: null, body: content, parseError: err.message };
  }
}

/**
 * Validates a markdown string against schema rules
 */
export function validateContent(content, filePath = 'inline') {
  const errors = [];
  const warnings = [];

  const { frontmatter, body, parseError } = parseMarkdown(content);

  if (parseError) {
    errors.push(`Invalid YAML frontmatter: ${parseError}`);
    return { valid: false, errors, warnings };
  }

  if (!frontmatter || typeof frontmatter !== 'object') {
    errors.push('Missing or empty YAML frontmatter block (--- ... ---)');
    return { valid: false, errors, warnings };
  }

  const noteType = frontmatter.note_type;
  if (!noteType) {
    errors.push('Missing mandatory frontmatter property: "note_type"');
    return { valid: false, errors, warnings };
  }

  const schema = TEMPLATE_SCHEMAS[noteType];
  if (!schema) {
    warnings.push(`Unknown or unindexed note_type: "${noteType}". Schema validation skipped.`);
    return { valid: errors.length === 0, noteType, errors, warnings };
  }

  // 1. Check required frontmatter keys
  for (const field of schema.requiredFrontmatter) {
    if (frontmatter[field] === undefined || frontmatter[field] === null || frontmatter[field] === '') {
      errors.push(`Missing required frontmatter property: "${field}" for note_type "${noteType}"`);
    }
  }

  // 2. Check F-RAG type match
  if (schema.expectedType && frontmatter.type !== schema.expectedType) {
    errors.push(`Frontmatter "type" mismatch. Expected "${schema.expectedType}", found "${frontmatter.type}"`);
  }

  // 3. Check required section headings in body
  for (const heading of schema.requiredHeadings) {
    if (!body.includes(heading)) {
      errors.push(`Missing required section heading: "${heading}"`);
    }
  }

  return {
    valid: errors.length === 0,
    noteType,
    errors,
    warnings,
  };
}

/**
 * Validates a single file on disk
 */
export function validateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: [`File does not exist: ${filePath}`], warnings: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return validateContent(content, filePath);
}

/**
 * Validates all standard templates in 99_System/Templates/
 */
export function validateAllTemplates(vaultRoot = null) {
  const root = vaultRoot
    ? path.resolve(vaultRoot)
    : (process.env.VAULT_ROOT
        ? path.resolve(process.env.VAULT_ROOT)
        : (fs.existsSync(path.join(process.cwd(), '99_System', 'Templates'))
            ? process.cwd()
            : path.resolve(process.cwd(), '../../frameworks/vault/narr/templates')));

  let templatesDir = path.join(root, '99_System', 'Templates');
  if (!fs.existsSync(templatesDir)) {
    if (fs.existsSync(path.join(root, 'Templates'))) {
      templatesDir = path.join(root, 'Templates');
    } else if (path.basename(root) === 'Templates' && fs.existsSync(root)) {
      templatesDir = root;
    } else {
      return { valid: false, results: {}, summary: { total: 0, passed: 0, failed: 1 } };
    }
  }

  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.md'));
  const results = {};
  let passed = 0;
  let failed = 0;

  for (const file of files) {
    // Only validate full archetype templates with defined schema
    const fullPath = path.join(templatesDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { frontmatter } = parseMarkdown(content);

    // Skip legacy partial stubs if note_type not in schema
    if (frontmatter?.note_type && TEMPLATE_SCHEMAS[frontmatter.note_type]) {
      const res = validateContent(content, fullPath);
      results[file] = res;
      if (res.valid) {
        passed++;
      } else {
        failed++;
      }
    }
  }

  return {
    valid: failed === 0,
    results,
    summary: {
      total: passed + failed,
      passed,
      failed,
    },
  };
}

/**
 * CLI execution block
 */
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const targetArg = process.argv[2];

  if (!targetArg || targetArg === '--all' || (targetArg && fs.existsSync(path.resolve(targetArg)) && fs.statSync(path.resolve(targetArg)).isDirectory())) {
    const customRoot = (!targetArg || targetArg === '--all') ? null : path.resolve(targetArg);
    console.log('[TEMPLATE VALIDATOR] Scanning 99_System/Templates/ ...');
    const report = validateAllTemplates(customRoot);

    for (const [file, res] of Object.entries(report.results)) {
      if (res.valid) {
        console.log(`  ✓ ${file} (${res.noteType})`);
      } else {
        console.error(`  ✗ ${file} (${res.noteType || 'unknown'})`);
        res.errors.forEach(e => console.error(`    - ERROR: ${e}`));
      }
    }

    console.log(`\n[TEMPLATE VALIDATOR] Total: ${report.summary.total} | Passed: ${report.summary.passed} | Failed: ${report.summary.failed}`);
    process.exit(report.valid ? 0 : 1);
  } else {
    const targetPath = path.resolve(targetArg);
    console.log(`[TEMPLATE VALIDATOR] Validating file: ${targetPath}`);
    const res = validateFile(targetPath);
    if (res.valid) {
      console.log(`  ✓ Valid! note_type: ${res.noteType}`);
      process.exit(0);
    } else {
      console.error(`  ✗ Validation failed:`);
      res.errors.forEach(e => console.error(`    - ERROR: ${e}`));
      process.exit(1);
    }
  }
}
