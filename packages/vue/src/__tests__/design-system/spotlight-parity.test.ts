// @vitest-environment node
/**
 * Spotlight's API parity with its design-system manifest (#57): the parts,
 * data attributes, declared props and emits. Runs in Node because the kit
 * renders on the server.
 */
import { describe, it } from 'vitest';
import { expectVueParity } from '@artisanpack-ui/testing/vue';
import { Spotlight } from '../../components/navigation';

describe('design-system parity', () => {
  // remote changes filtering, and recent and recentLabel show stored
  // choices: none shows in a server render. Both are covered in spotlight.test.ts.
  it('Spotlight matches its manifest', () =>
    expectVueParity(Spotlight as Parameters<typeof expectVueParity>[0], 'Spotlight', {
      ignoreEffects: ['remote', 'recent', 'recentLabel'],
    }));
});
