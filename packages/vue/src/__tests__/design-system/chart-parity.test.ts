// @vitest-environment node
/**
 * API parity with the design-system manifest (#41, D-016) for Chart (#63).
 * Runs in Node because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import { expectVueParity as expectParity } from '@artisanpack-ui/testing/vue';
import { Chart } from '../../components/data';

type KitComponent = Parameters<typeof expectParity>[0];

describe('design-system parity: chart', () => {
  it('Chart matches its manifest', () => expectParity(Chart as unknown as KitComponent, 'Chart'));
});
