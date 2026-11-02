/**
 * Evaluates the 3 Pillars Rule to prevent hyper-fragmentation
 */
export function evaluateThreePillars({ hasOwnRules, hasProgressionScale, isReusableAcrossArcs }) {
  const isModularDossier = Boolean(hasOwnRules && hasProgressionScale && isReusableAcrossArcs);
  return {
    isModularDossier,
    routingTarget: isModularDossier ? 'modular_dossier' : 'catalog_subentry',
  };
}

/**
 * Extracts atomic claims from markdown content and JSON sidecar
 */
export function extractAtomicClaims(markdown, sidecar = {}) {
  const claims = [];
  // Strip frontmatter if present
  const cleanMarkdown = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const lines = cleanMarkdown.split('\n');
  let currentSection = 'Introduction';
  let inTable = false;
  let tableLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Section header detection
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (inTable && tableLines.length > 0) {
        claims.push({
          type: 'progression_table',
          section: currentSection,
          content: tableLines.join('\n'),
        });
        inTable = false;
        tableLines = [];
      }
      currentSection = line.replace(/^#+\s*/, '');
      continue;
    }

    // Markdown Table detection
    if (line.startsWith('|')) {
      inTable = true;
      tableLines.push(line);
      continue;
    } else if (inTable) {
      if (tableLines.length > 0) {
        claims.push({
          type: 'progression_table',
          section: currentSection,
          content: tableLines.join('\n'),
        });
      }
      inTable = false;
      tableLines = [];
    }

    // Definition extraction from opening paragraphs
    if (currentSection === 'Introduction' && line.length > 20 && !line.startsWith('#')) {
      claims.push({
        type: 'definition',
        section: 'Definition',
        text: line,
      });
      continue;
    }

    // Rule or mechanic bullet point
    if (line.startsWith('- **') || line.startsWith('* **')) {
      const match = line.match(/^[-*]\s+\*\*(.+?):\*\*\s*(.*)$/);
      if (match) {
        claims.push({
          type: 'mechanic',
          name: match[1],
          rule: match[2],
          section: currentSection,
        });
        continue;
      }
    }

    // Plain bullet or statement
    if (line.startsWith('- ') || line.startsWith('* ')) {
      claims.push({
        type: 'mechanic',
        name: 'Observation',
        rule: line.replace(/^[-*]\s+/, ''),
        section: currentSection,
      });
    }
  }

  if (inTable && tableLines.length > 0) {
    claims.push({
      type: 'progression_table',
      section: currentSection,
      content: tableLines.join('\n'),
    });
  }

  // Include infobox aliases and attributes as claims
  if (sidecar?.infobox) {
    Object.entries(sidecar.infobox).forEach(([key, val]) => {
      claims.push({
        type: 'metadata',
        key,
        value: val,
      });
    });
  }

  return claims;
}

/**
 * Domain Scope Contracts for Fandom Systems
 */
const DOMAIN_SCOPE_CONTRACTS = {
  Universe_Primary: {
    Primary_Energy_System: {
      domain: 'sistema_poder',
      slug: 'dossier-primary-energy-system',
      exclusiveKeywords: ['energy', 'circulation', 'biological', 'density', 'recovery', 'innate'],
      delegatedLinks: [
        { trigger: ['rank', 'title', 'practitioner rank', 'advancement', 'hierarchy'], link: '[[Dossier - Specialized Practitioner Ranks]]' },
        { trigger: ['manifestation', 'awakening', 'template'], link: '[[Dossier - Manifestation Templates]]' },
        { trigger: ['catalyst', 'core', 'relic'], link: '[[Dossier - Catalyst Artifacts]]' },
      ],
    },
  },
  Universe_Secondary: {
    Secondary_Power_System: {
      domain: 'sistema_poder',
      slug: 'dossier-secondary-power-system',
      exclusiveKeywords: ['exotic energy', 'resonance', 'foreign pathways', 'cross-system'],
      delegatedLinks: [
        { trigger: ['foreign technique', 'exotic art'], link: '[[Dossier - Foreign Technique Classification]]' },
        { trigger: ['cross resonance', 'soul resonance'], link: '[[Dossier - Cross Resonance Laws]]' },
      ],
    },
  },
};

/**
 * Routes atomic claims into appropriate modular dossiers while applying scope contracts
 */
export function routeClaimsToDomains(claims, franchise = 'Universe_Primary', sidecar = {}) {
  const franchiseContracts = DOMAIN_SCOPE_CONTRACTS[franchise] || {};
  const routed = {
    dossiers: {},
    catalogEntries: {},
  };

  // Determine main target dossier from sidecar or claims
  let targetKey = sidecar?.title ? sidecar.title.replace(/\s+/g, '_') : 'Primary_Energy_System';
  if (!sidecar?.title) {
    const defClaim = claims.find(c => c.type === 'definition');
    if (defClaim?.metadata?.title) {
      targetKey = defClaim.metadata.title.replace(/\s+/g, '_');
    } else if (defClaim?.text) {
      const textLower = defClaim.text.toLowerCase();
      if (textLower.includes('secondary') || textLower.includes('foreign')) {
        targetKey = 'Secondary_Power_System';
      } else {
        targetKey = 'Primary_Energy_System';
      }
    }
  }

  const title = (sidecar?.title || targetKey).replace(/_/g, ' ');
  const infobox = sidecar?.infobox || {};
  const categories = sidecar?.categories || [];

  let targetSubdir = '04_Rules_Mechanics';
  let domain = 'sistema_poder';
  let noteType = 'canon-power-system';

  // 1. Timeline Events / Wars
  if (
    /(\bWar\b|\bAttack\b|\bIncident\b|\bBattle\b|\bConflict\b)/i.test(title) ||
    categories.some(c => /(War|Event|History|Battle)/i.test(c))
  ) {
    targetSubdir = '06_Timeline_Events';
    domain = 'timeline_events';
    noteType = 'canon-event';
  }
  // 2. Factions / Clans / Organizations
  else if (
    /(\bClan\b|\bCouncil\b|\bRoot\b|\bOrganization\b|\bPolice\b|\bCorps\b)/i.test(title) ||
    infobox['Known Members'] ||
    (infobox['Affiliation'] && !infobox['Birthdate'] && !infobox['Sex'])
  ) {
    targetSubdir = '03_Factions_Cultures';
    domain = 'factions_cultures';
    noteType = 'canon-faction';
  }
  // 3. Characters
  else if (
    infobox['Birthdate'] ||
    infobox['Sex'] ||
    infobox['Blood type'] ||
    infobox['Ninja Rank'] ||
    infobox['Family'] ||
    infobox['Status'] === 'Deceased' ||
    infobox['Status'] === 'Alive' ||
    /(\bSenju\b|\bUzumaki\b|\bUchiha\b|\bHatake\b|\bSarutobi\b|\bNamikaze\b|\bKurama\b|\bJiraiya\b|\bTsunade\b|\bNawaki\b|\bDanzo\b|\bKatō\b|\bKato\b)/i.test(title)
  ) {
    targetSubdir = '01_Characters';
    domain = 'characters';
    noteType = 'canon-character';
  }
  // 4. Locations
  else if (
    infobox['Country'] ||
    infobox['Leader'] ||
    infobox['Population'] ||
    /(gakure|\bVillage\b|\bCountry\b|\bLand of\b|\bMountain\b|\bValley\b|\bForest\b|Myōboku|Myoboku)/i.test(title)
  ) {
    targetSubdir = '02_Locations';
    domain = 'locations';
    noteType = 'canon-location';
  }
  // 5. Items / Artifacts
  else if (
    infobox['Classification'] === 'Tool' ||
    infobox['Classification'] === 'Weapon' ||
    /(\bSword\b|\bBlade\b|\bScroll\b|\bArtifact\b|\bTreasure\b)/i.test(title)
  ) {
    targetSubdir = '05_Items_Artifacts';
    domain = 'items_artifacts';
    noteType = 'canon-item';
  }

  const contract = franchiseContracts[targetKey] || {
    domain,
    slug: `dossier-${targetKey.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    delegatedLinks: [],
  };

  const dossierClaims = {
    definitions: [],
    mechanics: [],
    tables: [],
    metadata: {},
    delegatedWikilinks: new Set(),
  };

  claims.forEach(claim => {
    if (claim.type === 'definition') {
      dossierClaims.definitions.push(claim.text);
    } else if (claim.type === 'mechanic') {
      // 3-Pillar check: is this claim an isolated sub-item?
      if (claim.name?.includes('Skill') || claim.name?.includes('Silver') || claim.name?.includes('Metal')) {
        if (!routed.catalogEntries[claim.name]) {
          routed.catalogEntries[claim.name] = [];
        }
        routed.catalogEntries[claim.name].push(claim);
      } else {
        dossierClaims.mechanics.push(claim);
      }

      // Check for delegated triggers
      contract.delegatedLinks?.forEach(dlg => {
        const triggers = dlg.trigger;
        const text = `${claim.name} ${claim.rule}`.toLowerCase();
        if (triggers.some(t => text.includes(t))) {
          dossierClaims.delegatedWikilinks.add(dlg.link);
        }
      });
    } else if (claim.type === 'progression_table') {
      dossierClaims.tables.push(claim.content);
      contract.delegatedLinks?.forEach(dlg => {
        const text = claim.content.toLowerCase();
        if (dlg.trigger.some(t => text.includes(t))) {
          dossierClaims.delegatedWikilinks.add(dlg.link);
        }
      });
    } else if (claim.type === 'metadata') {
      dossierClaims.metadata[claim.key] = claim.value;
    }
  });

  routed.dossiers[targetKey] = {
    name: targetKey.replace(/_/g, ' '),
    domain: contract.domain || domain,
    id_dossier: contract.slug,
    targetSubdir,
    noteType,
    claims: dossierClaims,
    delegatedWikilinks: Array.from(dossierClaims.delegatedWikilinks),
  };

  return routed;
}

