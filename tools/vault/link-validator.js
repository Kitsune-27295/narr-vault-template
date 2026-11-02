#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ACTIVE_ROOTS = ['00_Cockpit', 'Bible', 'Canon', 'Manuscript', 'Ledgers', 'Sandbox', 'Craft', 'Research', 'context', 'memory'];
const IGNORED_DIRECTORIES = new Set(['.git', 'node_modules', '.scratch', 'graphify-out']);

function markdownFiles(root) {
  const files = [];
  const visit = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name) || entry.name === 'Sources' || entry.name === '00_Sources') continue;
        visit(path.join(directory, entry.name));
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        files.push(path.join(directory, entry.name));
      }
    }
  };

  for (const rootName of ACTIVE_ROOTS) visit(path.join(root, rootName));
  return files.sort();
}

function supportedAssets(root) {
  const baseDirectory = path.join(root, '00_Cockpit', 'Bases');
  if (!fs.existsSync(baseDirectory)) return [];
  return fs.readdirSync(baseDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.base'))
    .map((entry) => path.join(baseDirectory, entry.name));
}

function splitTargetFragment(target) {
  const match = /([#^])/.exec(target);
  if (!match) return { pathTarget: target.trim(), fragment: null };
  return {
    pathTarget: target.slice(0, match.index).trim(),
    fragment: { type: match[1] === '#' ? 'heading' : 'block', value: target.slice(match.index + 1).trim() },
  };
}

function targetCandidates(root, sourceFile, target, basenameIndex) {
  const cleanTarget = target.replaceAll('\\', '/').trim();
  if (!cleanTarget) return [sourceFile];
  if (/^(?:https?:|mailto:|obsidian:)/i.test(cleanTarget)) return [];

  const normalized = cleanTarget.replace(/^\/+/, '');
  const candidates = [];
  const add = (base, value) => {
    const candidate = path.resolve(base, value);
    if (!path.extname(candidate)) candidates.push(`${candidate}.md`);
    candidates.push(candidate);
  };

  if (cleanTarget.startsWith('./') || cleanTarget.startsWith('../')) {
    add(path.dirname(sourceFile), normalized);
  } else {
    add(root, normalized);
    add(path.dirname(sourceFile), normalized);
    if (!normalized.includes('/')) {
      const matches = basenameIndex.get(path.basename(normalized).toLowerCase()) || [];
      candidates.push(...matches);
    }
  }

  return [...new Set(candidates)];
}

function normalizeHeading(value) {
  return value
    .replace(/^\s*#{1,6}\s+/, '')
    .replace(/\s+#+\s*$/, '')
    .replace(/[`*_~]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function fragmentExists(file, fragment) {
  if (!fragment) return true;
  let value;
  try {
    value = decodeURIComponent(fragment.value);
  } catch {
    value = fragment.value;
  }

  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  let inCodeFence = false;
  const headings = new Map();
  const matchesHeading = (headingText) => {
    const slug = normalizeHeading(headingText);
    const duplicateIndex = headings.get(slug) || 0;
    headings.set(slug, duplicateIndex + 1);
    const candidate = duplicateIndex === 0 ? slug : `${slug}-${duplicateIndex}`;
    return candidate === normalizeHeading(value);
  };
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^\s*(```|~~~)/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    if (fragment.type === 'block') {
      const blockId = /(?:^|\s)\^([A-Za-z0-9_-]+)\s*$/.exec(line)?.[1];
      if (blockId === value) return true;
    }
    if (fragment.type === 'heading') {
      const atx = /^\s{0,3}#{1,6}\s+(.+?)\s*$/.exec(line);
      if (atx && matchesHeading(atx[1])) return true;
      const setext = /^\s{0,3}(?:={3,}|-{3,})\s*$/.test(lines[index + 1] || '');
      if (setext && line.trim() && matchesHeading(line.trim())) return true;
    }
  }
  return false;
}

function buildBasenameIndex(files) {
  const index = new Map();
  for (const file of files) {
    const filename = path.basename(file).toLowerCase();
    const stem = path.basename(file, path.extname(file)).toLowerCase();
    for (const key of new Set([filename, stem])) {
      index.set(key, [...(index.get(key) || []), file]);
    }
  }
  return index;
}

function resolveTarget(root, sourceFile, target, basenameIndex) {
  if (/\{\{[^}]+\}\}/.test(target)) return true;
  const { pathTarget, fragment } = splitTargetFragment(target);
  const candidates = targetCandidates(root, sourceFile, pathTarget, basenameIndex);
  return candidates.some((candidate) => {
    const relative = path.relative(root, candidate);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return false;
    try {
      const stat = fs.statSync(candidate);
      return stat.isDirectory() ? !fragment : stat.isFile() && fragmentExists(candidate, fragment);
    } catch {
      return false;
    }
  });
}

/** Validate Obsidian wikilinks in active Canon, Bible, Manuscript, and Cockpit notes. */
export function validateVaultLinks(vaultRoot) {
  const root = path.resolve(vaultRoot);
  const files = markdownFiles(root);
  const basenameIndex = buildBasenameIndex([...files, ...supportedAssets(root)]);
  const brokenLinks = [];

  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    let inCodeFence = false;
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      if (/^\s*(```|~~~)/.test(line)) {
        inCodeFence = !inCodeFence;
        continue;
      }
      if (inCodeFence) continue;

      const withoutInlineCode = line.replace(/`[^`]*`/g, '');
      for (const match of withoutInlineCode.matchAll(/\[\[([^\]]+)\]\]/g)) {
        const target = match[1].replaceAll('\\|', '|').split('|', 1)[0].trim();
        if (!target || /\{\{[^}]+\}\}/.test(target)) continue;
        if (!resolveTarget(root, file, target, basenameIndex)) {
          brokenLinks.push({
            file: path.relative(root, file).split(path.sep).join('/'),
            line: index + 1,
            target,
          });
        }
      }
    }
  }

  return { checkedFiles: files.length, brokenLinks };
}

function parseRoot(args) {
  const flagIndex = args.indexOf('--root');
  return flagIndex === -1 ? process.cwd() : args[flagIndex + 1];
}

function main() {
  const root = parseRoot(process.argv.slice(2));
  if (!root || !fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error('Usage: node tools/vault/link-validator.js [--root <vault-directory>]');
    if (root) console.error(`Vault directory does not exist: ${root}`);
    process.exitCode = 2;
    return;
  }

  const result = validateVaultLinks(root);
  if (result.brokenLinks.length === 0) {
    console.log(`[LINK VALIDATOR] ${result.checkedFiles} active Markdown files checked; 0 unresolved links.`);
    return;
  }

  console.log(`[LINK VALIDATOR] ${result.checkedFiles} active Markdown files checked; ${result.brokenLinks.length} unresolved link(s):`);
  for (const issue of result.brokenLinks) {
    console.log(`  ${issue.file}:${issue.line} -> [[${issue.target}]]`);
  }
  process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
