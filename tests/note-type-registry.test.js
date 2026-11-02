import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_SCHEMAS, UNSCHEMED_NOTE_TYPES } from '../tools/templates/template-validator.js';

// The validator registry is the source of truth; the templates README documents it.
// This test keeps the two from drifting and keeps dead types out of the registry.
describe('note type registry', () => {
  const readme = fs.readFileSync(path.join(process.cwd(), '99_System', 'Templates', 'README.md'), 'utf8');

  it('documents every operational (unschemed) note type in the templates README', () => {
    const missing = Object.keys(UNSCHEMED_NOTE_TYPES).filter((type) => !readme.includes(`\`${type}\``));
    expect(missing, `undocumented note types: ${missing.join(', ')}`).toEqual([]);
  });

  it('never registers a type both with and without a schema', () => {
    const both = Object.keys(UNSCHEMED_NOTE_TYPES).filter((type) => type in TEMPLATE_SCHEMAS);
    expect(both).toEqual([]);
  });

  it('gives every schema a distinct expected type', () => {
    const expected = Object.values(TEMPLATE_SCHEMAS).map((schema) => schema.expectedType).filter(Boolean);
    expect(new Set(expected).size).toBe(expected.length);
  });
});
