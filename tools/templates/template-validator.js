import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

/**
 * Expected schema contracts per note_type
 */
export const TEMPLATE_SCHEMAS = {
  'canon-baseline': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'baseline',
    requiredHeadings: [
      '## Summary',
      '## Source-backed details',
      '## Sources and scope',
    ],
  },
  'canon-character': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'character',
    requiredHeadings: [
      '## Summary',
      '## Source-backed details',
      '## Sources and scope',
    ],
  },
  'canon-location': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'location',
    requiredHeadings: [
      '## Summary',
      '## Source-backed details',
      '## Sources and scope',
    ],
  },
  'canon-power-system': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'power_system',
    requiredHeadings: [
      '## Summary',
      '## Source-backed details',
      '## Sources and scope',
    ],
  },
  'canon-faction': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'faction',
    requiredHeadings: [
      '## Summary',
      '## Source-backed details',
      '## Sources and scope',
    ],
  },
  'canon-item': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'item',
    requiredHeadings: [
      '## Summary',
      '## Source-backed details',
      '## Sources and scope',
    ],
  },
  'canon-event': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'timeline_event',
    requiredHeadings: [
      '## Summary',
      '## Source-backed details',
      '## Sources and scope',
    ],
  },
  'canon-source': {
    requiredFrontmatter: ['note_type', 'cosmology', 'source_url', 'canon_tier', 'is_processed', 'aliases'],
    requiredHeadings: ['## Captured Content'],
  },
  'fic-pod': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'divergence_pod',
    requiredHeadings: [
      '## 1. Divergence Decision',
    ],
  },
  'fic-cast': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'cast_profile',
    requiredHeadings: [
      '## 1. Identity, Origin & Canon Divergence Delta',
    ],
  },
  'fic-matrix': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'relationship_matrix',
    requiredHeadings: [
      '## 1. Matrix Overview & Narrative Core',
      '## 2. Primary Relationship Axes',
    ],
  },
  'fic-world': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'world_delta',
    requiredHeadings: [
      '## 1. World Shift Overview & Scope',
    ],
  },
  'fic-arc': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'narrative_arc',
    requiredHeadings: [
      '## 1. Arc Overview & Dramatic Premise',
    ],
  },
  'fic-power-system': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'power_system_au',
    requiredHeadings: [
      '## 1. System Overview',
    ],
  },
  'fic-technique': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'technique_au',
    requiredHeadings: [
      '## 1. Technique Overview & Classification',
      '## 2. Mechanics, Costs & Limits',
    ],
  },
  'fic-item': {
    requiredFrontmatter: ['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'aliases'],
    expectedType: 'item_au',
    requiredHeadings: [
      '## 1. Identity & Story Role',
    ],
  },
  'chapter-pt': {
    requiredFrontmatter: ['note_type', 'chapter_num', 'pov_char', 'draft_status'],
    requiredHeadings: [],
  },
  'scene-pt': {
    requiredFrontmatter: ['note_type', 'chapter_num', 'scene_order', 'pov_char', 'draft_status'],
    requiredHeadings: [],
  },
  'chapter-es': {
    requiredFrontmatter: ['note_type', 'chapter_num', 'pt_source_chapter', 'trans_status'],
    requiredHeadings: [],
  },
};

export const UNSCHEMED_NOTE_TYPES = {
  'canon-index': 'Navigation/index record; not a canon dossier.',
  'bible-index': 'Master Bible or module index; operational structural document.',
  'bible-open-questions': 'Active continuity and narrative worldbuilding register.',
  'cockpit-dashboard': 'Operational cockpit dashboard or diagnostic audit tracker.',
  'manuscript-index': 'Manuscript navigation and production index.',
  'manuscript-outline': 'Manuscript act outline structure and beat sheet.',
  'chapter-pt-compiled': 'Consolidated Portuguese chapter draft reference for translation.',
  'seeds-inbox': 'Raw concepts, speculative ideas, and narrative seeds inbox.',
  'incubator-index': 'Staging lab index for foreign cosmology ideation.',
  'incubator-lab': 'Dedicated incubator concept lab staging shelf for foreign cosmology integration.',
  'fic-arc-auxiliary': 'One-off multiverse roadmap; kept as a planning document until decomposed.',
  'fic-cast-auxiliary': 'One-off cast/relationship tracker; kept as an operational register.',
  'fic-timeline-auxiliary': 'Story chronology register governed by ADR 0005 and the authoritative timeline.',
  lexicon: 'Bilingual term register; governed by translation guidance.',
  'voice-guide': 'Translation voice reference; prose-specific operational document.',
  scrapyard: 'Manuscript archive index; not an authored prose dossier.',
  'chapter-es-final': 'Publication archive guide; not a chapter manuscript.',
  'ao3-export-guide': 'Publication procedure; editorial guidance, not a chapter.',
  'context': 'Authorial voice and language pipeline guidance.',
  'memory': 'Cognitive harness active memory and operational learnings.',
  'journal': 'Append-only daily/monthly session changelog.',
  'ledger': 'Continuity, Chekhov, decisions, and session handoff ledger.',
  'craft': 'Prose style guides, diagnostic audits, and chapter critiques.',
  'research': 'Domain reference notes and real-world research.',
  'sandbox-project': 'Staging lab project spec for foreign cosmology / mechanic incubation.',
  'sandbox-registry': 'Sandbox laboratory master registry and lifecycle status register.',
};

const EVIDENCE_TIERS = new Set(['G-Primary', 'W-Author-WoB', 'C-Expanded', 'C-Secondary']);
const STATUS_VALUES = new Set([
  'known', 'active', 'concluded', 'planned', 'established', 'proposed',
  'in-progress', 'completed', 'idea', 'deceased', 'unknown', 'historical',
  'archived', 'confirmed', 'superseded', 'deprecated', 'draft'
]);
const isTemplatePlaceholder = value => typeof value === 'string' && /^\{\{[^{}]+\}\}$/.test(value);

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
    if (UNSCHEMED_NOTE_TYPES[noteType]) {
      warnings.push('Registered intentional exception "' + noteType + '": ' + UNSCHEMED_NOTE_TYPES[noteType]);
      return { valid: true, noteType, errors, warnings, exempt: true };
    }
    errors.push('Unknown or unregistered note_type: "' + noteType + '". Add a schema or explicit exception.');
    return { valid: false, noteType, errors, warnings };
  }

  // 1. Check required frontmatter keys
  for (const field of schema.requiredFrontmatter) {
    if (frontmatter[field] === undefined || frontmatter[field] === null || frontmatter[field] === '') {
      errors.push(`Missing required frontmatter property: "${field}" for note_type "${noteType}"`);
    }
  }

  for (const field of schema.requiredFrontmatter) {
    const value = frontmatter[field];
    if (value === undefined || value === null || value === '' || isTemplatePlaceholder(value)) continue;
    if (field === 'aliases' && (!Array.isArray(value) || value.some(alias => typeof alias !== 'string'))) {
      errors.push('Frontmatter "aliases" must be an array of strings.');
    } else if (['note_type', 'type', 'cosmology', 'canon_tier', 'status', 'source_url', 'draft_status', 'trans_status', 'pov_char'].includes(field) && typeof value !== 'string') {
      errors.push(`Frontmatter "${field}" must be a string.`);
    } else if (field === 'canon_tier' && !EVIDENCE_TIERS.has(value) && !(noteType.startsWith('fic-') && value === 'AU-Override')) {
      errors.push(`Unsupported canon_tier "${value}" for ${noteType}. Use an evidence tier for Canon or AU-Override for Bible notes.`);
    } else if (field === 'status' && !STATUS_VALUES.has(value.toLowerCase())) {
      errors.push(`Unsupported status "${value}". Use a registered continuity status.`);
    } else if (field === 'source_url' && (typeof value !== 'string' || !/^https?:\/\//i.test(value))) {
      errors.push('Frontmatter "source_url" must be an HTTP(S) URL.');
    } else if (['is_processed'].includes(field) && typeof value !== 'boolean') {
      errors.push(`Frontmatter "${field}" must be a boolean.`);
    } else if (['chapter_num', 'scene_order'].includes(field) && !Number.isInteger(value)) {
      errors.push(`Frontmatter "${field}" must be an integer.`);
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

  // 4. Check for unescaped pipes inside wikilinks in markdown table rows
  const lines = body.split('\n');
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const match = line.match(/\[\[([^\]\n\\|]+)\|([^\]\n|]+)\]\]/);
      if (match) {
        errors.push(
          `Unescaped pipe in table wikilink at body line ${idx + 1}: "${match[0]}". In markdown tables, wikilink aliases must be escaped as "[[Target\\|Alias]]" to prevent column splitting.`
        );
      }
    }
  });

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
export function validateAllTemplates(vaultRoot = process.cwd()) {
  const templatesDir = path.join(vaultRoot, '99_System', 'Templates');
  if (!fs.existsSync(templatesDir)) {
    return { valid: false, results: {}, summary: { total: 0, passed: 0, failed: 1 } };
  }

  const files = fs.readdirSync(templatesDir).filter(f => /^TPL_.*\.md$/i.test(f));
  const results = {};
  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const fullPath = path.join(templatesDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { frontmatter, parseError } = parseMarkdown(content);

    if (parseError) {
      results[file] = { valid: false, errors: ['Invalid template frontmatter: ' + parseError], warnings: [] };
      failed++;
    } else if (frontmatter?.template_status === 'deprecated' && frontmatter?.superseded_by) {
      results[file] = { valid: true, deprecated: true, replacement: frontmatter.superseded_by, warnings: [] };
      passed++;
    } else {
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

export function validateVaultNotes(vaultRoot = process.cwd()) {
  const ignored = new Set(['.git', '.scratch', '.agents', '.obsidian', 'node_modules', 'docs', 'tools', 'tests', 'Test_Universe', 'Universe_Test_E2e']);
  const results = {};
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory() && (ignored.has(entry.name) || entry.name.startsWith('tmp-') || entry.name.startsWith('.tmp') || entry.name.startsWith('temp-'))) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        if (dir === vaultRoot) continue; // Root repo markdown (AGENTS.md, CLAUDE.md, etc.) are harness configs, not vault notes
        const relative = path.relative(vaultRoot, fullPath).split(path.sep).join('/');
        if (relative.startsWith('Canon/Test_') || relative.startsWith('Canon/Universe_Test_E2e')) continue;
        if (relative.startsWith('99_System/Templates/')) continue;
        if (relative.startsWith('Canon/') && (relative.includes('/Sources/') || relative.includes('/00_Sources/'))) continue;
        let content;
        try {
          content = fs.readFileSync(fullPath, 'utf8');
        } catch {
          continue;
        }
        const parsed = parseMarkdown(content);
        if (parsed.parseError) {
          results[relative] = {
            valid: false,
            noteType: 'unknown',
            errors: [`YAML parse error: ${parsed.parseError}`],
            warnings: [],
          };
          continue;
        }
        const { frontmatter } = parsed;
        if (!frontmatter?.note_type) {
          results[relative] = {
            valid: false,
            noteType: 'unclassified',
            errors: ['Missing mandatory frontmatter property: "note_type"'],
            warnings: [],
          };
          continue;
        }
        results[relative] = validateContent(content, fullPath);
      }
    }
  }
  walk(vaultRoot);
  const failed = Object.values(results).filter(result => !result.valid).length;
  return { valid: failed === 0, results, summary: { total: Object.keys(results).length, passed: Object.keys(results).length - failed, failed } };
}

export function validateSourceCaptures(vaultRoot = process.cwd()) {
  const results = {};
  const canonRoot = path.join(vaultRoot, 'Canon');
  if (!fs.existsSync(canonRoot)) return { valid: true, results, summary: { total: 0, passed: 0, failed: 0 } };
  for (const franchise of fs.readdirSync(canonRoot, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    for (const directory of ['Sources', '00_Sources']) {
      const sourceDir = path.join(canonRoot, franchise.name, directory);
      if (!fs.existsSync(sourceDir)) continue;
      for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
        const relative = path.relative(vaultRoot, path.join(sourceDir, entry.name)).split(path.sep).join('/');
        const errors = [];
        const markdownPath = path.join(sourceDir, entry.name);
        const jsonPath = markdownPath.replace(/\.md$/i, '.json');
        const { frontmatter, parseError } = parseMarkdown(fs.readFileSync(markdownPath, 'utf8'));
        if (parseError) errors.push(`Invalid capture YAML: ${parseError}`);
        if (!frontmatter || typeof frontmatter !== 'object') errors.push('Missing capture frontmatter.');
        else {
          if (frontmatter.note_type !== 'canon-source') errors.push('Capture note_type must be "canon-source".');
          if (typeof frontmatter.cosmology !== 'string' || !frontmatter.cosmology.trim()) errors.push('Capture cosmology must be a non-empty string.');
          if (!EVIDENCE_TIERS.has(frontmatter.canon_tier)) errors.push('Capture canon_tier must be a registered evidence tier; AU and fanon tiers are not valid Canon evidence.');
          if (typeof frontmatter.source_url !== 'string' || !(/^(https?:\/\/|local$)/i.test(frontmatter.source_url))) errors.push('Capture source_url must be HTTP(S) or "local".');
          if (typeof frontmatter.is_processed !== 'boolean') errors.push('Capture is_processed must be a boolean.');
        }
        if (!fs.existsSync(jsonPath)) errors.push('Missing JSON provenance sidecar.');
        else {
          let sidecar;
          try { sidecar = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch (error) { errors.push(`Invalid sidecar JSON: ${error.message}`); }
          if (sidecar) {
            for (const field of ['source_id', 'title', 'franchise', 'canon_tier', 'captured_at', 'content_sha256']) {
              if (typeof sidecar[field] !== 'string' || !sidecar[field].trim()) errors.push(`Sidecar ${field} must be a non-empty string.`);
            }
            if (!EVIDENCE_TIERS.has(sidecar.canon_tier)) errors.push('Sidecar canon_tier must be a registered evidence tier.');
            if (!/^[a-f\d]{64}$/i.test(sidecar.content_sha256 || '')) errors.push('Sidecar content_sha256 must be a 64-character SHA-256 hex digest.');
            if (frontmatter && sidecar.canon_tier !== frontmatter.canon_tier) errors.push('Capture and sidecar canon_tier values must match.');
            if (sidecar.franchise !== frontmatter?.cosmology) errors.push('Sidecar franchise must match capture cosmology.');
            if (!Array.isArray(sidecar.categories) || sidecar.categories.some(value => typeof value !== 'string')) errors.push('Sidecar categories must be an array of strings.');
            if (!sidecar.infobox || typeof sidecar.infobox !== 'object' || Array.isArray(sidecar.infobox)) errors.push('Sidecar infobox must be an object.');
            if (Number.isNaN(Date.parse(sidecar.captured_at || ''))) errors.push('Sidecar captured_at must be a valid date.');
            if (typeof sidecar.url !== 'string' || !(/^(https?:\/\/|local$)/i.test(sidecar.url))) errors.push('Sidecar url must be HTTP(S) or "local".');
          }
        }
        results[relative] = { valid: errors.length === 0, errors, warnings: [] };
      }
    }
  }
  const failed = Object.values(results).filter(result => !result.valid).length;
  return { valid: failed === 0, results, summary: { total: Object.keys(results).length, passed: Object.keys(results).length - failed, failed } };
}

/**
 * CLI execution block
 */
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const targetArg = process.argv[2];

  if (!targetArg || targetArg === '--all' || targetArg === '--notes' || targetArg === '--sources') {
    const scanNotes = process.argv.includes('--notes');
    const scanSources = process.argv.includes('--sources');
    console.log('[TEMPLATE VALIDATOR] Scanning ' + (scanSources ? 'Canon capture metadata and sidecars' : scanNotes ? 'eligible vault notes' : '99_System/Templates/') + ' ...');
    const report = scanSources ? validateSourceCaptures() : scanNotes ? validateVaultNotes() : validateAllTemplates();

    for (const [file, res] of Object.entries(report.results)) {
      if (res.valid) {
        console.log('  ✓ ' + file + ' (' + res.noteType + ')' + (res.exempt ? ' [intentional exception]' : '') + (res.deprecated ? ' [deprecated → ' + res.replacement + ']' : ''));
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
