import { describe, it, expect } from 'vitest';
import { sanitizeAndConvertHtml } from '../tools/clipper/sanitizer.js';

describe('DOM Sanitizer and Markdown Converter', () => {
  it('should strip nav, footer, script, and reference brackets from HTML', () => {
    const rawHtml = `
      <!DOCTYPE html>
      <html>
        <head><title>Primary Energy | Universe Primary Wiki</title></head>
        <body>
          <nav id="mw-navigation"><a href="/">Home</a></nav>
          <div id="content">
            <h1 id="firstHeading">Primary Energy</h1>
            <div class="mw-editsection"><a href="#">edit</a></div>
            <p>Primary Energy (Aether Flow)<sup class="reference" id="cite_ref-1"><a href="#cite_note-1">[1]</a></sup> is the primary energy source cultivated by practitioners.</p>
            <div class="ad-container">Advertisement banner</div>
            <h2>Mechanics</h2>
            <p>Energy is stored within physiological channels.</p>
            <table>
              <thead><tr><th>Tier</th><th>Title</th></tr></thead>
              <tbody><tr><td>1-10</td><td>Initiate Rank</td></tr></tbody>
            </table>
          </div>
          <footer class="footer"><p>Copyright Wiki</p></footer>
        </body>
      </html>
    `;

    const result = sanitizeAndConvertHtml(rawHtml, 'https://universe-primary.fandom.com/wiki/Primary_Energy');

    expect(result.title).toBe('Primary Energy');
    expect(result.markdown).toContain('# Primary Energy');
    expect(result.markdown).toContain('Primary Energy (Aether Flow)');
    expect(result.markdown).not.toContain('[1]');
    expect(result.markdown).not.toContain('Advertisement banner');
    expect(result.markdown).not.toContain('Home');
    expect(result.markdown).not.toContain('Copyright Wiki');
    expect(result.markdown).toContain('| Tier | Title |');
    expect(result.markdown).toContain('| 1-10 | Initiate Rank |');
  });

  it('should extract structured infobox key-values', () => {
    const rawHtml = `
      <html>
        <body>
          <div class="portable-infobox">
            <h2 class="pi-title">Energy Core</h2>
            <div class="pi-item pi-data" data-source="origin">
              <h3 class="pi-data-label">Origin</h3>
              <div class="pi-data-value">Innate Core</div>
            </div>
            <div class="pi-item pi-data" data-source="types">
              <h3 class="pi-data-label">Types</h3>
              <div class="pi-data-value">Radiant, Kinetic, Latent</div>
            </div>
          </div>
          <div id="content"><p>Description text here.</p></div>
        </body>
      </html>
    `;

    const result = sanitizeAndConvertHtml(rawHtml, 'https://example.com/Energy_Core');

    expect(result.infobox).toBeDefined();
    expect(result.infobox['Origin']).toBe('Innate Core');
    expect(result.infobox['Types']).toBe('Radiant, Kinetic, Latent');
  });
});

