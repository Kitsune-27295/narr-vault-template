import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tempRoots = [];
const cliPath = fileURLToPath(new URL('../tools/vault/link-validator.js', import.meta.url));

function createVault(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vault-link-test-'));
  tempRoots.push(root);
  for (const [relativePath, content] of Object.entries(files)) {
    const absolutePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, content, 'utf8');
  }
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('vault link integrity command', () => {
  it('accepts existing root-relative, alias, anchor, relative, and folder links', () => {
    const root = createVault({
      'Canon/Universe_Alpha/01_Characters/Character_Alpha.md': '# Character_Alpha\n## Voice\nBiography\n========\n',
      'Canon/Universe_Alpha/Sources/Source.md': '# Source\n',
      'Bible/02_Cast_Characters/Character_Beta.md': '# Character_Beta\n## Voice\nA vivid voice. ^beta-voice\n',
      'Canon/Universe_Alpha/00_Universe_Alpha_Index.md': '[[01_Characters/\\|Characters]]\n',
      '00_Cockpit/Bases/Canon_Holocron.base': 'filters: []\n',
      '00_Cockpit/00_Home_Dashboard.md': '[[Canon_Holocron.base]]\n',
      'Manuscript/pt-BR/scene.md': [
        '[[Canon/Universe_Alpha/01_Characters/Character_Alpha|Character_Alpha]]',
        '[[Bible/02_Cast_Characters/Character_Beta#Voice|Character_Beta voice]]',
        '[[Bible/02_Cast_Characters/Character_Beta^beta-voice|Character_Beta paragraph]]',
        '[[Canon/Universe_Alpha/01_Characters/Character_Alpha#Biography|Character_Alpha history]]',
        '[[../../Canon/Universe_Alpha/01_Characters/Character_Alpha.md]]',
        '[[Canon/Universe_Alpha/Sources/]]',
        '[[{{character_note}}]]',
      ].join('\n'),
      'Canon/Universe_Alpha/Sources/raw.md': '[[missing/raw-source-link]]\n',
    });

    const result = spawnSync(process.execPath, [cliPath, '--root', root], { encoding: 'utf8' });

    expect(result.stdout).toContain('0 unresolved');
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
  });

  it('fails with a source location when an active note links to a missing target', () => {
    const root = createVault({
      'Bible/02_Cast_Characters/Character_Beta.md': '# Character_Beta\n[[Canon/Universe_Alpha/01_Characters/Missing|Missing]]\n',
    });

    const result = spawnSync(process.execPath, [cliPath, '--root', root], { encoding: 'utf8' });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('Bible/02_Cast_Characters/Character_Beta.md:2');
    expect(result.stdout).toContain('Canon/Universe_Alpha/01_Characters/Missing');
  });

  it('rejects a root that is not a vault directory', () => {
    const root = path.join(os.tmpdir(), 'missing-vault-link-test');

    const result = spawnSync(process.execPath, [cliPath, '--root', root], { encoding: 'utf8' });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Vault directory does not exist');
  });

  it('fails when a note exists but the requested heading or block anchor does not', () => {
    const root = createVault({
      'Canon/Universe_Alpha/01_Characters/Character_Alpha.md': '# Character_Alpha\n## History\n',
      'Bible/02_Cast_Characters/Character_Beta.md': [
        '[[Canon/Universe_Alpha/01_Characters/Character_Alpha#Biography|Biography]]',
        '[[Canon/Universe_Alpha/01_Characters/Character_Alpha^missing-block|Missing block]]',
      ].join('\n'),
    });

    const result = spawnSync(process.execPath, [cliPath, '--root', root], { encoding: 'utf8' });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('Character_Alpha#Biography');
    expect(result.stdout).toContain('Character_Alpha^missing-block');
  });

  it('does not accept a wrong explicit path just because another note has the same basename', () => {
    const root = createVault({
      'Canon/Other/Character_Alpha.md': '# Character_Alpha\n',
      'Bible/02_Cast_Characters/Character_Beta.md': '[[Canon/Universe_Alpha/01_Characters/Character_Alpha|Character_Alpha]]\n',
    });

    const result = spawnSync(process.execPath, [cliPath, '--root', root], { encoding: 'utf8' });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('Canon/Universe_Alpha/01_Characters/Character_Alpha');
  });
});
