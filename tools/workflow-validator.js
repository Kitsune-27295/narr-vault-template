import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const requiredSkills = ['grilling', 'grill-me', 'to-spec', 'to-tickets', 'implement', 'tdd', 'code-review', 'setup-matt-pocock-skills'];
const stages = ['grilling', 'to-spec', 'to-tickets', 'implement', 'tdd', 'code-review'];
const protocolRequirements = {
  grilling: ['$to-spec', 'materially unresolved'],
  'grill-me': ['grilling/SKILL.md'],
  'to-spec': ['$grilling', 'user stories', 'ready-for-agent'],
  'to-tickets': ['Blocked by', 'ready-for-agent', 'cycles'],
  implement: ['claimed', '$tdd', '$code-review', 'npm test'],
  tdd: ['fails', 'minimum change', 'public'],
  'code-review': ['Standards', 'Spec', 'read-only'],
  'setup-matt-pocock-skills': ['smallest additive repair', 'idempotent'],
};

export function validateWorkflow(root) {
  const errors = [];
  const skillRoot = path.join(root, '.agents', 'skills');
  const allContent = [];
  for (const name of requiredSkills) {
    const dir = path.join(skillRoot, name);
    const file = path.join(dir, 'SKILL.md');
    if (!fs.existsSync(file)) { errors.push(`missing skill: ${name}/SKILL.md`); continue; }
    const content = fs.readFileSync(file, 'utf8');
    allContent.push(content);
    for (const requirement of protocolRequirements[name]) {
      if (!content.toLowerCase().includes(requirement.toLowerCase())) errors.push(`${name}: missing protocol requirement ${requirement}`);
    }
    const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (!match) { errors.push(`${name}: missing frontmatter`); continue; }
    for (const field of ['name', 'description']) if (!new RegExp(`^${field}:\\s*.+$`, 'm').test(match[1])) errors.push(`${name}: missing ${field}`);
    const declaredName = match[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    if (declaredName !== name) errors.push(`${name}: name must be ${name}`);
    for (const target of content.matchAll(/\]\(([^)#]+\.md)(?:#[^)]*)?\)/g)) {
      const resolved = path.resolve(dir, target[1]);
      if (!resolved.startsWith(`${path.resolve(root)}${path.sep}`) || !fs.existsSync(resolved)) errors.push(`${name}: broken reference ${target[1]}`);
    }
  }
  const shared = path.join(root, 'docs', 'agents', 'native-construction-workflow.md');
  if (!fs.existsSync(shared)) errors.push('missing shared workflow reference: docs/agents/native-construction-workflow.md');
  else allContent.push(fs.readFileSync(shared, 'utf8'));
  const combined = allContent.join('\n');
  for (const stage of stages) if (!combined.includes(stage)) errors.push(`missing workflow stage coverage: ${stage}`);
  if (/([A-Z]:\\Users\\[^\s)]+|~\/\.gemini\/|\.gemini[\\/])/i.test(combined)) errors.push('external user-profile dependency detected');
  return { errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateWorkflow(process.argv[2] ? path.resolve(process.argv[2]) : process.cwd());
  if (result.errors.length) { console.error(result.errors.map((error) => `- ${error}`).join('\n')); process.exitCode = 1; }
  else console.log(`Native construction workflow valid (${requiredSkills.length} skills).`);
}
