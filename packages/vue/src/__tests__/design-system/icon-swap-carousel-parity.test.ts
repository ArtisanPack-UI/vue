// @vitest-environment node
/**
 * Icon, Swap and Carousel (#65) API parity with their design-system
 * manifests. Runs in Node because the kit renders on the server. Behavior is
 * in utility/Icon.test.ts, utility/Swap.test.ts and display/carousel.test.ts.
 */
import { describe, it } from 'vitest';
import { expectVueParity } from '@artisanpack-ui/testing/vue';
import { Carousel } from '../../components/display';
import { Icon, Swap } from '../../components/utility';

type KitComponent = Parameters<typeof expectVueParity>[0];

describe('design-system parity: utility wave', () => {
  it('Icon matches its manifest', () => expectVueParity(Icon as unknown as KitComponent, 'Icon'));

  it('Swap matches its manifest', () => expectVueParity(Swap as unknown as KitComponent, 'Swap'));

  // playLabel and pauseLabel only render with autoplay, which the parity render leaves off.
  it('Carousel matches its manifest', () =>
    expectVueParity(Carousel as unknown as KitComponent, 'Carousel', {
      ignoreEffects: ['loop', 'interval', 'playLabel', 'pauseLabel'],
    }));
});
