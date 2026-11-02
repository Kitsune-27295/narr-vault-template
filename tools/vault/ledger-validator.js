#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

export function validateLedgers(projectRoot = process.cwd()) {
  const issues = [];
  const warnings = [];

  // 1. Read thresholds from vault.yaml
  let chekhovThreshold = 3;
  let threadThreshold = 5;
  const vaultYamlPath = path.join(projectRoot, 'vault.yaml');
  if (fs.existsSync(vaultYamlPath)) {
    try {
      const cfg = yamlLoad(fs.readFileSync(vaultYamlPath, 'utf8'));
      if (cfg && cfg.thresholds) {
        if (cfg.thresholds.chekhov_gap) chekhovThreshold = cfg.thresholds.chekhov_gap;
        if (cfg.thresholds.thread_dormant_gap) threadThreshold = cfg.thresholds.thread_dormant_gap;
      }
    } catch {}
  }

  // Find latest manuscript chapter number
  let currentChapterNum = 1;
  const manuscriptDir = path.join(projectRoot, 'Manuscript', 'pt-BR');
  if (fs.existsSync(manuscriptDir)) {
    const files = fs.readdirSync(manuscriptDir);
    for (const file of files) {
      const match = file.match(/C0*(\d+)/i) || file.match(/Chapter[_-]0*(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > currentChapterNum) currentChapterNum = num;
      }
    }
  }

  // 2. Validate LDG-Chekhov.md
  const chekhovPath = path.join(projectRoot, 'Ledgers', 'LDG-Chekhov.md');
  if (!fs.existsSync(chekhovPath)) {
    issues.push('Missing required ledger: Ledgers/LDG-Chekhov.md');
  } else {
    const content = fs.readFileSync(chekhovPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---|---') && !l.includes('Planted in'));
    for (const line of lines) {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length < 4) {
        issues.push(`Malformed row in LDG-Chekhov.md: "${line}"`);
        continue;
      }
      const [element, plantedIn, payoffIn, status] = cols;
      const validStatuses = new Set(['planted', 'paid_off', 'abandoned']);
      if (!validStatuses.has(status.toLowerCase())) {
        issues.push(`Invalid status in LDG-Chekhov.md for "${element}": "${status}". Expected planted, paid_off, or abandoned.`);
      }

      // Check same chapter payoff coincidence
      if (plantedIn && payoffIn && plantedIn.toLowerCase() === payoffIn.toLowerCase()) {
        issues.push(`Same-chapter payoff violation for "${element}": planted in ${plantedIn} and paid off in ${payoffIn}. Payoffs must occur in subsequent chapters.`);
      }

      // Check chekhov gap
      const plantMatch = plantedIn.match(/C0*(\d+)/i);
      if (plantMatch && status.toLowerCase() === 'planted') {
        const plantNum = parseInt(plantMatch[1], 10);
        const gap = currentChapterNum - plantNum;
        if (gap > chekhovThreshold) {
          warnings.push(`Chekhov gap warning for "${element}": planted in C0${plantNum}, current chapter is C0${currentChapterNum} (gap of ${gap} exceeds threshold of ${chekhovThreshold}).`);
        }
      }
    }
  }

  // 3. Validate LDG-Decisions.md
  const decisionsPath = path.join(projectRoot, 'Ledgers', 'LDG-Decisions.md');
  if (!fs.existsSync(decisionsPath)) {
    issues.push('Missing required ledger: Ledgers/LDG-Decisions.md');
  } else {
    const content = fs.readFileSync(decisionsPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---|---') && !l.includes('What was rejected'));
    for (const line of lines) {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length < 4) {
        issues.push(`Malformed row in LDG-Decisions.md: "${line}"`);
      }
    }
  }

  // 4. Validate LDG-Open_Threads.md
  const threadsPath = path.join(projectRoot, 'Ledgers', 'LDG-Open_Threads.md');
  if (!fs.existsSync(threadsPath)) {
    issues.push('Missing required ledger: Ledgers/LDG-Open_Threads.md');
  } else {
    const content = fs.readFileSync(threadsPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---|---') && !l.includes('Thread / Investigation'));
    for (const line of lines) {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length < 5) {
        issues.push(`Malformed row in LDG-Open_Threads.md: "${line}"`);
        continue;
      }
      const [id, scope, openedIn, target, status] = cols;
      const validStatuses = new Set(['active', 'dormant', 'resolved']);
      if (!validStatuses.has(status.toLowerCase())) {
        issues.push(`Invalid status in LDG-Open_Threads.md for ${id}: "${status}". Expected active, dormant, or resolved.`);
      }

      // Check dormant thread gap
      const openMatch = openedIn.match(/C0*(\d+)/i);
      if (openMatch && status.toLowerCase() === 'dormant') {
        const openNum = parseInt(openMatch[1], 10);
        const gap = currentChapterNum - openNum;
        if (gap > threadThreshold) {
          warnings.push(`Dormant thread warning for ${id} ("${scope}"): opened in C0${openNum}, current chapter is C0${currentChapterNum} (gap of ${gap} exceeds threshold of ${threadThreshold}).`);
        }
      }
    }
  }

  // 5. Validate LDG-Contradictions.md
  const contradictionsPath = path.join(projectRoot, 'Ledgers', 'LDG-Contradictions.md');
  if (!fs.existsSync(contradictionsPath)) {
    issues.push('Missing required ledger: Ledgers/LDG-Contradictions.md');
  } else {
    const content = fs.readFileSync(contradictionsPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---|---') && !l.includes('Side A'));
    for (const line of lines) {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length < 5) {
        issues.push(`Malformed row in LDG-Contradictions.md: "${line}"`);
        continue;
      }
      const [, , , , status, resolution] = cols;
      if (!['open', 'resolved'].includes(status.toLowerCase())) {
        issues.push(`Invalid contradiction status: "${status}". Expected open or resolved.`);
      }
      if (status.toLowerCase() === 'resolved' && (!resolution || resolution.trim() === '')) {
        issues.push(`Resolved contradiction missing authoritative resolution statement: "${line}"`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  console.log(`\n⚖️ [LEDGER VALIDATOR] Checking continuity ledgers...\n`);
  const report = validateLedgers(root);

  if (report.warnings.length > 0) {
    console.log(`⚠️ Warnings:`);
    for (const w of report.warnings) console.log(`  - ${w}`);
    console.log();
  }

  if (report.issues.length > 0) {
    console.log(`❌ Validation Failures:`);
    for (const err of report.issues) console.log(`  - ${err}`);
    console.log(`\nLedger validation FAILED with ${report.issues.length} issue(s).\n`);
    process.exit(1);
  }

  console.log(`✓ All continuity ledgers structurally valid and threshold-compliant.\n`);
  process.exit(0);
}

