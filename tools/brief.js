#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

export function generateBriefing(projectRoot = process.cwd()) {
  const brief = {
    title: 'Unknown Title',
    fandoms: [],
    epoch: '',
    inFlight: [],
    authorPending: [],
    watchOut: [],
    lastHandoff: null,
    activeChekhovCount: 0,
    activeThreadsCount: 0,
  };

  // 1. vault.yaml
  const vaultYamlPath = path.join(projectRoot, 'vault.yaml');
  if (fs.existsSync(vaultYamlPath)) {
    try {
      const cfg = yamlLoad(fs.readFileSync(vaultYamlPath, 'utf8'));
      if (cfg && cfg.story) {
        brief.title = cfg.story.title || brief.title;
        brief.fandoms = cfg.story.fandoms || [];
        brief.epoch = cfg.story.opening_date || cfg.story.epoch || '';
      }
    } catch {}
  }

  // 2. memory/hot.md
  const hotPath = path.join(projectRoot, 'memory', 'hot.md');
  if (fs.existsSync(hotPath)) {
    const hotContent = fs.readFileSync(hotPath, 'utf8');
    const sections = hotContent.split(/^##\s+/m);
    for (const section of sections) {
      const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
      const header = lines[0] || '';
      if (/in active work/i.test(header)) {
        brief.inFlight = lines.slice(1).filter(l => l.startsWith('-')).map(l => l.replace(/^-\s*/, ''));
      } else if (/what needs the author/i.test(header)) {
        brief.authorPending = lines.slice(1).filter(l => /^\d+\.|\-/.test(l)).map(l => l.replace(/^(\d+\.|\-)\s*/, ''));
      } else if (/watch out/i.test(header)) {
        brief.watchOut = lines.slice(1).filter(l => l.startsWith('-')).map(l => l.replace(/^-\s*/, ''));
      }
    }
  }

  // 3. Ledgers
  const chekhovPath = path.join(projectRoot, 'Ledgers', 'LDG-Chekhov.md');
  if (fs.existsSync(chekhovPath)) {
    const content = fs.readFileSync(chekhovPath, 'utf8');
    const rows = content.split('\n').filter(line => /\|\s*planted\s*\|/i.test(line));
    brief.activeChekhovCount = rows.length;
  }

  const threadsPath = path.join(projectRoot, 'Ledgers', 'LDG-Open_Threads.md');
  if (fs.existsSync(threadsPath)) {
    const content = fs.readFileSync(threadsPath, 'utf8');
    const rows = content.split('\n').filter(line => /\|\s*active\s*\|/i.test(line));
    brief.activeThreadsCount = rows.length;
  }

  const handoffPath = path.join(projectRoot, 'Ledgers', 'LDG-Session_Handoff.md');
  if (fs.existsSync(handoffPath)) {
    const lines = fs.readFileSync(handoffPath, 'utf8').split('\n').map(l => l.trim()).filter(l => l.startsWith('|') && !l.includes('---|---') && !l.includes('Completed in Session'));
    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      const cols = lastLine.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 5) {
        brief.lastHandoff = {
          date: cols[0],
          operator: cols[1],
          completed: cols[2],
          inFlight: cols[3],
          nextPriority: cols[4],
        };
      }
    }
  }

  return brief;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  const brief = generateBriefing(root);

  console.log(`\n================================================================`);
  console.log(`🌅 [MORNING BRIEFING] ${brief.title}`);
  console.log(`================================================================`);
  console.log(`Fandoms:       ${brief.fandoms.join(', ')}`);
  console.log(`Chronology:    ${brief.epoch}`);
  console.log(`Active Plants: ${brief.activeChekhovCount} elements awaiting payoff (LDG-Chekhov)`);
  console.log(`Open Threads:  ${brief.activeThreadsCount} active subplots (LDG-Open_Threads)`);

  if (brief.inFlight.length > 0) {
    console.log(`\nIn Active Work:`);
    for (const item of brief.inFlight) console.log(`  • ${item}`);
  }

  if (brief.authorPending.length > 0) {
    console.log(`\nWhat Needs the Author:`);
    for (const item of brief.authorPending) console.log(`  ? ${item}`);
  }

  if (brief.watchOut.length > 0) {
    console.log(`\nActive Invariants & Watch-Outs:`);
    for (const item of brief.watchOut) console.log(`  ! ${item}`);
  }

  if (brief.lastHandoff) {
    console.log(`\nPrevious Session Handoff (${brief.lastHandoff.date}):`);
    console.log(`  Completed:     ${brief.lastHandoff.completed}`);
    console.log(`  In Flight:     ${brief.lastHandoff.inFlight}`);
    console.log(`  Next Priority: ${brief.lastHandoff.nextPriority}`);
  }
  console.log(`================================================================\n`);
}

