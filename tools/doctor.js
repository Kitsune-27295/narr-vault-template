#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

export async function runDoctorChecks(projectRoot = process.cwd()) {
  const results = {
    passed: true,
    checks: [],
  };

  function record(category, name, passed, details = '') {
    results.checks.push({ category, name, passed, details });
    if (!passed) results.passed = false;
  }

  // 1. Runtime & SQLite
  const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
  record('Runtime', 'Node.js Version (>= 22)', nodeMajor >= 22, `Current: v${process.versions.node}`);

  try {
    const { DatabaseSync } = await import('node:sqlite');
    const db = new DatabaseSync(':memory:');
    db.exec('CREATE TABLE test (id INTEGER);');
    db.close();
    record('Runtime', 'Native SQLite (node:sqlite DatabaseSync)', true, 'Functional');
  } catch (err) {
    record('Runtime', 'Native SQLite (node:sqlite DatabaseSync)', false, err.message);
  }

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

  return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  console.log(`\n🏥 [VAULT DOCTOR] Inspecting vault environment: ${root}\n`);
  runDoctorChecks(root).then(results => {
    let lastCat = '';
    for (const check of results.checks) {
      if (check.category !== lastCat) {
        console.log(`\n--- ${check.category} ---`);
        lastCat = check.category;
      }
      const icon = check.passed ? '✓' : '✗';
      console.log(`  ${icon} ${check.name.padEnd(45)} ${check.details}`);
    }

    console.log(`\nDiagnostic Summary: ${results.passed ? 'ALL CHECKS PASSED (HEALTHY)' : 'CRITICAL FINDINGS DETECTED'}\n`);
    process.exit(results.passed ? 0 : 1);
  });
}
