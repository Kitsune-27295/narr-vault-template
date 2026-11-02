#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function closeSession(options = {}, projectRoot = process.cwd()) {
  const dateStr = options.date || new Date().toISOString().slice(0, 10);
  const operator = options.operator || 'Agent';
  const completed = options.done || 'Routine maintenance and verification pass';
  const inFlight = options.inFlight || 'None';
  const nextPriority = options.next || 'Continue next planned narrative beat or issue';

  // 1. Append to Ledgers/LDG-Session_Handoff.md
  const handoffPath = path.join(projectRoot, 'Ledgers', 'LDG-Session_Handoff.md');
  if (fs.existsSync(handoffPath)) {
    const row = `| ${dateStr} | ${operator} | ${completed} | ${inFlight} | ${nextPriority} |\n`;
    fs.appendFileSync(handoffPath, row, 'utf8');
  }

  // 2. Append to memory/journal/YYYY-MM.md
  const monthStr = dateStr.slice(0, 7);
  const journalDir = path.join(projectRoot, 'memory', 'journal');
  if (!fs.existsSync(journalDir)) fs.mkdirSync(journalDir, { recursive: true });
  const journalPath = path.join(journalDir, `${monthStr}.md`);

  if (!fs.existsSync(journalPath)) {
    fs.writeFileSync(journalPath, `# Session Journal — ${monthStr}\n\nAppend-only record of working sessions.\n\n`, 'utf8');
  }
  const journalEntry = `- [${dateStr}] session | ${completed}\n`;
  fs.appendFileSync(journalPath, journalEntry, 'utf8');

  // 3. Update memory/hot.md updated timestamp & check budget
  let hotBudgetOk = true;
  const hotPath = path.join(projectRoot, 'memory', 'hot.md');
  if (fs.existsSync(hotPath)) {
    let hotContent = fs.readFileSync(hotPath, 'utf8');
    hotContent = hotContent.replace(/^updated:\s*.*$/m, `updated: ${dateStr}`);
    fs.writeFileSync(hotPath, hotContent, 'utf8');
    const lineCount = hotContent.split('\n').length;
    if (lineCount > 60) {
      hotBudgetOk = false;
      console.warn(`[SESSION CLOSE WARNING] memory/hot.md line count (${lineCount}) exceeds 60-line budget.`);
    }
  }

  return {
    success: true,
    date: dateStr,
    completed,
    inFlight,
    nextPriority,
    hotBudgetOk,
  };
}

function parseCliArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--done' && args[i + 1]) options.done = args[++i];
    else if (args[i] === '--in-flight' && args[i + 1]) options.inFlight = args[++i];
    else if (args[i] === '--next' && args[i + 1]) options.next = args[++i];
    else if (args[i] === '--operator' && args[i + 1]) options.operator = args[++i];
  }
  return options;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  const options = parseCliArgs(process.argv.slice(2));
  const res = closeSession(options, root);

  console.log(`\n📋 [SESSION CLOSE] Recorded handoff for ${res.date}`);
  console.log(`  Completed:     ${res.completed}`);
  console.log(`  In Flight:     ${res.inFlight}`);
  console.log(`  Next Priority: ${res.nextPriority}\n`);
}

