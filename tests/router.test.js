import { describe, it, expect } from 'vitest';
import { extractAtomicClaims, evaluateThreePillars, routeClaimsToDomains } from '../tools/ingestor/claim-router.js';

describe('Engine 2 Step 1 & 2: Claim Extraction and 3 Pillars Domain Router', () => {
  const sampleMarkdown = `
# Primary Energy System

Primary Energy System is the foundational bio-spiritual energy cultivated in Universe Primary.

## Nature and Mechanics
- **Energy Conversion:** Converted from ambient world essence through physiological channels.
- **Innate Rank:** Born practitioners awaken with foundational energy thresholds.
- **Recovery:** Recovered through deep meditation and rest.

## Progression Ranks
| Rank Range | Title | Characteristics |
|---|---|---|
| 1-10 | Initiate Rank | Foundational circulation |
| 11-20 | Adept Rank | Projection capability |
| 91-98 | Master Realm | Qualitative domain expansion |

## Related Arts
- **Specialized Meditation Technique:** Clan inner strength method that circulates energy through vital meridians.
- **Resonant Silver:** A rare dense metal used in forging that enhances energy conduction.
`;

  const sampleSidecar = {
    title: 'Primary Energy System',
    franchise: 'Universe_Primary',
    infobox: {
      Origin: 'Innate Core',
      'Other names': 'Core Flow',
    },
  };

  it('should extract atomic claims categorized by functional domain', () => {
    const claims = extractAtomicClaims(sampleMarkdown, sampleSidecar);
    expect(claims.length).toBeGreaterThan(0);
    expect(claims.some(c => c.type === 'definition')).toBe(true);
    expect(claims.some(c => c.type === 'mechanic')).toBe(true);
    expect(claims.some(c => c.type === 'progression_table')).toBe(true);
  });

  it('should apply the 3 Pillars Rule to distinguish Modular Dossiers from Catalog sub-entries', () => {
    // "Primary Energy System":
    // 1. Own rules? Yes (conversion, recovery)
    // 2. Progression scale? Yes (ranks 1-99)
    // 3. Reusable across multiple entities/arcs? Yes
    const energySystemPillars = evaluateThreePillars({
      hasOwnRules: true,
      hasProgressionScale: true,
      isReusableAcrossArcs: true,
    });
    expect(energySystemPillars.isModularDossier).toBe(true);

    // "Specialized Meditation Technique" (Single Technique):
    // 1. Own rules? Yes
    // 2. Progression scale? Internal stages only
    // 3. Reusable across multiple arcs? No (Specific clan art)
    const techniquePillars = evaluateThreePillars({
      hasOwnRules: true,
      hasProgressionScale: false,
      isReusableAcrossArcs: false,
    });
    expect(techniquePillars.isModularDossier).toBe(false);
    expect(techniquePillars.routingTarget).toBe('catalog_subentry');
  });

  it('should route and isolate exclusive scope vs delegated scope with wikilinks', () => {
    const claims = extractAtomicClaims(sampleMarkdown, sampleSidecar);
    const routed = routeClaimsToDomains(claims, 'Universe_Primary');

    expect(routed.dossiers['Primary_Energy_System']).toBeDefined();
    const energyDossier = routed.dossiers['Primary_Energy_System'];
    expect(energyDossier.domain).toBe('sistema_poder');

    // Practitioner rank requirements should delegate via wikilink
    expect(energyDossier.delegatedWikilinks).toContain('[[Dossier - Specialized Practitioner Ranks]]');
  });
});

