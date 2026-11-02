import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { packageTemplate, collectFiles, shouldExclude } from '../tools/packaging/package-template.js';

function inspectZipEntries(zipPath) {
  if (process.platform === 'win32') {
    const psCheck = `
      Add-Type -AssemblyName System.IO.Compression.FileSystem;
      $zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath.replace(/'/g, "''")}');
      $names = $zip.Entries | ForEach-Object { $_.FullName };
      $zip.Dispose();
      $names | ConvertTo-Json -Compress
    `;
    const rawOutput = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psCheck], {
      encoding: 'utf8',
    });
    return JSON.parse(rawOutput).map(p => p.replace(/\\/g, '/'));
  } else {
    const pyCheck = `import zipfile, json
with zipfile.ZipFile(r'${zipPath}', 'r') as z:
    print(json.dumps([n.replace('\\\\', '/') for n in z.namelist()]))
`;
    const rawOutput = execFileSync('python3', ['-c', pyCheck], { encoding: 'utf8' });
    return JSON.parse(rawOutput);
  }
}

function readZipFileEntry(zipPath, entryName) {
  if (process.platform === 'win32') {
    const psReadPkg = `
      Add-Type -AssemblyName System.IO.Compression.FileSystem;
      $zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath.replace(/'/g, "''")}');
      $entry = $zip.GetEntry('${entryName}');
      $stream = $entry.Open();
      $reader = New-Object System.IO.StreamReader($stream);
      $text = $reader.ReadToEnd();
      $reader.Close();
      $stream.Close();
      $zip.Dispose();
      $text
    `;
    return execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psReadPkg], {
      encoding: 'utf8',
    });
  } else {
    const pyRead = `import zipfile
with zipfile.ZipFile(r'${zipPath}', 'r') as z:
    print(z.read('${entryName}').decode('utf8'))
`;
    return execFileSync('python3', ['-c', pyRead], { encoding: 'utf8' });
  }
}

describe('Universal Narrative Vault Template Packager Suite', () => {
  const rootDir = process.cwd();

  it('should correctly identify paths to exclude', () => {
    expect(shouldExclude('node_modules/vitest/index.js')).toBe(true);
    expect(shouldExclude('.git/config')).toBe(true);
    expect(shouldExclude('.scratch/issues/01.md')).toBe(true);
    expect(shouldExclude('.obsidian/workspace.json')).toBe(true);
    expect(shouldExclude('output.zip')).toBe(true);
    expect(shouldExclude('.env')).toBe(true);
    expect(shouldExclude('.env.local')).toBe(true);
    expect(shouldExclude('secret.key')).toBe(true);
    expect(shouldExclude('id_rsa')).toBe(true);

    expect(shouldExclude('00_Cockpit/00_Home_Dashboard.md')).toBe(false);
    expect(shouldExclude('99_System/Templates/TPL_Bible_Cast_Profile.md')).toBe(false);
    expect(shouldExclude('package.json')).toBe(false);
    expect(shouldExclude('AGENTS.md')).toBe(false);
    expect(shouldExclude('.obsidian/app.json')).toBe(false);
  });

  it('collectFiles should collect core vault files and omit transient folders', () => {
    const files = collectFiles(rootDir);
    const relPaths = files.map(f => f.relPath.replace(/\\/g, '/'));

    expect(relPaths).toContain('package.json');
    expect(relPaths).toContain('AGENTS.md');
    expect(relPaths).toContain('CLAUDE.md');
    expect(relPaths).toContain('00_Cockpit/00_Home_Dashboard.md');
    expect(relPaths).toContain('99_System/Templates/TPL_Bible_Cast_Profile.md');

    // Verify absence of forbidden folders
    expect(relPaths.some(p => p.startsWith('node_modules/'))).toBe(false);
    expect(relPaths.some(p => p.startsWith('.git/'))).toBe(false);
    expect(relPaths.some(p => p.startsWith('.scratch/'))).toBe(false);
    expect(relPaths.includes('.obsidian/workspace.json')).toBe(false);
  });

  it(
    'packageTemplate should build a non-empty narrative_vault_framework_template.zip',
    () => {
      const result = packageTemplate({ rootDir });

      expect(result.success).toBe(true);
      expect(fs.existsSync(result.archivePath)).toBe(true);
      expect(result.fileCount).toBeGreaterThan(50);
      expect(result.sizeBytes).toBeGreaterThan(10000); // Greater than 10KB

      const entries = inspectZipEntries(result.archivePath);

      // Verify essential files exist in zip
      expect(entries).toContain('package.json');
      expect(entries).toContain('AGENTS.md');
      expect(entries).toContain('CLAUDE.md');
      expect(entries).toContain('00_Cockpit/00_Home_Dashboard.md');
      expect(entries).toContain('99_System/Templates/TPL_Bible_Cast_Profile.md');

      // Verify transient folders are excluded
      expect(entries.some(p => p.startsWith('node_modules'))).toBe(false);
      expect(entries.some(p => p.startsWith('.git'))).toBe(false);
      expect(entries.some(p => p.startsWith('.scratch'))).toBe(false);
      expect(entries.some(p => p.includes('workspace.json'))).toBe(false);

      // Defense-in-depth: read package.json directly from the zip to verify sanitized name
      const pkgText = readZipFileEntry(result.archivePath, 'package.json');
      const parsedPkg = JSON.parse(pkgText);
      expect(parsedPkg.name).toBe('narrative-vault-framework-template');

      // Clean up generated zip
      if (fs.existsSync(result.archivePath)) {
        fs.unlinkSync(result.archivePath);
      }
    },
    30000
  );
});
