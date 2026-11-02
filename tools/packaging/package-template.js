import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

/**
 * Directories and file patterns to strictly exclude from the universal template
 */
export const EXCLUDE_PATTERNS = [
  /^node_modules[\\/]?/,
  /^\.git[\\/]?/,
  /^\.scratch[\\/]?/,
  /^\.temp_staging[\\/]?/,
  /^\.env/,
  /\.(pem|key|p12|pfx)$/i,
  /id_rsa/i,
  /\.zip$/i,
  /\.log$/i,
  /\.db$/i,
  /\.db-journal$/i,
  /\.db-shm$/i,
  /\.db-wal$/i,
  /^\.obsidian[\\/]workspace\.json$/,
  /Thumbs\.db$/i,
  /\.DS_Store$/i,
];

/**
 * Checks whether a relative file path should be excluded
 */
export function shouldExclude(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(normalized) || pattern.test(relPath));
}

/**
 * Recursively scans a directory collecting non-excluded files.
 */
function scanDir(dir, baseDir = dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const subRel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    const targetRel = prefix ? `${prefix}/${subRel}` : subRel;

    if (shouldExclude(targetRel)) {
      continue;
    }

    if (entry.isDirectory()) {
      results.push(...scanDir(fullPath, baseDir, prefix));
    } else if (entry.isFile()) {
      results.push({ fullPath, relPath: targetRel });
    }
  }

  return results;
}

/**
 * Recursively collects all files to include.
 * In a standalone vault, scans dir directly.
 * In the monorepo split layout (packages/narr-fiction), synthesizes the template tree by
 * combining frameworks/vault/narr/templates, frameworks/vault/narr/rules, and package tools/tests.
 */
export function collectFiles(dir, baseDir = dir) {
  const isStandalone = fs.existsSync(path.join(dir, '00_Cockpit')) && fs.existsSync(path.join(dir, '99_System', 'Templates'));
  const monorepoVault = path.resolve(dir, '../../frameworks/vault/narr');

  if (!isStandalone && fs.existsSync(monorepoVault)) {
    const templatesDir = path.join(monorepoVault, 'templates');
    const rulesDir = path.join(monorepoVault, 'rules');
    const results = [];

    // 1. Templates mapped to vault root
    if (fs.existsSync(templatesDir)) {
      results.push(...scanDir(templatesDir, templatesDir, ''));
    }

    // 2. Rules mapped to vault root (AGENTS.md, CLAUDE.md)
    if (fs.existsSync(rulesDir)) {
      results.push(...scanDir(rulesDir, rulesDir, ''));
    }

    // 3. Package root files (package.json, package-lock.json)
    for (const f of ['package.json', 'package-lock.json']) {
      const p = path.join(dir, f);
      if (fs.existsSync(p)) {
        results.push({ fullPath: p, relPath: f });
      }
    }

    // 4. Package tools directory
    const toolsDir = path.join(dir, 'tools');
    if (fs.existsSync(toolsDir)) {
      results.push(...scanDir(toolsDir, dir, ''));
    }

    // 5. Package tests directory
    const testsDir = path.join(dir, 'tests');
    if (fs.existsSync(testsDir)) {
      results.push(...scanDir(testsDir, dir, ''));
    }

    return results;
  }

  return scanDir(dir, baseDir, '');
}

/**
 * Compresses stagingDir into outputZipPath cross-platform.
 */
function createZipArchive(stagingDir, outputZipPath) {
  if (process.platform === 'win32') {
    const psCommand = `Compress-Archive -Path (Get-ChildItem -Path '${stagingDir.replace(/'/g, "''")}' | Select-Object -ExpandProperty FullName) -DestinationPath '${outputZipPath.replace(/'/g, "''")}' -Force`;
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psCommand], {
      stdio: 'pipe',
    });
  } else {
    try {
      execFileSync('zip', ['-r', '-q', outputZipPath, '.'], { cwd: stagingDir, stdio: 'pipe' });
    } catch {
      const pyScript = `import zipfile, os
z = zipfile.ZipFile(r'${outputZipPath}', 'w', zipfile.ZIP_DEFLATED)
staging = r'${stagingDir}'
for root, dirs, files in os.walk(staging):
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, staging)
        z.write(full, rel)
z.close()`;
      execFileSync('python3', ['-c', pyScript], { stdio: 'pipe' });
    }
  }
}

/**
 * Packages the repository into a clean, universal template zip archive
 */
export function packageTemplate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const outputZipName = options.outputZipName || 'narrative_vault_framework_template.zip';

  if (path.basename(outputZipName) !== outputZipName) {
    throw new Error(`outputZipName cannot contain path separators: "${outputZipName}"`);
  }

  const outputZipPath = path.resolve(rootDir, outputZipName);
  const stagingDir = path.resolve(rootDir, `.temp_staging_pkg_${Date.now()}`);

  try {
    // 1. Collect all files to include
    const files = collectFiles(rootDir);

    // 2. Prepare staging directory
    if (fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
    fs.mkdirSync(stagingDir, { recursive: true });

    // 3. Copy files to staging
    for (const file of files) {
      if (!fs.existsSync(file.fullPath)) {
        continue;
      }
      const destPath = path.join(stagingDir, file.relPath);
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(file.fullPath, destPath);
    }

    // 4. Sanitize package.json and package-lock.json inside staging
    const stagedPkgPath = path.join(stagingDir, 'package.json');
    if (fs.existsSync(stagedPkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(stagedPkgPath, 'utf8'));
      pkg.name = 'narrative-vault-framework-template';
      pkg.description = 'Universal Multiverse & Fiction Framework and Obsidian Vault Template';
      fs.writeFileSync(stagedPkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    }

    const stagedLockPath = path.join(stagingDir, 'package-lock.json');
    if (fs.existsSync(stagedLockPath)) {
      const lock = JSON.parse(fs.readFileSync(stagedLockPath, 'utf8'));
      lock.name = 'narrative-vault-framework-template';
      fs.writeFileSync(stagedLockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
    }

    // 5. Remove any existing archive
    if (fs.existsSync(outputZipPath)) {
      fs.unlinkSync(outputZipPath);
    }

    // 6. Compress staging contents into ZIP archive
    createZipArchive(stagingDir, outputZipPath);

    const stat = fs.statSync(outputZipPath);

    // Mirror archive to parent directory only if explicitly requested
    let parentZipPath = null;
    if (options.mirrorToParent) {
      const parentDir = path.dirname(rootDir);
      parentZipPath = path.join(parentDir, outputZipName);
      if (fs.existsSync(parentDir) && parentDir !== rootDir) {
        try {
          fs.copyFileSync(outputZipPath, parentZipPath);
        } catch {
          // non-critical
        }
      }
    }

    return {
      success: true,
      archivePath: outputZipPath,
      parentArchivePath: (parentZipPath && fs.existsSync(parentZipPath)) ? parentZipPath : null,
      fileCount: files.length,
      sizeBytes: stat.size,
    };
  } finally {
    // 7. Cleanup staging directory
    if (fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
  }
}

// Direct execution from CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  console.log('[PACKAGER] Generating universal narrative vault template...');
  const result = packageTemplate();
  console.log(`[PACKAGER] Success! Created ${path.basename(result.archivePath)} (${result.fileCount} files, ${(result.sizeBytes / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`[PACKAGER] Archive location: ${result.archivePath}`);
}
