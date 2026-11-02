import fs from 'node:fs';
import path from 'node:path';
import { dump, load } from 'js-yaml';
import { assertFranchiseName } from '../clipper/franchise-resolver.js';

const yaml = { dump, load };

/**
 * Standard terminology dictionary for Canon Layering
 */
const CANON_TERMINOLOGY = {
  Primary_Energy_System: {
    canonical: 'Primary Energy System',
    portuguese: 'Sistema de Energia Primaria',
    aliases: ['Primary Energy System', 'Primary Power System', 'Core Energy Flow', 'Fundamental Power Law'],
    exclusiveScope: 'Energy nature, biological circulation, cultivation, density/compression, elemental purity',
    delegatedRules: [
      { trigger: '[[Dossier - Specialized Practitioner Ranks]]', desc: 'Title ranks and advancement requirements' },
      { trigger: '[[Dossier - Manifestation Templates]]', desc: 'Energy manifestation and awakenings' },
      { trigger: '[[Dossier - Catalyst Artifacts]]', desc: 'Core absorption and essence integration' },
    ],
  },
  Secondary_Power_System: {
    canonical: 'Secondary Power System',
    portuguese: 'Sistema de Poder Secundario',
    aliases: ['Secondary Power System', 'Foreign Energy System', 'Exotic Pathway System'],
    exclusiveScope: 'Spiritual and physical energy balance, exotic pathways, foreign manipulation and recovery',
    delegatedRules: [
      { trigger: '[[Dossier - Foreign Technique Classification]]', desc: 'Exotic art and discipline classification' },
      { trigger: '[[Dossier - Cross Resonance Laws]]', desc: 'Cross-universe interactions and soul resonance' },
    ],
  },
};

/**
 * Parses existing frontmatter and body from a dossier markdown file
 */
export function parseExistingDossier(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  try {
    const data = yaml.load(match[1]);
    const body = match[2];
    return { frontmatter: data, body };
  } catch {
    return null;
  }
}

/**
 * Synthesizes a brand new Single-Domain Modular Dossier Markdown document
 */
export function synthesizeModularDossier({ routedData, franchise, fontesIntegradas = 1, integratedSources = [] }) {
  const norm = CANON_TERMINOLOGY[routedData.name.replace(/\s+/g, '_')] || {
    canonical: routedData.name,
    aliases: [routedData.name],
    exclusiveScope: 'Core foundational mechanics of this system.',
    delegatedRules: [],
  };

  const aliasesSet = new Set(norm.aliases);
  if (routedData.claims.metadata) {
    Object.values(routedData.claims.metadata).forEach(v => {
      if (typeof v === 'string' && v.length < 50) aliasesSet.add(v);
    });
  }

  const dependenciesSet = new Set(routedData.delegatedWikilinks || []);
  norm.delegatedRules?.forEach(dr => dependenciesSet.add(dr.trigger));

  const frontmatterObj = {
    tipo: 'dossier_modular',
    note_type: routedData.noteType || 'canon-modular-dossier',
    universo: franchise,
    cosmology: franchise,
    dominio: routedData.domain || 'sistema_poder',
    domain: routedData.domain || 'rules_mechanics',
    id_dossier: routedData.id_dossier || `dossier-${routedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    aliases: Array.from(aliasesSet),
    status: 'consolidated',
    status_consolidacao: 'consolidado',
    fontes_integradas: fontesIntegradas,
    sources_integrated: fontesIntegradas,
    dependencias: Array.from(dependenciesSet),
    dependencies: Array.from(dependenciesSet),
    fontes_sha: integratedSources,
    source_shas: integratedSources,
  };

  const frontmatterStr = yaml.dump(frontmatterObj, { lineWidth: -1 }).trim();

  // Section 1
  const sec1 = `## 1. Definição Canônica Unificada & Normalização
> **Termo Padrão no Vault:** ${norm.canonical} (*${norm.aliases[1] || norm.canonical}* / ${norm.aliases[2] || norm.canonical})
> **Domínio Estrito:** ${norm.exclusiveScope}

- **Natureza:** ${routedData.claims.definitions[0] || 'Foundational energy system governing world mechanics.'}`;

  // Section 2
  const mechanicsList = routedData.claims.mechanics
    .map(m => `- **${m.name}:** ${m.rule}`)
    .join('\n');
  const sec2 = `## 2. Mecânicas Fundamentais e Leis Invariantes
${mechanicsList || '- **Regra Base:** Estabelecida pela física canônica fundamental.'}`;

  // Section 3
  const tableContent = routedData.claims.tables.join('\n\n') || `| Reino / Nível (Canônico / Original) | Métrica / Escala | Características Mecânicas e Marcos | Equivalência Típica |
| :--- | :--- | :--- | :--- |
| **Nível 1** | Base | Despertar inicial do sistema | Padrão |`;

  const sec3 = `## 3. Escala de Progressão e Reinos Consolidados
${tableContent}`;

  // Section 4
  const interactions = Array.from(dependenciesSet)
    .map(dep => {
      const rule = norm.delegatedRules?.find(r => r.trigger === dep);
      return `- **Com ${dep}:** ${rule ? rule.desc : 'Interação mecânica delegada.'}`;
    })
    .join('\n');

  const sec4 = `## 4. Interações Entre Sistemas (Cross-Dossier Links)
${interactions || '- **Sem interações ativas mapeadas.**'}`;

  // Section 5
  const sec5 = `## 5. Registro de Divergências, Retcons e Casos de Borda
- **Conflito 1 — Adaptação vs. Texto Original:** Variações visuais em adaptações (Donghua/Manhua) são tratadas como representações estilísticas; a física mecânica da Web Novel prevalece. **Resolução Consolidada:** Regra estrita da Web Novel adotada no Vault.`;

  return `---
${frontmatterStr}
---

# Dossier Modular: ${norm.canonical}

${sec1}

${sec2}

${sec3}

${sec4}

${sec5}
`.trim() + '\n';
}

/**
 * Idempotently merges new claims into an existing dossier document
 */
export function mergeClaimsIntoExisting(existingContent, routedData, sourceSha) {
  const parsed = parseExistingDossier(existingContent);
  if (!parsed) {
    return synthesizeModularDossier({ routedData, franchise: 'General', fontesIntegradas: 1 });
  }

  const { frontmatter, body } = parsed;

  // Check if this source was already merged
  const existingShas = frontmatter.fontes_sha || [];
  if (sourceSha && existingShas.includes(sourceSha)) {
    return existingContent; // Fully idempotent, no changes needed
  }

  if (sourceSha) existingShas.push(sourceSha);
  frontmatter.fontes_sha = existingShas;
  frontmatter.source_shas = existingShas;
  frontmatter.fontes_integradas = (frontmatter.fontes_integradas || 1) + 1;
  frontmatter.sources_integrated = frontmatter.fontes_integradas;

  // Merge aliases
  const aliasSet = new Set(frontmatter.aliases || []);
  if (routedData.claims.metadata) {
    Object.values(routedData.claims.metadata).forEach(v => {
      if (typeof v === 'string' && v.length < 50) aliasSet.add(v);
    });
  }
  frontmatter.aliases = Array.from(aliasSet);

  // Merge dependencies
  const depSet = new Set(frontmatter.dependencias || []);
  (routedData.delegatedWikilinks || []).forEach(d => depSet.add(d));
  frontmatter.dependencias = Array.from(depSet);

  // Merge new mechanics into Section 2
  let updatedBody = body;
  const newMechanics = [];
  routedData.claims.mechanics.forEach(m => {
    if (!updatedBody.includes(m.rule)) {
      newMechanics.push(`- **${m.name}:** ${m.rule}`);
    }
  });

  if (newMechanics.length > 0) {
    updatedBody = updatedBody.replace(
      /(## 2\. Mecânicas Fundamentais e Leis Invariantes\n)([\s\S]*?)(\n## 3\.)/,
      (_match, p1, p2, p3) => `${p1}${p2}\n${newMechanics.join('\n')}${p3}`
    );
  }

  // Merge new cross-dossier interactions into Section 4
  const newInteractions = [];
  routedData.delegatedWikilinks?.forEach(dep => {
    if (!updatedBody.includes(`Com ${dep}:`)) {
      newInteractions.push(`- **Com ${dep}:** Interação mecânica delegada.`);
    }
  });

  if (newInteractions.length > 0) {
    updatedBody = updatedBody.replace(
      /(## 4\. Interações Entre Sistemas \(Cross-Dossier Links\)\n)([\s\S]*?)(\n## 5\.)/,
      (_match, p1, p2, p3) => `${p1}${p2}\n${newInteractions.join('\n')}${p3}`
    );
  }

  const updatedFrontmatterStr = yaml.dump(frontmatter, { lineWidth: -1 }).trim();

  return `---
${updatedFrontmatterStr}
---
${updatedBody.trim()}
\n`;
}

/**
 * Upserts a Modular Dossier to disk under Canon/<Franquia>/<targetSubdir>/
 */
export function upsertModularDossier({ routedData, franchise, vaultRoot = process.cwd(), sourceSha = null }) {
  const targetSubdir = routedData.targetSubdir || '04_Rules_Mechanics';
  const validatedFranchise = assertFranchiseName(franchise);
  const canonBase = path.resolve(vaultRoot, 'Canon');
  const targetDir = path.resolve(canonBase, validatedFranchise, targetSubdir);

  if (!targetDir.startsWith(canonBase + path.sep)) {
    throw new Error(`Path traversal detected: destination directory "${targetDir}" resolves outside Canon.`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  const cleanName = routedData.name.replace(/[:*?"<>|\\/]/g, '').replace(/\s+/g, '_');
  const fileName = `Dossier_${cleanName}.md`;
  const filePath = path.join(targetDir, fileName);

  let status = 'created';
  let finalContent = '';

  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, 'utf8');
    finalContent = mergeClaimsIntoExisting(existingContent, routedData, sourceSha);
    if (finalContent === existingContent) {
      status = 'unchanged';
    } else {
      status = 'updated';
      fs.writeFileSync(filePath, finalContent, 'utf8');
    }
  } else {
    finalContent = synthesizeModularDossier({
      routedData,
      franchise: validatedFranchise,
      fontesIntegradas: 1,
      integratedSources: sourceSha ? [sourceSha] : [],
    });
    fs.writeFileSync(filePath, finalContent, 'utf8');
  }

  return {
    status,
    filePath,
    dossierId: routedData.id_dossier,
  };
}
