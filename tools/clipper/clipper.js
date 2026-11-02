import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { dump as yamlDump } from 'js-yaml';
import { sanitizeAndConvertHtml } from './sanitizer.js';
import { detectFranchiseWithRules, ensureCanonScaffold, assertFranchiseName } from './franchise-resolver.js';

const USER_AGENT = 'narr-clipper/1.0 (+https://github.com/Kitsune-27295/frameworks)';
const MAX_BODY_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Standard franchise mapping delegating to centralized franchise-resolver
 */
export function detectFranchise(urlStr, explicitFranchise = null, vaultRoot = process.cwd()) {
  const res = detectFranchiseWithRules({ url: urlStr, explicitFranchise, vaultRoot });
  return res.franchise;
}

/**
 * Clean slug generation for file names with Windows reserved name and length protections
 */
export function slugifyTitle(title) {
  let slug = (title || '')
    .replace(/\(.*?\)/g, '') // remove parentheticals
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9\s_-]/g, '') // remove special symbols
    .trim()
    .replace(/[\s-]+/g, '_');

  if (!slug) {
    slug = 'Untitled';
  }

  if (slug.length > 80) {
    slug = slug.slice(0, 80).replace(/_+$/, '');
  }

  if (/^(CON|PRN|AUX|NUL|COM\d|LPT\d)$/i.test(slug)) {
    slug = `Doc_${slug}`;
  }

  return slug;
}

/**
 * Checks whether a hostname resolves to private, loopback, or link-local address (SSRF guard).
 */
function isPrivateOrLoopbackHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '::1') return true;
  if (/^127\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(h)) return true;
  if (/^169\.254\.\d+\.\d+$/.test(h)) return true;
  return false;
}

/**
 * Reads response body with a maximum byte limit to avoid memory exhaustion
 */
async function readResponseWithLimit(res, maxBytes = MAX_BODY_BYTES) {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.length;
    if (totalBytes > maxBytes) {
      throw new Error(`Response body exceeded maximum allowed limit of ${maxBytes} bytes.`);
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Validates URL scheme and destination
 */
function validateUrl(urlStr) {
  const parsed = new URL(urlStr);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Invalid protocol "${parsed.protocol}". Only http: and https: are allowed.`);
  }
  if (isPrivateOrLoopbackHost(parsed.hostname)) {
    throw new Error(`SSRF protection: requests to private or loopback host "${parsed.hostname}" are forbidden.`);
  }
  return parsed;
}

/**
 * Clips a URL or HTML string and saves .md + .json sidecar
 */
export async function clipUrlOrHtml({ url, html, franchise = null, vaultRoot = process.cwd(), dryRun = false }) {
  let rawHtml = html;

  if (!rawHtml && url) {
    const parsedUrl = validateUrl(url);

    // Fandom / MediaWiki native API fast-path
    const isFandom = /(^|\.)fandom\.com$/i.test(parsedUrl.hostname);
    const fandomMatch = parsedUrl.pathname.match(/^\/wiki\/(.+)$/);

    if (isFandom && fandomMatch) {
      try {
        const domain = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const pageTitle = decodeURIComponent(fandomMatch[1]);
        const apiUrl = `${domain}/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&format=json&redirects=1`;
        const apiRes = await fetch(apiUrl, {
          headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
          signal: AbortSignal.timeout(20000),
        });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData?.parse?.text?.['*']) {
            rawHtml = `<!DOCTYPE html><html><head><title>${apiData.parse.title}</title></head><body><h1 id="firstHeading">${apiData.parse.title}</h1>${apiData.parse.text['*']}</body></html>`;
          }
        }
      } catch {
        // Fall through to standard fetch
      }
    }

    if (!rawHtml) {
      const res = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: HTTP ${res.status} ${res.statusText}`);
      }

      rawHtml = await readResponseWithLimit(res, MAX_BODY_BYTES);
    }
  }

  if (!rawHtml) {
    throw new Error('No HTML content provided or fetched.');
  }

  const resolved = detectFranchiseWithRules({ url: url || '', explicitFranchise: franchise, vaultRoot });
  const targetFranchise = assertFranchiseName(resolved.franchise);
  const canonTier = resolved.canonTier;

  // Auto-scaffold 7 canonical subdirectories if not yet present
  ensureCanonScaffold({ franchise: targetFranchise, vaultRoot });

  const parsed = sanitizeAndConvertHtml(rawHtml, url);
  if (parsed.title.toLowerCase().includes('just a moment') || parsed.title.toLowerCase().includes('attention required')) {
    throw new Error(`Anti-bot challenge page intercepted for ${url}. Aborting clip. Use --html-file with a browser capture instead.`);
  }

  let slug = slugifyTitle(parsed.title);

  const sourcesDir = fs.existsSync(path.join(vaultRoot, 'Canon', targetFranchise, '00_Sources'))
    ? path.join(vaultRoot, 'Canon', targetFranchise, '00_Sources')
    : path.join(vaultRoot, 'Canon', targetFranchise, 'Sources');

  let mdPath = path.join(sourcesDir, `${slug}.md`);
  let jsonPath = path.join(sourcesDir, `${slug}.json`);

  // Check Idempotency via SHA-256 and handle collisions on different URLs
  if (fs.existsSync(jsonPath)) {
    try {
      const existingMeta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (existingMeta.content_sha256 === parsed.contentHash) {
        return {
          status: 'unchanged',
          slug,
          franchise: targetFranchise,
          mdPath,
          jsonPath,
          contentHash: parsed.contentHash,
        };
      }
      if (existingMeta.url && url && existingMeta.url !== url) {
        // Different URL with same title: append hash suffix to preserve both
        slug = `${slug}_${parsed.contentHash.slice(0, 8)}`;
        mdPath = path.join(sourcesDir, `${slug}.md`);
        jsonPath = path.join(sourcesDir, `${slug}.json`);
      }
    } catch {
      // Re-write if corrupted
    }
  }

  const sidecar = {
    source_id: `src_${slug}_${parsed.contentHash.slice(0, 8)}`,
    url: url || 'local',
    title: parsed.title,
    franchise: targetFranchise,
    canon_tier: canonTier,
    captured_at: new Date().toISOString(),
    content_sha256: parsed.contentHash,
    categories: parsed.categories,
    infobox: parsed.infobox,
  };

  if (!dryRun) {
    fs.mkdirSync(sourcesDir, { recursive: true });

    const frontmatterObj = {
      title: parsed.title,
      note_type: 'canon-source',
      cosmology: targetFranchise,
      canon_tier: canonTier,
      source_url: url || 'local',
      is_processed: false,
    };
    const frontmatter = `---\n${yamlDump(frontmatterObj, { lineWidth: -1 }).trim()}\n---\n\n`;

    fs.writeFileSync(mdPath, frontmatter + parsed.markdown, 'utf8');
    fs.writeFileSync(jsonPath, JSON.stringify(sidecar, null, 2), 'utf8');
  }

  return {
    status: 'created',
    slug,
    franchise: targetFranchise,
    mdPath,
    jsonPath,
    contentHash: parsed.contentHash,
  };
}

// CLI entrypoint
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  let url = '';
  let franchise = null;
  let htmlPath = null;
  let dryRun = false;
  let vaultRoot = process.env.VAULT_ROOT || process.cwd();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      console.log('Usage: node tools/clipper/clipper.js <url> [--franchise <name>] [--html-file <path>] [--vault <path>] [--dry-run]');
      console.log('Note: For protected pages with Cloudflare/anti-bot challenges, save HTML via browser and use --html-file.');
      process.exit(0);
    } else if (args[i] === '--franchise' || args[i] === '-f') {
      franchise = args[++i];
    } else if (args[i] === '--html-file') {
      htmlPath = args[++i];
    } else if (args[i] === '--vault') {
      vaultRoot = path.resolve(args[++i]);
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    } else if (!url && !args[i].startsWith('-')) {
      url = args[i];
    }
  }

  if (!url && !htmlPath) {
    console.log('Usage: node tools/clipper/clipper.js <url> [--franchise <name>] [--html-file <path>] [--vault <path>] [--dry-run]');
    process.exit(1);
  }

  let htmlContent = null;
  if (htmlPath) {
    htmlContent = fs.readFileSync(htmlPath, 'utf8');
  }

  clipUrlOrHtml({ url, html: htmlContent, franchise, vaultRoot, dryRun })
    .then(res => {
      console.log(`[CLIPPER] Result: ${res.status.toUpperCase()} -> ${res.slug} (${res.franchise})`);
      console.log(`[CLIPPER] MD: ${res.mdPath}`);
      console.log(`[CLIPPER] JSON: ${res.jsonPath}`);
    })
    .catch(err => {
      console.error(`[CLIPPER ERROR]`, err.message);
      process.exit(1);
    });
}
